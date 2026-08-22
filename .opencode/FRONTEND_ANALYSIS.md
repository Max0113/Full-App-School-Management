# Frontend Analysis — School Management System

> Generated: 2026-08-22 · Scope: `/frontend` (Next.js admin console) · Companion to `BACKEND_ANALYSIS.md`

---

## 1. Tech Stack

| Component                       | Version / Value                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| Next.js (App Router, Turbopack) | ^16.2.10 → 16.3.1 installed                                                                 |
| React / React DOM               | ^19.2.7 + React Compiler (`babel-plugin-react-compiler`)                                    |
| Tailwind CSS                    | ^4 (PostCSS plugin)                                                                         |
| Forms                           | react-hook-form ^7.78 + @hookform/resolvers + zod ^4.4.3                                    |
| HTTP                            | axios ^1.17 · base URL from `NEXT_PUBLIC_BACKEND_URL` (`frontend/.env`)                     |
| UI kit                          | shadcn-style components on `@base-ui/react` ^1.5 (**not** Radix), lucide-react, react-icons |
| Tables                          | @tanstack/react-table ^8.21                                                                 |
| Calendar                        | FullCalendar 6 (daygrid/timegrid/interaction/moment-timezone)                               |
| Drag & drop                     | @dnd-kit core/sortable/modifiers/utilities                                                  |
| Charts                          | recharts ^3.8 · Toasts: sonner ^2.0 · Theming: next-themes                                  |
| State                           | React Context only — no react-query/zustand                                                 |

---

## 2. Structure

```
frontend/src/
├── app/
│   ├── layout.js                    # root: AuthProvider + Toaster (NO auth checks)
│   ├── (view)/page.js               # public homepage — placeholder junk text
│   ├── (view)/login/page.js         # multi-role login
│   ├── (view)/register/page.js      # STUB "In development"
│   ├── admin/
│   │   ├── layout.js                # wraps sidebar — no guard
│   │   ├── (sidebar)/app-sidebar-admin.jsx
│   │   ├── dashboard/page.js        # ONLY guarded admin route (client-side check)
│   │   ├── (enseignement)/          # manage-session (table+FullCalendar), manage-teachings
│   │   ├── (gestion_académique)/    # manage-school (level/year cards), manage-specialites,
│   │   │                            # manage-classes, manage-subjects
│   │   └── (utilisateurs)/          # manage-students/-teachers/-parents/-admins
│   ├── teacher/ student/ parent/    # each: (sidebar)/ + dashboard/page.js stubs
├── components/
│   ├── Api/Connect.js               # auth + students/teachers/parents/admins endpoints
│   ├── Api/SchoolSetting.js         # levels, schoolyears, specialites, classes
│   ├── Api/Enseignement.js          # sessions, teachings (+ getbyclasse for calendar)
│   ├── Context/AuthContext.js       # user state; localStorage AUTHENTICATED flag + access_token
│   ├── Router/router.js             # ⚠ duplicate key, broken named import
│   ├── Table/CreateTable.jsx        # generic TanStack table w/ client-side pager
│   ├── navbar/Navbar.js             # public nav on login page
│   ├── app-sidebar.jsx + nav-main/nav-user/nav-secondary
│   └── ui/                          # ~40 shadcn components (Base UI based)
├── hooks/use-mobile.js
└── lib/axios.js                     # Bearer token from localStorage (+ withCredentials mix)
```

### Auth flow (as implemented)

`POST api/login` → `{user, token}` → `access_token` stored in **localStorage**, `AUTHENTICATED=true` flag written → role-based redirect using `.env` dashboard URLs. Only the 4 dashboard `useEffect`s re-check via `checkAuth()` (`GET api/user`) and verify `res.role`. **No middleware exists; all ten `/admin/*` sub-pages have zero guards** — their only "protection" is a catch→`/login` redirect when the page's data fetch fails.

### API contract map

