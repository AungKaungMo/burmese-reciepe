# NestJS backend architecture

Use this reference when creating or changing the API application.

## Runtime and boundaries

Use a modular monolith with NestJS and the Express adapter (the NestJS default). A request should normally flow through:

```text
HTTP controller
  -> application service / use case
  -> repository or external-service port
  -> Prisma or provider adapter
```

Controllers translate HTTP input and output. They must not contain recommendation scoring, planning logic, persistence queries, media-provider code, or AI prompts.

Application services coordinate a use case and transaction. Put reusable domain decisions in framework-neutral functions or domain services. Repositories own database queries and return domain/application shapes rather than raw Prisma records.

Do not add repository interfaces mechanically for trivial read-only lookups. Use them where provider isolation, complex persistence, or focused testing has value.

## Phase 1 modules

```text
src/modules/
  auth/                 token verification and current-user context
  users/                profile, locale, preferences, household settings
  catalog/              recipes, ingredients, categories, translations
  substitutions/        contextual ingredient alternatives
  discovery/            search, filters, popular and curated lists
  recommendations/      ingredient matching and ranking
  planning/             daily/weekly plans and shopping-list projection
  cooking/              sessions, progress events and completion history
  favourites/           persisted user saves
  media/                signed uploads and media metadata
  feedback/             ratings, reports and moderation queue
  admin/                privileged editorial operations
```

Keep closely related entities in one module instead of creating a module per table. Future `ai`, `restaurants`, and `marketplace` modules must not be created until their phase begins.

## Suggested module internals

```text
catalog/
  api/                  controllers and HTTP DTOs
  application/          commands, queries and use cases
  domain/               domain types and pure policies when warranted
  infrastructure/       Prisma repositories and provider adapters
  catalog.module.ts
```

Small modules may use a flatter layout. Consistency and dependency direction matter more than ceremonial layers.

## API conventions

- Prefix routes with `/v1`.
- Use resource-oriented REST endpoints and explicit action endpoints only for real workflows such as `/recipes/:id/publish`.
- Use cursor pagination for feeds and large collections.
- Represent timestamps as ISO 8601 UTC strings.
- Accept locale explicitly and define one centralized fallback policy. Never fabricate missing translations.
- Return stable public identifiers; do not expose sequential database IDs if they make enumeration undesirable.
- Return quantities as numeric values plus unit codes and localized display information.
- Use a consistent error envelope:

```json
{
  "error": {
    "code": "RECIPE_NOT_FOUND",
    "message": "Recipe was not found",
    "details": null,
    "requestId": "..."
  }
}
```

- Generate OpenAPI from decorated controllers/DTOs. Treat it as the client contract.
- Validate request bodies, query parameters, and route parameters at the transport boundary.
- Map unexpected exceptions to a generic response and log the internal cause with the request ID.

Example public routes:

```text
GET  /v1/recipes
GET  /v1/recipes/:slug
GET  /v1/ingredients
GET  /v1/feed
POST /v1/recommendations/by-ingredients
```

Example authenticated routes:

```text
GET    /v1/me
GET    /v1/me/favourites
POST   /v1/me/favourites
```

## Local development environment

The database is Supabase. For local work we run the Supabase stack in Docker via
the CLI instead of a hosted project. The stack config lives at the repo root
(`/supabase/config.toml`).

```text
supabase start     # boot local Postgres + Auth + Studio (from repo root)
supabase status    # re-print local URLs, keys and JWT secret
supabase stop      # shut the stack down
```

Local connection details are fixed:

- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- API/Auth URL: `http://127.0.0.1:54321`  ·  Studio: `http://127.0.0.1:54323`

Copy `apps/api/.env.example` to `apps/api/.env` and fill it with the values from
`supabase status`. Locally there is no connection pooler, so `DATABASE_URL` and
`DIRECT_URL` both use the direct `:54322` port.

Data layer uses Prisma 7: connection URLs live in `prisma.config.ts` (CLI /
migrations) and reach `PrismaClient` through the `@prisma/adapter-pg` driver
adapter (`src/prisma/prisma.service.ts`). The generated client is written to
`src/generated/prisma` (gitignored) — run `pnpm --filter api prisma:generate`
after changing `schema.prisma`, and `pnpm --filter api db:migrate` to create and
apply migrations against the local database.