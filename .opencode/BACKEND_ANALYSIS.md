# Backend Analysis — School Management System

> Generated: 2026-08-21 · Scope: `/Backend` (Laravel API)

---

## 1. Tech Stack

| Component                        | Version / Value                              |
| -------------------------------- | -------------------------------------------- |
| PHP                              | ^8.2                                         |
| Laravel                          | ^12.0                                        |
| Sanctum (API tokens + abilities) | ^4.0                                         |
| Breeze (auth scaffold)           | ^2.4                                         |
| Pest (testing)                   | ^3.8                                         |
| DB (default)                     | SQLite (`DB_CONNECTION=sqlite`), MySQL-ready |
| Queue / Cache / Session          | database driver                              |

---

## 2. Structure

```
Backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/                  # Breeze API auth (register, login, logout,
│   │   │   │                          #   forgot/reset password, email verification)
│   │   │   ├── AdminController.php        # CRUD admins
│   │   │   ├── ClassSessionController.php # CRUD sessions (timetable slots)
│   │   │   ├── ClasseController.php       # CRUD classes
│   │   │   ├── CountController.php        # dashboard counters
│   │   │   ├── LevelController.php        # CRUD levels
│   │   │   ├── SchoolYearController.php   # CRUD school years
│   │   │   ├── SpecialiteController.php   # CRUD specialties
│   │   │   ├── StudentController.php      # CRUD students (users table)
│   │   │   ├── StudentParentController.php# CRUD parents
│   │   │   ├── SubjectController.php      # CRUD subjects
│   │   │   ├── TeacherController.php      # CRUD teachers
│   │   │   └── TeachingSubjectClasseController.php # assign teacher+subject+class
│   │   ├── Middleware/EnsureEmailIsVerified.php
│   │   ├── Requests/                  # FormRequests only for User/Teacher/Parent/Admin
│   │   └── Resources/                 # StudentResource, TeacherResource, StudentParentResource
│   ├── Models/
│   │   ├── Authenticatable (4 separate tables):
│   │   │   ├── User.php          → role "student" (hardcoded)
│   │   │   ├── Teacher.php       → role "teacher"
│   │   │   ├── StudentParent.php → role "parent"
│   │   │   └── Admin.php         → role "admin"
│   │   └── Domain: Classe, Level, Specialite, SchoolYear, Subject,
│   │              TeachingSubjectClasse, ClassSession
│   └── Providers/AppServiceProvider.php
├── bootstrap/app.php                  # middleware aliases: verified, abilities, ability
├── config/auth.php                    # 4 session guards: web/admin/teacher/parent
├── database/
│   ├── migrations/                    # 24 migrations
│   ├── factories/                     # User, Teacher, StudentParent, Admin, SchoolYear, Level, Classe
│   └── seeders/DatabaseSeeder.php     # demo accounts (⚠ hardcoded credentials)
├── routes/
│   ├── api.php                        # admin-only apiResources; student/teacher groups EMPTY
│   └── auth.php                       # /api/register, /api/login, /api/logout, password reset
└── tests/                             # Breeze defaults only — no domain tests
```

### Data model (implemented)

```
SchoolYear 1─* Classe *─1 Level
Classe      *─1 Specialite        Subject *─1 Specialite
TeachingSubjectClasse = (Teacher, Subject, Classe)   ← pivot entity
ClassSession *─1 TeachingSubjectClasse
User(student) *─1 StudentParent ; User *─1 Classe
absences(class_session_id, user_id)          ← table ONLY, no model/API
grades(exam_id, user_id) ← exams             ← tables ONLY, no model/API
payments(user_id, admin_id) · salaries(teacher_id, admin_id) ← tables ONLY, no model/API
```

### Auth flow

`POST /api/login` → tries guards `[web, teacher, admin, parent]` sequentially → returns `{user, token}` with Sanctum ability = role. Routes protected by `auth:sanctum` + `ability:admin|teacher|student`.

---

## 3. Errors & Bugs Found

### 🔴 Critical