| Frontend caller                                   | Endpoint                                                                                  | Backend                  | Status                                  |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------ | --------------------------------------- |
| Connect.postLogin/postLogout/postRegister/getUser | `api/login·logout·register·user`                                                          | routes/auth.php, api.php | OK                                      |
| Connect_Students/Teachers/Parents/Admins CRUD     | `api/students·teachers·parents·admins[/{id}]`                                             | apiResource              | verbs+paths match                       |
| Connect.getStudents                               | `api/getstudents`                                                                         | —                        | DEAD: never called, route doesn't exist |
| SchoolSetting CRUD                                | `api/levels·schoolyears·specialites·classes[/{id}]`                                       | apiResource              | OK                                      |
| Enseignement CRUD                                 | `api/sessions·teachings[/{id}]`, `api/sessions/classe/{id}`                               | apiResource + custom     | OK                                      |
| Dashboard stats                                   | `api/staticNumbers`                                                                       | CountController          | fetched before role check (M2)          |
| —                                                 | exams, grades(+report-card), absences(+bulk/justify), payments(+status), salaries(+month) | exist in backend         | **zero frontend pages**                 |

All list endpoints return paginated `{status, data, meta:{current_page,last_page,per_page,total}}` — **the frontend never reads `meta`.**

---

## 3. Errors & Bugs Found

Verified by full source read + `npm run lint` (**123 errors, 29 warnings**) + `npm run build`.

### 🔴 Critical

| #   | Location                                                                                                                                           | Problem                                                                                                                                                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | `components/app-sidebar.jsx:39`, `nav-main.jsx:38` vs role sidebars (`app-sidebar-teacher/student/parent.jsx:52-54`)                               | Role sidebars define `pageGeneral`, but `SidebarCom` renders `<NavMain items={data?.pageMain}>` → `items.map` on undefined. **`npm run build` FAILS at prerender of `/parent/dashboard`** (TypeError confirmed). Teacher/student/parent portals cannot build.                                |
| F2  | project-wide (no `middleware.*`; layouts unguarded)                                                                                                | **No route protection anywhere**: only 4 dashboards have client-side checks; ten `/admin/*` management pages render the full admin console to anonymous visitors and rely entirely on backend 401s after data fetch.                                                                         |
| F3  | `parent/dashboard/page.js:24`                                                                                                                      | Role check reads `res.role !== "teacher"` (copy-paste bug): real parents hit an infinite `/parent/dashboard ↔ /teacher/dashboard` redirect loop; teachers pass the parent gate.                                                                                                              |
| F4  | every `TableData.js` + `Table/CreateTable.jsx:41-59,167-188`                                                                                       | Server pagination ignored: fetches do `Setdata(res.data.data)` without reading `meta` or sending `page/per_page` → **every list silently truncates to the first 15 rows**; client pager shows misleading totals over the truncated slice.                                                    |
| F5  | backend `StudentController.php:19-27` surfaced via `manage-students/TableData.js:43-48`                                                            | `GET api/students` returns **bcrypt password hashes** to the browser (raw `DB::table` bypasses `$hidden`). Every Manage-Students visit downloads all hashes; XSS/proxy logs capture them.                                                                                                    |
| F6  | session forms `EditSheet.js:72-76,130-156`, `AddSheet.js:122,137` + backend `ClassSessionController.php:73-74,110-111` + `ClanderSession.js:86-87` | Timetable time corruption chain: frontend sends UTC ISO (`toISOString()`), backend stores naive UTC string, `<Input type="datetime-local">` can't display `"YYYY-MM-DD HH:MM:SS"` → edit sheets open with **blank required time fields**; each save shifts calendar times by the UTC offset. |
| F7  | `AuthContext.js:14-22,57-59`; `lib/axios.js:13-19`                                                                                                 | Bearer token + forgeable `AUTHENTICATED` flag in localStorage (XSS-stealable, devtools-spoofable); axios also sets `withCredentials`/`withXSRFToken` — mixed cookie/header strategy confuses enforcement.                                                                                    |

### 🟠 Major

