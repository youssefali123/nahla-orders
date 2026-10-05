# Research: Supabase Catalog Migration

**Feature**: `001-supabase-catalog-migration` | **Date**: 2026-10-03

All technical unknowns resolved — no NEEDS CLARIFICATION remains.

## R1 — Supabase client library and instantiation

- **Decision**: Add `@supabase/supabase-js` v2 (verified latest `2.117.2`) and
  create a single shared browser client in `src/lib/supabase.ts` using the
  publishable key from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. No auth
  flows are configured (no sign-in/sign-up in this phase).
- **Rationale**: v2 is the current stable line; a module-level singleton avoids
  multiple GoTrue clients warning and keeps all backend access behind one
  import. Public catalog reads need only the anon key.
- **Alternatives considered**: Edge-function proxy for reads (rejected — public
  data, RLS already restricts to active rows; proxy adds latency/ops with no
  security gain); per-component clients (rejected — duplicates config, harder
  to keep secret-free).

## R2 — RLS design (public read-only + future admin writes, no recursion)

- **Decision**: Enable RLS on all five tables. Public `SELECT` policies check
  `is_active = true` with `USING (true)`-scoped `FOR SELECT TO anon,
  authenticated`. Admin write policies (`ALL`, `TO authenticated`) call a
  `public.is_admin()` helper declared `SECURITY DEFINER`, `STABLE`,
  `SET search_path = public`, fixed `search_path`, which checks
  `admin_profiles` — policies never query `admin_profiles` directly, so no
  recursion is possible. `admin_profiles` gets **no** public policies (deny by
  default once RLS is enabled); admin self-read via `auth.uid() = id` only.
- **Rationale**: This is the documented Supabase pattern for role-gated RLS:
  the definer function breaks the policy→table→policy recursion cycle, and
  `SET search_path` closes search-path hijacking. Deny-by-default on
  `admin_profiles` makes self-escalation impossible (FR-007, User Story 4).
- **Alternatives considered**: `auth.jwt()` custom claims for roles (rejected —
  requires Auth hooks to mint claims; heavier than needed pre-dashboard);
  client-side role checks (rejected — forbidden by constitution principle II).

## R3 — Storage bucket and policies

- **Decision**: Public-flagged bucket `nahla-images` (public flag ON — the
  `/object/public/` URL only serves public-flagged buckets; verified live
  after a private-bucket attempt returned `NoSuchBucket`) with folders
  `categories/`, `subcategories/`, `products/`, `banners/`. `SELECT` policy on
  `storage.objects` for `bucket_id = 'nahla-images'` to `anon, authenticated`
  (public display). Write policies (`INSERT/UPDATE/DELETE`, `TO authenticated`)
  gated on `public.is_admin()`. Buckets must be created/managed through the
  Storage API (direct SQL deletes are blocked; SQL-created buckets hit API
  cache issues). Seed/banner uploads during implementation use the service
  key strictly outside frontend code (migration-time script), never shipped
  to the browser.
- **Rationale**: Public flag + policies is the standard Supabase recipe for
  public-read/restricted-write; policy-based public read alone cannot serve
  the public URL path. Seed uploads need elevated rights that must not exist
  client-side.
- **Alternatives considered**: Private bucket with policy-only public read
  (rejected — proven broken live: `NoSuchBucket` on the public URL path).

## R4 — Data fetching inside TanStack Start (SSR-safe)

- **Decision**: Fetch through TanStack Router route `loader`s calling the typed
  data-access layer (`src/lib/catalog.ts`), with results consumed via
  `Route.useLoaderData()`; search reads its `q` param and queries in the
  loader. The anon client works unchanged on server and client since public
  reads carry no session.
- **Rationale**: Loaders run on the server during SSR, so first paint already
  contains catalog HTML (good for the 3s SC-005 target and SEO meta in `head`
  functions, which can reuse the same layer). No cookies/session handling is
  needed with zero authenticated shopper flows.
- **Alternatives considered**: Client-only `useEffect` fetching (rejected —
  SSR would render empty shells, breaking meta tags and slowing first paint);
  React Query `useSuspenseQuery` per component (rejected — scatters backend
  access, violating FR-012; loaders centralize it).

## R5 — Route identifiers: UUIDs, not slugs

- **Decision**: Category/product/subcategory route params carry database UUIDs
  (e.g. `/category/<uuid>`); no `slug` column is added. Old hard-coded slug
  URLs (`/category/market`) will 404 via the existing not-found page.
- **Rationale**: The mandated schema has no slug field and the brief forbids
  over-engineering; UUIDs are stable under renames (Arabic names change more
  often than IDs). Internal navigation always uses IDs from loaded records, so
  no in-app link breaks.
- **Alternatives considered**: Adding a `slug` column with unique constraint
  (rejected — extra migration/backfill surface, Arabic slugs need
  transliteration rules, no requirement asks for pretty URLs).

## R6 — Search semantics

- **Decision**: `searchProducts(q)` issues `ilike '%q%'` on `name` filtered to
  active rows (empty query returns `[]`, mirroring current behavior), ordered
  by `sort_order`, capped (50). No Arabic normalization in this phase.
- **Rationale**: Matches current substring behavior users already know;
  catalog scale (hundreds of rows) makes server-side `ilike` trivially fast.
  Normalization (alef/hamza, ة/ه) is a documented follow-up, not a migration
  blocker.
- **Alternatives considered**: Postgres full-text search (rejected — Arabic
  dictionaries/stemming add ops complexity for no required gain now).

## R7 — `updated_at` automation

- **Decision**: One reusable `public.handle_updated_at()` trigger function
  (`BEFORE UPDATE`, sets `NEW.updated_at = now()`) attached to categories,
  subcategories, products, banners.
- **Rationale**: Single function reused four times = minimal schema, satisfies
  FR-016 uniformly.
- **Alternatives considered**: Per-table functions (rejected — duplication);
  client-set timestamps (rejected — untrustworthy, bypassable).

## R8 — Seed idempotency mechanism

- **Decision**: Seeds keyed on stable natural keys (`categories.name`,
  `subcategories.(category_id, name)`) via `INSERT ... ON CONFLICT DO NOTHING`
  (backed by unique constraints), then products/banners reference resolved IDs
  looked up by those keys. Safe to rerun.
- **Rationale**: UUID primary keys are generated per insert, so dedupe must
  rest on unique natural-key constraints — the standard idempotent-seed
  pattern, satisfying the spec edge case on reruns.
- **Alternatives considered**: Fixed UUIDs in seeds (rejected — brittle,
  collides across environments); delete-and-reseed (rejected — destructive,
  violates FR-020).
