# Rapport d'audit — Full-App-School-Management

Date : 19 septembre 2026  
Périmètre : `frontend/` (Next.js) et `Backend/` (Laravel).  
Méthodes : lecture du code et des routes, `npm.cmd run lint`, `npm.cmd run build`, `php artisan test`, analyse syntaxique PHP, `composer validate`.

## Mise à jour des corrections

- **Corrigé :** P1-01 (lint bloquant), P1-02 (build dépendant de Google Fonts), P1-04 (factories de séances/absences) et P1-05 pour les modules administratifs implémentés.
- **Laissé volontairement ouvert :** P1-03, conformément à la demande de ne pas modifier l'authentification.
- **Hors périmètre :** trois scénarios de test de paiements/salaires sont marqués comme ignorés : ces modules ne possèdent ni modèle, ni migration, ni route, ni interface dans le dépôt.
- **Validation après correction :** build frontend réussi ; lint frontend sans erreur (20 avertissements P2 subsistent) ; 14 tests backend réussis, 3 ignorés, 7 échecs tous liés à P1-03.

## Synthèse

| Gravité | Nombre | Impact |
| --- | ---: | --- |
| Critique (P0) | 0 | — |
| Haute (P1) | 5 | Fonctionnalités indisponibles, CI ou déploiement bloqué |
| Moyenne (P2) | 3 | Régressions possibles, dette technique ou qualité dégradée |
| Basse (P3) | 2 | Nettoyage et diagnostic |

État des contrôles :

- Frontend : lint en échec — **1 erreur, 20 avertissements**.
- Frontend : build de production en échec à cause de la police Google distante `Manrope`.
- Backend : **7 tests réussis, 17 tests en échec**.
- Backend : syntaxe PHP valide sur `app/`, `routes/` et `database/`.
- Backend : `composer.json` valide.

> Cet audit n'inclut pas de test E2E dans un navigateur connecté à une base de données de production. Les constats ci-dessous sont ceux observés localement et reproductibles par les commandes indiquées.

## Erreurs P1 — à traiter en priorité

### P1-01 — Le lint frontend échoue

- **Emplacement :** `frontend/src/components/nav-main.jsx:36`
- **Preuve :** `npm.cmd run lint` retourne `react-hooks/set-state-in-effect`.
- **Cause :** `setOpen(true)` est appelé directement dans un `useEffect` quand la route est active.
- **Impact :** la vérification qualité/CI frontend échoue ; React signale des rendus en cascade possibles.
- **Correction proposée :** ne pas synchroniser cet état local de façon synchrone dans l'effet. Calculer l'état actif à partir de l'URL, ou déclencher l'ouverture via un événement utilisateur/une logique de composant adaptée.

### P1-02 — Le build Next.js dépend d'une police Google inaccessible

- **Emplacement :** `frontend/src/app/layout.js` (import `next/font/google` de `Manrope`).
- **Preuve :** `npm.cmd run build` échoue : `Failed to fetch Manrope from Google Fonts`.
- **Impact :** aucune build de production ne peut être générée sans accès à Google Fonts ; le déploiement est bloqué dans les environnements isolés/proxy.
- **Correction proposée :** auto-héberger la police avec `next/font/local`, ou rendre l'accès à `fonts.googleapis.com` disponible au moment du build.

### P1-03 — Routes publiques d'authentification désactivées

- **Emplacement :** `Backend/routes/auth.php:12-33`.
- **Preuve :** les routes `register`, `forgot-password`, `reset-password`, `verify-email` et `email/verification-notification` sont commentées. `php artisan route:list --path=api/register` et `--name=verification.verify` ne retournent aucune route.
- **Impact :** inscription, réinitialisation de mot de passe et vérification d'e-mail sont indisponibles. Les tests d'authentification concernés retournent 404 ou lèvent `RouteNotFoundException`.
- **Correction proposée :** réactiver les routes nécessaires, conserver les middlewares de limitation de débit et vérifier que le frontend expose les parcours correspondants.

### P1-04 — La factory `ClassSession` ne respecte pas le schéma

- **Emplacements :** `Backend/database/factories/ClassSessionFactory.php`, `Backend/database/migrations/2026_07_31_215910_create_class_sessions_table.php`.
- **Preuve :** `php artisan test` échoue avec `NOT NULL constraint failed: class_sessions.day`.
- **Cause :** la colonne `day` est obligatoire, mais la factory ne l'initialise pas.
- **Impact :** les tests qui créent une séance (absences incluses) ne peuvent pas démarrer.
- **Correction proposée :** ajouter une valeur valide parmi `Lundi` à `Dimanche` dans la factory et relancer la suite.

### P1-05 — La suite de tests appelle des routes API sans le préfixe `admin`