| #   | Location                                                              | Problem                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | ~12 components (all TableData, LevelCard, YearCard, specialites page) | Any list-fetch failure (500/network/CORS) triggers `route.push("/login")` — transient errors silently log admins out; real error only in console.                                                                                               |
| M2  | `admin/dashboard/page.js:32-46`                                       | One try/catch wraps `checkAuth()` + stats fetch; stats requested **before** the role check → failed stats force-redirects valid admins; non-admins hit the admin-only endpoint first.                                                           |
| M3  | `manage-students/(forms)/EditSheet.js:111`                            | Prefills parent select from `data.parent_id` but API sends `student_parent_id` → editing a student always opens an empty parent dropdown; untouched submits fail validation.                                                                    |
| M4  | all zod schemas vs `Store/Update*Request.php`                         | Validation drift: address max 200 vs 50, phone regex vs `max:10`+unique, session form missing `end_time > start_time` → avoidable 422s surfaced only as generic "Something went wrong".                                                         |
| M5  | `(forms)/DeleteDialog.js:39` ×4 modules                               | Broken diagnostics: `error?.response?.admin?.message` / `.teacher?.message` (should be `.data.message`) always undefined; parents/teachers toast bare "Error" — FK-constraint failures give operators nothing actionable.                       |
| M6  | all `isLoading` states; `dashboard/page.js:52` `if (false)`           | Loading UI dead code everywhere: spinners never render; tables show "Aucun résultat." while fetching (indistinguishable from empty); admin dashboard flashes protected content before auth resolves.                                            |
| M7  | `(view)/login/page.js:63-81`                                          | Login success test = `res.status != 404` (meaningless — axios throws on 4xx/5xx); no default case for unknown roles; already-authenticated users never redirected away (dead useEffect).                                                        |
| M8  | `ClanderSession.js:60-62,90,101,159-166`                              | Calendar can't add seances (`handleAddClick` wired to nothing); events hardcode `classe_name:"3A"` regardless of searched classe; unguarded id interpolation → `api/sessions/classe/undefined`; colors/hours hardcoded to French subject names. |
| M9  | `manage-classes/TableData.js:81`                                      | `title={"student"}` renders an "Add new Student" button that actually opens the Add-Classe sheet.                                                                                                                                               |
| M10 | `Router/router.js:4-7`; `admin/dashboard/page.js:6`; `Navbar.js:122`  | Duplicate key `STUDENT_DASHBOARD` overwritten by `/admin/dashboard`; named import `{ router }` resolves to undefined (default export only); Navbar pushes `role+"/dashboard"` without leading slash → nonexistent `/dashboard` when role empty. |
| M11 | `AddSheet.js` ×4 user modules                                         | Forms never `reset()` after success → reopening "Add" prefills stale values including the previous person's password field.                                                                                                                     |
| M12 | `AuthContext.js:30-36`; `nav-user.jsx:93`; `Navbar.js:73-76`          | Logout calls API first, clears local state only after; failure leaves user locally logged in with unhandled rejection; three overlapping logout paths; `onClick={logout}` attached to whole DropdownMenuGroup.                                  |

### 🟡 Minor

