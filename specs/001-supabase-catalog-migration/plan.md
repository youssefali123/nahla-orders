# Implementation Plan: Supabase Catalog Migration

**Branch**: `001-supabase-catalog-migration` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-supabase-catalog-migration/spec.md`

## Summary

Migrate Nahla's hard-coded catalog (`src/data/catalog.ts`) to Supabase as the
source of truth: one migration creates 5 tables, the `is_admin()` helper, the
`updated_at` trigger, indexes, RLS policies, the `nahla-images` storage bucket,
and idempotent seeds (5 categories, 9 subcategories, migrated products with
emoji icons + featured flags, 2 storage-hosted banners). A new typed
data-access layer (`src/lib/catalog.ts` over a singleton `src/lib/supabase.ts`)
backs route loaders for the homepage, category/subcategory/product/search
pages, navbar, and banner carousel; cart, checkout, and WhatsApp stay fully
local. Sequence: backend (schema → policies/storage → seeds/images) first, then
the access layer, then page-by-page conversion ending with deletion of the
static catalog file once every page is verified on live data.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict) + React 19, TanStack Start SSR
(TanStack Router file routes with loaders) + Vite 8.

**Primary Dependencies**: `@supabase/supabase-js` v2 (`2.117.2`, to be added),
existing `@tanstack/react-router` / `@tanstack/react-start` /
`@tanstack/react-query`, Tailwind CSS v4. No auth libraries (no shopper auth).

**Storage**: Supabase Postgres 17 (`nahla_app`, eu-west-1) + Storage bucket
`nahla-images`; device `localStorage` for the cart (`nahla-cart-v1`).
No `.env` file exists yet — implementation adds `VITE_SUPABASE_URL` +
`VITE_SUPABASE_ANON_KEY` (publishable key only).

**Testing**: No test framework in repo; verification is `tsc --noEmit` (0
errors) plus dev-server render checks of every touched page and the
`quickstart.md` acceptance probes (RLS rejection checks with the anon key,
seed rerun, price-change propagation to WhatsApp message).

**Target Platform**: Arabic RTL mobile-first web app; `npm run dev` (Vite,
port 8080); SSR HTML from TanStack Start (route loaders run server-side; the
anon client needs no session, so it works unchanged in loaders).

**Project Type**: Single-project web application (existing `src/` layout;
no new top-level packages).

**Performance Goals**: Catalog content visible within 3 seconds on typical
mobile (SC-005); server-rendered loaders for first paint; indexed,
active-filtered, column-minimal queries ordered by `sort_order`; search capped
at 50 rows.

**Constraints**: No admin UI/routes/users this phase; no
orders/customers/cart/payment tables; no customer auth; service-role key never
in browser or bundle; no UI redesign (only data-source swaps + Arabic
loading/error/empty states); migrations non-destructive and rerunnable; no
slug column (UUID route params; legacy `/category/market`-style URLs 404);
Lovable history rule (never rewrite published git history).

**Scale/Scope**: Tens of categories, hundreds of products; 5 tables, 1 bucket,
~10 converted routes/components, 1 new library module + 1 client singleton.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-research evaluation (constitution v1.0.0):

- I (Supabase source of truth): plan retires `catalog.ts` as a source and
  drives navigation/notice behavior from `type` / `requires_preorder` — PASS.
- II (Commerce boundaries): no server cart/orders/auth/payments; WhatsApp
  untouched; RLS database-side; secrets never in browser — PASS.
- III (Type safety / access discipline): single typed `catalog.ts` layer,
  loaders as the only fetch path, no `any` — PASS.
- IV (Arabic-first UX): design preserved; Arabic loading/error/empty states
  on every dynamic view; WhatsApp number stays env-configured — PASS.
- V (Verification): `quickstart.md` encodes tsc + render + RLS + seed-rerun
  gates; migrations reproducible and non-destructive — PASS.

Post-design re-check (after research.md, data-model.md, contracts/,
quickstart.md): no design element violates any gate. `is_featured`, `icon`
columns, and banner `link_url` come from ratified clarification sessions and
narrow (not widen) scope. No violations to justify — Complexity Tracking stays
empty. **Gate: PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/001-supabase-catalog-migration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── data-access.md   # DAL function/type contract + backend guarantees
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── supabase.ts      # NEW: singleton anon client (only Supabase import site besides catalog.ts)
│   ├── catalog.ts       # NEW: typed DAL (contracts/data-access.md) + entity types
│   ├── cart.tsx         # EXTEND: cart item gains optional image; legacy slug ids → unavailable
│   └── whatsapp.ts      # UNCHANGED (already reads live cart data)
├── data/
│   └── catalog.ts       # DELETE at the end, after all pages verified on live data
├── routes/
│   ├── index.tsx            # CONVERT: categories/banners/featured via loaders
│   ├── category.$categoryId.index.tsx   # CONVERT: dynamic sub-or-products + custom_order redirect
│   ├── category.$categoryId.$subId.tsx  # CONVERT: products + requires_preorder notice
│   ├── product.$productId.tsx           # CONVERT: getProduct + unavailable state
│   ├── search.tsx                       # CONVERT: loader searchProducts(q)
│   ├── cart.tsx                         # TOUCH: product links use UUIDs; unavailable-item state
│   ├── checkout.tsx                     # TOUCH only if cart shape demands it
│   └── custom-order.tsx                 # TOUCH only for category-type lookup
├── components/
│   ├── Navbar.tsx           # CONVERT: categories from loader data (custom_order → /custom-order)
│   ├── BannerCarousel.tsx   # CONVERT: banners prop (custom → link_url, dangling → /)
│   └── ProductCard.tsx      # CONVERT: Product type (photo-first visual rule)
├── config/site.ts           # UNCHANGED (WhatsApp number stays env-configured)
.env                             # NEW: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (publishable only)
```

**Structure Decision**: Single-project layout preserved — the feature adds two
library modules, converts existing routes/components in place, and removes the
static catalog file last. No new packages, services, or test scaffolding.

## Complexity Tracking

> No constitution violations — nothing to justify. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