- **Emplacements :** `Backend/tests/Feature/AdminModulesTest.php`, `Backend/tests/Feature/StudentClassePivotTest.php` ; routes réelles dans `Backend/routes/api.php:50-133`.
- **Preuve :** les tests appellent notamment `/api/exams`, `/api/grades`, `/api/students`, alors que les routes déclarées sont `/api/admin/exams`, `/api/admin/grades`, `/api/admin/students`. Les assertions reçoivent 404.
- **Impact :** au moins 10 échecs de tests masquent les régressions réelles des modules d'administration.
- **Correction proposée :** mettre à jour les tests vers les routes `api/admin/*` (cohérent avec les appels frontend) ou modifier le contrat d'API de manière globale, mais ne pas maintenir les deux conventions sans raison explicite.

## Erreurs P2 — importantes mais non bloquantes immédiatement

### P2-01 — 20 avertissements React Compiler empêchent l'optimisation de composants

- **Emplacements principaux :** formulaires `EditSheet`/`AddSheet`, pages d'absences, notes et séances, `frontend/src/components/Table/CreateTable.jsx`, `frontend/src/app/teacher/manage-student/page.js`.
- **Preuve :** le lint indique `react-hooks/incompatible-library` pour `react-hook-form` (`watch`) et `@tanstack/react-table` (`useReactTable`).
- **Impact :** React Compiler ignore ces composants ; ce n'est pas une panne fonctionnelle, mais les optimisations attendues ne sont pas appliquées et un changement futur peut introduire des états périmés si les composants sont mémorisés.
- **Correction proposée :** employer `useWatch` dans les formulaires plutôt que propager `watch`, isoler les composants utilisant TanStack Table, puis vérifier la compatibilité avec la version de React Compiler retenue.

### P2-02 — Tests d'inscription historiques incompatibles avec l'authentification par token

- **Emplacement :** `Backend/tests/Feature/Auth/RegistrationTest.php:17`.
- **Preuve :** le test attend `assertAuthenticated()`, alors que le contrôleur et le test `AuthFixesTest` attendent un token Bearer.
- **Impact :** même après réactivation de l'inscription, ce test peut rester erroné ou imposer un comportement de session non désiré à une API Sanctum.
- **Correction proposée :** choisir un seul contrat : API Bearer token ou session. Si l'API est token-based, remplacer `assertAuthenticated()` par des assertions sur le token et l'utilisateur retournés.

### P2-03 — Les données présentées à l'utilisateur contiennent du texte mal encodé

- **Emplacements observés :** `frontend/src/app/teacher/manage-student/page.js` et plusieurs pages d'administration.
- **Preuve :** des libellés tels que `ðŸ“–`, `GÃ©rez`, `Ã©lÃ¨ves` apparaissent dans le code.
- **Impact :** affichage dégradé en français et emojis illisibles.
- **Correction proposée :** enregistrer les sources en UTF-8, remplacer les chaînes corrompues, puis ajouter une vérification de l'encodage dans l'éditeur/CI si possible.

## Erreurs P3 — nettoyage recommandé

### P3-01 — Journaux de débogage laissés dans le frontend

- **Emplacements :** formulaires de séances, absences et notes, notamment `manage-session/.../AddSheet.js:72` et `EditSheet.js:86`.
- **Preuve :** appels `console.log` trouvés par analyse statique.
- **Impact :** bruit dans la console, exposition potentielle de données saisies sur un poste partagé, diagnostic moins clair.
- **Correction proposée :** supprimer ces journaux ou les encapsuler dans un mécanisme de log désactivé en production.

### P3-02 — Couverture automatisée insuffisante pour détecter le contrat API réel

- **Preuve :** les appels frontend utilisent déjà `api/admin/*`, mais plusieurs tests utilisent `api/*` et échouent par 404 avant de tester le comportement métier.
- **Impact :** le statut de la suite ne permet pas de distinguer rapidement les erreurs de routage, de schéma et de logique métier.
- **Correction proposée :** corriger d'abord le préfixe des tests et la factory, puis ajouter des tests de contrat par rôle (admin, enseignant, parent, élève) et un test E2E minimal pour connexion + liste des élèves.

## Ordre de correction conseillé

1. Corriger `ClassSessionFactory` et les URL de tests `api/admin/*`, puis relancer `php artisan test`.
2. Réactiver et tester les routes d'authentification nécessaires.
3. Corriger l'erreur `nav-main.jsx` afin de faire repasser le lint.
4. Auto-héberger `Manrope` ou configurer l'accès réseau de build.
5. Éliminer les avertissements React Compiler, les problèmes d'encodage et les `console.log`.

## Commandes de vérification à rejouer

```powershell
Set-Location frontend
npm.cmd run lint
npm.cmd run build

Set-Location ../Backend
php artisan test
composer validate --no-check-publish
php artisan route:list
```