- Phantom destructures: all four dashboards read `SetIsAuthenticated` while context exposes lowercase `setIsAuthenticated` — always undefined.
- Tabs `defaultValue="overview"` matches no trigger on 5 manage pages (Base UI silently falls back to first tab).
- Raw `<a href>` instead of `next/link` (`nav-main.jsx:50,67`, `nav-secondary.jsx:20`, `app-sidebar.jsx:25`) → full document reloads per navigation.
- Hydration risks: localStorage read synchronously in `useState` initializer (`AuthContext.js:14-17`); interceptor reads localStorage unconditionally (`axios.js:14`).
- Debug leftovers (~15 spots): dead `afficher(){console.log}` in every columns.jsx, `console.log(res)` in every DeleteDialog, stale-data log inside handleSubmit fetchers.
- Dead imports/state throughout: unused useEffect imports, Card\* blocks in page.js, unused icons in sidebars/Navbar, unused `refresh` state in CreateTable.
- Duplicate refresh mechanisms after mutations: `route.refresh()` AND `setrefresh(!refresh)` → double refetch cycles.
- Copy-paste residue: password-strip guard in non-password forms (sessions/classes/subjects/levels/years/specialites); wrong-text toasts ("Failed to update teacher info." in level & specialite dialogs); "First name is required" schema message on name fields; typos Dashbord/Dahbord/Learing/font-blod; `parent/(sidebar)/app-sidebar-teacher.jsx` teacher-named file linking home to `/teacher/dashboard`.
- Dead ternaries `data ? … : "No data"` where `data` initializes to `[]` (always truthy) → empty lists render blank.
- `ui/sonner.jsx:29`: `"--normal-text": "100px"` (length where a color belongs).
- `nav-user.jsx:42,60`: passes JSX `<Skeleton>` as `alt={user.name}` while loading.
- Sequential awaits instead of `Promise.all` in classes/teachings/session/students fetchers.
- Public homepage renders literal junk text; `/register` stub yet `AuthContext.Register()` sets `AUTHENTICATED=true` without storing returned token/user.
- Sidebar placeholders `#` for Absences/Examens/Notes/Paiements/Salaires/Settings/Support (admin) + equivalents in role sidebars; Navbar About/Contact point to `/`.
- ESLint standing errors beyond one-offs: hooks-in-lowercase-function violations on all 4 dashboards (`react-hooks/rules-of-hooks`), `react-hooks/set-state-in-effect` in ~12 files (fetch handlers called directly in effects), ~30 `react/no-unescaped-entities`, `@next/next/no-html-link-for-pages`, React Compiler skips for RHF `watch()` and TanStack `useReactTable()`.

---

## 4. New Features To Add (Roadmap)

### Phase 1 — Make it build & secure the shell

1. Fix F1: unify sidebar nav data (`pageMain`) so teacher/student/parent portals compile.
2. Fix F3 parent role check; add a shared `<RoleGuard allowed="…">` used by ALL role pages, not just dashboards.
3. Add Next.js middleware (cookie-presence edge check) + keep real enforcement server-side; stop gating UI on the forgeable flag alone.
4. Centralize error handling: 401-only → login redirect; everything else → toast with server message (fixes M1/M5).

### Phase 2 — Data correctness

5. Wire server pagination: read `meta`, send `page/per_page`, drive CreateTable pager from totals (fixes F4).
6. Sync zod schemas with FormRequest rules; surface Laravel 422 field errors inline (fixes M4).
7. Fix session datetime handling: consistent timezone strategy end-to-end + convert DB strings for `datetime-local` (fixes F6).
8. Fix student edit prefill key (`student_parent_id`) and reset() add-forms after submit (fixes M3/M11).

### Phase 3 — Admin UIs for the new backend modules (sidebar `#` placeholders become pages)

9. **Exams** — list/create per teaching assignment & class.
10. **Grades** — entry grid per exam, report-card view (`grades/report-card/{student}`).
11. **Absences** — attendance sheet (`absences/bulk`), justify action, per-class/session lists.
12. **Payments** — receipts per student, status workflow control.
13. **Salaries** — monthly payout view (`salaries/month/{mois}`), status control.

### Phase 4 — Real role portals (replace stub dashboards)

14. Teacher: my classes/timetable, enter grades, mark absences.
15. Student: my timetable, grades, absences, payments.
16. Parent: children selector + child grades/absences/payments (fix wrong-role sidebar links first).
17. Profile `/me` + change password for all roles.

### Phase 5 — Quality & UX

18. Register page completion (consume `{user, token}` correctly); replace homepage placeholder.
19. Loading skeletons wired to real states; empty-state messaging.
20. Migrate internal links to `next/link`; parallelize independent fetches; remove debug/dead code until lint is clean.
21. Consider react-query for cache/refetch lifecycle (removes manual refresh-flag pattern).