| #   | Location                                  | Problem                                                                                                                                                                                                                                         |
| --- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | `routes/api.php:50`                       | Route typo **`speialites`** instead of `specialites` — wrong URL exposed to frontend.                                                                                                                                                           |
| C2  | `Auth\RegisteredUserController::store`    | Creates student with `'name'` field, but `users` table uses `firstname`/`lastname` and `'name'` is not fillable → **name silently lost**. Also returns `204 noContent` with **no token**, while login returns one → SPA can't use registration. |
| C3  | `AuthenticatedSessionController::destroy` | If no guard matches, `$user->tokens()` is called on `null` → **500 crash on logout**.                                                                                                                                                           |
| C4  | `routes/auth.php:37`                      | Logout middleware `auth:sanctum,admin,teacher` — invalid mix and **`parent` guard missing** → parents get 401 on logout.                                                                                                                        |
| C5  | `routes/auth.php:16`                      | Login wrapped in `guest` middleware which checks the **default guard only (web)** → once logged-in as student (web), teacher/admin/parent logins from same session are blocked/redirected. Multi-guard conflict.                                |
| C6  | Schema                                    | `payments.amount` & `salaries.amount` are `unsignedTinyInteger` → **max value 255**. Money fields unusable. Same risk pattern in `grades.note`.                                                                                                 |
| C7  | Security                                  | `DatabaseSeeder` commits a real-looking email + plaintext password to the repo.                                                                                                                                                                 |

### 🟠 Major

| #   | Location                            | Problem                                                                                                                                                                                                  |
| --- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | Whole API                           | **No pagination anywhere** — every index does full-table `get()` / `Model::all()`. Breaks at scale.                                                                                                      |
| M2  | `CountController`                   | `count(Model::all())` loads entire tables into memory → must be `Model::count()`.                                                                                                                        |
| M3  | All controllers                     | `show()` methods are **empty** → `GET /resource/{id}` returns empty 200.                                                                                                                                 |
| M4  | `ClassSessionController::show($id)` | Filters by `classes.id`, not the session id → returns sessions of a class, not the requested session (semantic bug).                                                                                     |
| M5  | Controllers                         | Inconsistent response contract: some return `{status, data}`, some Resources, some raw models; creation returns **202/201/200 randomly** (should be 201); destroy returns 202 (should be 200/204).       |
| M6  | Controllers                         | Validation duplicated inline via `$request->validate()` in Classe/Subject/Session/Teaching controllers while others use FormRequests — no single source of truth.                                        |
| M7  | Models                              | **No Eloquent relationships defined** (no `belongsTo`/`hasMany`) despite FKs; controllers use raw `DB::table()` joins that bypass SoftDeletes of joined tables (deleted teacher still appears in joins). |
| M8  | `LoginRequest`                      | Email uniqueness not global across the 4 identity tables → same email can exist as student AND teacher; login resolves by guard order, silently.                                                         |
| M9  | Everywhere                          | `last_login_date` set at **creation time** and never updated on actual login (wrong semantics).                                                                                                          |
| M10 | Tests                               | Only Breeze default tests; **zero coverage** for all school-domain endpoints.                                                                                                                            |

### 🟡 Minor

- `payments.type_payment` enum value `'cache'` should be `'cash'`.
- `User::getRoleAttribute()` hardcoded `'student'` — misleading appends.
- CORS regex allows any localhost port — fine for dev, must be locked for production.
- `findOrfail` typos (work due to PHP case-insensitivity, but inconsistent).
- No throttling on API write endpoints (only login is rate-limited).
- `.env.example` ships SQLite default while project clearly targets MySQL in production.

---

## 4. New Features To Add (Roadmap)

### Phase 1 — Finish the data layer already migrated (tables exist, no code)

1. **Grades module** — `Grade` model + controller + routes: enter grade per exam/student, list per class/exam/student, report-card aggregation.
2. **Exams module** — `Exam` model + controller (exam tied to TeachingSubjectClasse, date, coefficient).
3. **Absences module** — mark attendance per `class_session`, justify absence, list per student/class/session.
4. **Payments module** — student fee payments (fix `amount` type first), receipt listing, status workflow.
5. **Salaries module** — teacher payroll (fix `amount` type first), monthly payout tracking.

### Phase 2 — Role portals (empty route groups today)

6. **Teacher portal**: my classes, my timetable, enter grades, mark absences.
7. **Student portal**: my timetable, my grades, my absences, my payments.
8. **Parent portal**: children list + child grades/absences/payments.

### Phase 3 — Quality & UX

9. Pagination + search/filter on all index endpoints.
10. Timetable **conflict detection** (teacher/class double-booking when creating sessions).
11. Profile endpoints: `GET/PATCH /me`, change password.
12. Fix auth flow: single-guard token issuance, valid logout for all roles, update `last_login_date` on login.
13. Consistent JSON envelope + proper status codes (201/200/204).
14. FormRequest classes for every controller + Eloquent relations replacing raw joins.
15. Feature tests (Pest) for every endpoint; seeders without real credentials.

