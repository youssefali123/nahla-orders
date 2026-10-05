# Research: Admin Dashboard

**Feature**: `003-admin-dashboard` | **Date**: 2026-10-03

No NEEDS CLARIFICATION — spec plus documented defaults resolve everything.

## R1 — Admin session without SSR cookie wiring

- **Decision**: Browser-only session via the installed `@supabase/supabase-js`
  (localStorage persistence, `signInWithPassword` / `signOut`,
  `onAuthStateChange`). Admin routes render loading shells during SSR and
  resolve auth client-side; all admin reads/writes use the session client.
- **Rationale**: An internal tool needs no SEO or SSR-first-paint; avoiding
  `@supabase/ssr` cookie plumbing removes an entire auth-sync layer. The
  public site's SSR path is untouched.
- **Alternatives considered**: `@supabase/ssr` cookie session shared with
  loaders (rejected — complexity with zero internal-tool benefit);
  token-in-URL or custom JWT handling (rejected — security anti-pattern).

## R2 — Gate enforcement point

- **Decision**: Two layers. (1) UI guard component on the admin layout:
  no session → redirect `/admin/login`; session without `admin_profiles`
  row → access-denied screen. (2) Database RLS remains the real enforcer
  (existing policies already reject non-managers); the guard is UX, not
  security.
- **Rationale**: Matches constitution principle II (DB-side authorization);
  the guard only controls what is displayed, never what is permitted.
- **Alternatives considered**: loader-based guards (rejected — loaders run on
  the server where the browser session is unavailable without R1's rejected
  wiring); client-side role flags (rejected — forbidden by constitution).

## R3 — Admin reads vs the public DAL

- **Decision**: New `src/lib/admin.ts` module with session-client CRUD plus
  unfiltered reads (inactive rows included, ordered by `sort_order`);
  reuses entity types from `src/lib/catalog.ts`. Public `catalog.ts`
  functions stay active-only and untouched.
- **Rationale**: Managers must see/edit inactive rows the public layer
  deliberately hides; a separate module keeps that privilege visible and
  prevents accidental unfiltered reads on the storefront.
- **Alternatives considered**: parameterizing `catalog.ts` with an
  include-inactive flag (rejected — risks a future caller leaking inactive
  rows publicly).

## R4 — Option editing shape

- **Decision**: Nested editing inside the product editor route
  (`/admin/products/$productId`): groups listed in order with inline
  option rows; group create/edit in a dialog; single-type form auto-guides
  max toward 1 with helper text; duplicate names surface the specified
  Arabic message from constraint errors.
- **Rationale**: Follows the brief's IA guidance (options live naturally in
  the product flow, no separate top-level page) and keeps group ↔ option
  context on one screen.
- **Alternatives considered**: standalone options section (rejected —
  contradicts brief guidance, loses product context).

## R5 — Image uploads

- **Decision**: Upload through the session client to `nahla-images`
  (existing bucket + admin-gated write policies), prefixed per entity
  (`categories/`, `subcategories/`, `products/`, `banners/`); stored public
  URL saved on the row; failed uploads block the save with inline retry.
- **Rationale**: Reuses proven storage foundation; no new bucket, no secret
  handling, policy already permits exactly this.
- **Alternatives considered**: URL-only image fields (rejected — brief
  requires upload UX); separate upload service (rejected — no need).

## R6 — Design system reuse

- **Decision**: Build admin UI from the existing `src/components/ui/`
  library (dialog, drawer, form, input, select, checkbox, radio-group,
  switch, table, badge, sonner toasts, pagination) plus small admin-only
  primitives (shell, data-table wrapper, status badge, confirm dialog,
  empty/error states, image uploader, option editors); Cairo font and
  existing brand tokens extended with admin-specific density tokens.
- **Rationale**: The library already covers ~90% of the brief's component
  list; new code is limited to compositional admin pieces, keeping visual
  language coherent.
- **Alternatives considered**: separate admin component kit (rejected —
  duplication, drift risk).

## R7 — First-manager bootstrap

- **Decision**: Documented manual SQL: create the auth user (dashboard Auth
  panel), then `INSERT INTO admin_profiles (id) VALUES ('<auth-user-uuid>')`.
  No UI, no seeds, no default credentials.
- **Rationale**: Exactly one secure path exists; anything self-service would
  violate the no-escalation rule.
- **Alternatives considered**: none viable.

## R8 — Price preview integrity

- **Decision**: Preview recomputes from the form's live field values with
  the same base-plus-deltas formula, labeled explicitly as a preview; the
  saved rows (base price, deltas) remain the single source of truth the
  storefront and WhatsApp flow read.
- **Rationale**: Satisfies the brief's display-only requirement with no
  parallel pricing implementation to diverge.