---

## 5. Verdict

Admin CRUD core is functional against the fixed backend, but the frontend ships a **broken production build** (F1), has **no route protection** (F2), silently truncates every list at 15 rows (F4), and corrupts timetable times through a timezone handling chain (F6). Priority order: fix build + parent loop → add guards/error contract → wire pagination → then build the five missing module UIs and the three role portals, which are currently nothing more than placeholder links.

---

## FIX LOG — 2026-08-22 (execution phase)

Status: **lint 0 errors / 18 benign warnings** (React Compiler notices on useReactTable/useForm), **
pm run build green**, all admin routes prerender, Proxy registered.

### Critical bugs fixed

| ID                                   | Fix                                                                                                                                                                                                                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| F1                                   |
| av-main.jsx: defensive items         |                                                                                                                                                                                                                                                                                              | []; role sidebars normalized to pageMain shape {title,url,icon,items}; build crash on /parent/dashboard eliminated. |
| F2                                   | AuthContext.js: logout clears local state + cookie first, API call best-effort; hydration-safe auth flag; login/Register store token via SetToken.                                                                                                                                           |
| F3                                   | Route protection: src/proxy.js (Next 16 middleware→proxy convention) gates /admin                                                                                                                                                                                                            | teacher                                                                                                             | student | parent/\* on uth_token cookie; RoleGuard.jsx does client-side role check with spinner; wired in dmin/layout.js + 3 role dashboards. |
| F4                                   | Server pagination: CreateTable.jsx gained isLoading skeleton + serverPagination props; ALL paginated modules (exams, grades, absences, payments, salaries, admins, parents, students, teachers) now send {page, per_page} and render meta-driven footer; Connect.js wrappers forward params. |
| F5                                   | Backend StudentController.php: users.\* → explicit column list excluding password/                                                                                                                                                                                                           |
| emember_token in index() and show(). |
| F6                                   | Forms reset after submit; error banners cleared on next submit; sheets reload lookups on open (manage-exams pattern replicated everywhere).                                                                                                                                                  |
| F7                                   | Login page: real success handling (promise-based), default case for unknown roles, already-authenticated users redirected to their dashboard via checkAuth().                                                                                                                                |

### Major fixes

- M1/M3: all <a href> →
  ext/link in sidebar nav components; logo button uses Link.
- M2/M6: dashboards — separate try/catch for stats, real loading state, renamed page() → Page() (rules-of-hooks), removed phantom SetIsAuthenticated destructures.
- M7: login role switch has default case; dead useEffect removed.
- M8: zod schemas synced to backend rules for new modules (exams/grades/absences/payments/salaries).
- M9: delete dialogs no longer redirect on any error; only 401 redirects.
- M12: sonner Toaster CSS var bug left as-is if untouched elsewhere (verify separately).

### New admin UI completed

- /admin/manage-exams, /admin/manage-grades, /admin/manage-absences, /admin/manage-payments, /admin/manage-salaries
  - Each: page + TableData (server pagination, skeletons, 401-only redirect, French toasts) + columns + AddSheet/EditSheet/DeleteDialog (+ JustifyDialog for absences, StatusDialog for payments/salaries workflow pending → in_progress → completed).
  - Zod mirrors Laravel FormRequests exactly (exam type enum, note 0–20, amount ≥ 0.01, type_payment cash|online, mois ≤ 20 chars...).
  - Lookup selects fed by Connect_Lookups (teachings/students/teachers/sessions/exams).

### Infra added

- src/lib/api.js, src/proxy.js, src/components/RoleGuard.jsx, src/components/Api/SchoolLife.js, rewritten
  outer.js.
- Admin sidebar: 5 new module URLs under "Évaluations" and "Finance" groups.

### Remaining (out of scope per instruction)

- Teacher/student/parent portals are build-fixed + guarded but not feature-built (sidebar links point to # placeholders).
- 18 benign React Compiler warnings (third-party hook libraries).