### Phase 4 — Nice-to-have

16. Notifications (email) for absences/payments due.
17. Report cards / receipts export (PDF).
18. Dashboard analytics expansion (revenue, attendance rate).
19. API documentation (Scribe/OpenAPI).

---

## 5. Verdict

Solid foundation: clean multi-table auth design, complete admin CRUD core, migrations ahead of code. The main debt is **half-finished features** (5 orphan tables, 2 empty role portals, broken register/logout flows) and **inconsistent API conventions**. Priority order: fix Critical bugs C1–C7 → build the 5 missing modules → open the teacher/student/parent portals.

---

# Fix Log — 2026-08-21 (all items below are DONE, verified by 21 passing tests)

## Critical fixes

- **C1** `routes/api.php` — route renamed to `specialites`; frontend `SchoolSetting.js` updated accordingly.
- **C2** `RegisteredUserController` — full student profile validation (firstname/lastname/dob/gender/blood_type/address/phone), cross-account unique email, returns `{user, token}` with **201**.
- **C3/C4** Logout — resolves user via sanctum token, null-safe; route now `auth:sanctum` only (works for all 4 roles); no-token logout → 401.
- **C5** Removed `guest` middleware from login/register (multi-guard conflict gone).
- **C6** New migration `2026_08_21_000001_fix_financial_columns_and_last_login.php`: `payments.amount` & `salaries.amount` → `decimal(10,2)`; `grades.note` → `decimal(4,2)`; enum `'cache'` → `'cash'`; `last_login_date` made nullable on users/student_parents.
- **C7** Seeder rewritten: demo accounts (`*@school.test` / `password`) plus a full demo school — specialites, levels, 4 classes, subjects, 14 teaching assignments, weekly timetable sessions, exams, grades, absences, payments and salaries — so every module has data after `migrate:fresh --seed`.

## Major fixes

- **M1** Paginated envelope (`data` + `meta`) on students, teachers, parents, admins, sessions and all new modules (`?per_page=`).
- **M2** `CountController` uses `Model::count()`.
- **M3** All `show()` methods implemented.
- **M4** `GET sessions/classe/{classe}` added (frontend updated); resource `show()` now truly returns one session.
- **M5** Uniform envelope: 201 store / 200 show+update / 204 destroy / 404 not found.
- **M6** FormRequest classes created for Classe, Subject, ClassSession, TeachingSubjectClasse + every new module.
- **M7** Eloquent relations defined on ALL models; index joins now filter soft-deleted rows of joined tables.
- **M8** `App\Rules\UniqueAccountEmail` enforces email uniqueness across users/teachers/admins/student_parents (applied to register + all account FormRequests). Also fixed: `StoreAdminRequest` validated against the wrong table (`student_parents`).
- **M9** `last_login_date` set at real login (`saveQuietly`, datetime casts added), removed from create flows.
- **M10** Feature tests added: `AdminModulesTest` + `AuthFixesTest`; legacy Breeze tests repaired to `/api` contract. **Suite: 21 passed, 78 assertions.**
- Extra: password brokers in `config/auth.php` pointed at their correct providers; `teaching_subject_classes` down() dropped wrong table name; empty factories completed (Teacher/Admin/Level/SchoolYear) and `ClasseFactory` given its required `specialite_id`.

## New modules (Phase 1 complete)

| Module       | Endpoints (admin, `ability:admin`)                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exams**    | `apiResource exams` (+ filters `classe_id`, `teaching_subject_classe_id`)                                                                                           |
| **Grades**   | `apiResource grades`, `GET grades/report-card/{student}` (per-subject averages + overall)                                                                           |
| **Absences** | `apiResource absences`, `POST absences/bulk` (attendance sheet, idempotent), `PATCH absences/{id}/justify`                                                          |
| **Payments** | `apiResource payments`, `GET payments/student/{student}` (receipts + totals), `PATCH payments/{id}/status` (forward-only workflow), admin_id forced from auth token |
| **Salaries** | `apiResource salaries`, `GET salaries/month/{mois}` (monthly payout totals), `PATCH salaries/{id}/status`                                                           |

## Remaining (documented, out of scope of this pass)

- Teacher/Student/Parent portal endpoints (route groups still reserved).
- Timetable conflict detection, profile endpoints (`/me`), notifications, exports, API docs.
