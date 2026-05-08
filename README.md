# TaskFlow API — Rapport Technique

> API REST de gestion de projets et tâches développée avec **NestJS**, **TypeORM** et **PostgreSQL**.

---

## 1. Choix techniques

### Architecture & framework

Le projet repose sur **NestJS**, choisi pour sa structure modulaire inspirée d'Angular (modules, controllers, services, guards, interceptors). Cette organisation force une séparation claire des responsabilités et facilite la montée en charge du projet. Chaque domaine métier (`users`, `teams`, `projects`, `tasks`, `comments`) est encapsulé dans son propre module NestJS, avec ses entités, DTOs, services et contrôleurs.

### Relations entre entités

Le modèle de données s'articule autour de cinq entités TypeORM :

```
User ←─ ManyToMany ─→ Team
Team ──── OneToMany ──→ Project
Project ── OneToMany ──→ Task
Task ───── OneToMany ──→ Comment
User ──── OneToMany ──→ Task (assignee)
User ──── OneToMany ──→ Comment (auteur)
```

Les suppressions en cascade ont été configurées avec soin : supprimer un `Project` supprime ses `Task`, supprimer une `Task` supprime ses `Comment`. En revanche, supprimer un `User` met l'`assignee` d'une tâche à `NULL` (comportement `SET NULL`) afin de préserver l'historique des tâches sans bloquer l'opération. La table de jointure `team_members` gère la relation `ManyToMany` entre utilisateurs et équipes.

Les identifiants sont tous des **UUID v4** pour éviter les id séquentiels prévisibles et faciliter la distribution future.

### Stratégie d'authentification

L'authentification combine **Passport.js** avec deux stratégies :

- **LocalStrategy** : valide les credentials `email + mot de passe` via bcrypt sur l'endpoint `POST /auth/login`.
- **JwtStrategy** : vérifie le token Bearer sur toutes les routes protégées. Le payload JWT contient `{ sub, email, role }`, ce qui évite un aller-retour en base à chaque requête pour récupérer le rôle.

Un **`JwtAuthGuard` global** est appliqué sur l'ensemble de l'application. Les routes publiques (comme `/auth/login` et `/health`) utilisent le décorateur `@Public()` pour lever explicitement la protection, suivant le principe du *secure by default*.

Le contrôle d'accès par rôle est assuré par un **`RolesGuard`** global et le décorateur `@Roles()`. Trois rôles sont définis : `ADMIN`, `MEMBER`, `VIEWER`.

Les mots de passe sont hashés avec **bcrypt** et le champ `passwordHash` est marqué `select: false` en TypeORM, ce qui l'exclut systématiquement des requêtes. Un `TransformInterceptor` global assure une seconde ligne de défense en supprimant ce champ de toutes les réponses sortantes.

### Organisation des tests

Les tests sont répartis en deux catégories :

**Tests unitaires** (`*.spec.ts`) : ils testent les services de façon isolée grâce à un helper `createMockRepository()` qui fournit un mock complet du `Repository` TypeORM. Cela permet de tester la logique métier sans base de données.

**Tests End-to-End** (`test/*.e2e-spec.ts`) : ils démarrent une vraie instance NestJS contre une base PostgreSQL de test. Un helper `createTestApp()` initialise l'application avec tous les pipes, filtres et interceptors globaux. La base est synchronisée via `dataSource.synchronize(true)` au démarrage et nettoyée entre les tests avec `cleanDatabase()` (truncation dans le bon ordre pour respecter les contraintes de clés étrangères).

Les tests E2E couvrent l'authentification (login valide/invalide, endpoint `/me`), la gestion des utilisateurs (CRUD, contrôle d'accès par rôle, validation des DTOs) et le point de santé de l'application.

### Autres choix notables

- **Validation** : `ValidationPipe` global avec `whitelist: true` et `forbidNonWhitelisted: true` pour rejeter tout champ inconnu en entrée.
- **Gestion des erreurs** : un `GlobalExceptionFilter` centralise la mise en forme des erreurs HTTP et convertit les violations de contrainte unique PostgreSQL (code `23505`) en réponses HTTP 409 Conflict.
- **Logging** : un `LoggingInterceptor` trace chaque requête avec méthode, URL, statut et durée.
- **Documentation** : Swagger est auto-généré en développement sur `/docs`.
- **Sécurité HTTP** : Helmet est activé pour durcir les headers, CORS est restreint à l'origine frontend attendue.
- **Déploiement** : build Docker multi-stage (builder → runner) avec image Alpine, utilisateur non-root et healthcheck HTTP intégré.

---

## 2. Difficultés rencontrées et solutions

### Gestion de `passwordHash` dans les réponses

La première difficulté a été de s'assurer que le hash du mot de passe n'apparaisse jamais dans les réponses API. Marquer la colonne `select: false` dans TypeORM résout le problème pour les requêtes standards, mais des requêtes internes (comme `validateUser` dans AuthService) doivent récupérer ce champ explicitement avec `addSelect`. Le `TransformInterceptor` a été ajouté comme filet de sécurité supplémentaire pour traiter les cas où l'entité est retournée directement.

### Ordre de suppression pour les tests

Le nettoyage de la base entre les tests E2E posait des erreurs de contrainte de clé étrangère. La solution a été de tronquer les tables dans l'ordre inverse des dépendances (`comments → tasks → projects → team_members → teams → users`) plutôt que de tronquer toutes les tables en parallèle.

### Configuration de l'environnement de test

Faire cohabiter l'environnement de test E2E avec la configuration de l'application (variables d'environnement, connexion DB) a nécessité de bien isoler la `DataSource` de test et d'utiliser un fichier `.env.test` dédié pour pointer vers une base distincte.

---

## 3. Améliorations envisagées

**Refresh tokens** : l'implémentation actuelle ne prévoit pas de refresh token. À l'expiration du JWT (24h par défaut), l'utilisateur doit se reconnecter. Un mécanisme de rotation de refresh tokens stockés en base améliorerait significativement l'expérience.

**Couverture de tests** : les tests unitaires sont limités au service `UsersService`. Idéalement, chaque service (`TasksService`, `ProjectsService`, `CommentsService`, `AuthService`) aurait sa propre suite de tests unitaires, et les tests E2E couvriraient l'ensemble des routes CRUD.

**Pagination et filtrage** : les endpoints qui retournent des listes (`GET /tasks`, `GET /projects`) ne gèrent pas encore la pagination. Sur une vraie base de données, cela deviendrait rapidement un problème de performance.

**Rate limiting** : aucun mécanisme de limitation de débit n'est en place sur les endpoints d'authentification, ce qui les expose à des attaques par force brute. Le module `@nestjs/throttler` permettrait de l'ajouter facilement.

---

## Lancer le projet

```bash
# Démarrer la base de données
docker compose up -d

# Installer les dépendances
npm install

# Seeder les données initiales
npm run seed

# Démarrer en mode dev
npm run start:dev
```

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Couverture
npm run test:cov
```

La documentation Swagger est accessible sur `http://localhost:3000/docs` en mode développement.
