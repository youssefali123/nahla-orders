# Implementation Plan: Product Display Filters

**Branch**: `006-product-filters` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-product-filters/spec.md`

## Summary

Add opt-in display filters: one migration creates `subcategory_filters` +
`product_filter_values` and adds `has_filters` flags, the DAL gains section
filter reads plus a mapping-enriched product listing, listing pages render
a client-side chip bar (الكل first) over loaded rows, the product editor
gains a conditional single-assignment dropdown, and section editors gain an
enable switch with inline value management. Verification uses temp sections
and rows with full cleanup. Pricing, cart, messages, options, RLS posture,
and all non-enabled sections stay byte-identical.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict) + React 19, TanStack Start
(existing stack; no new framework).

**Primary Dependencies**: Installed `@supabase/supabase-js` v2, existing
`src/lib/catalog.ts` / `src/lib/admin.ts`, existing admin primitives
(DataTable, dialogs, forms, toasts). No new packages.

**Storage**: Same Supabase Postgres (`nahla_app`); two new tables plus two
flag columns; temp verification rows deleted afterwards.

**Testing**: No test framework in repo; verification is live renders (bar
behavior, editor flows), live queries (constraints, RLS allow/deny), plus
`tsc --noEmit` (0 errors).

**Target Platform**: Same Arabic RTL web app; horizontal chip bar with
card-safe overflow on phones; keyboard-operable chips with pressed states.

**Project Type**: Single-project web application; additive tables/columns
plus localized UI extension.

**Performance Goals**: Two bounded reads per listing page (filters +
mapping); zero reads per filter tap; active filtering at the database.

**Constraints**: Existing tables/rows/behaviors byte-identical except the
two flag columns; no seeds; no fake data persists; filters never affect
price/cart/messages; service key never in browser; non-destructive
rerunnable migration; Lovable history rule.

**Scale/Scope**: 2 tables + 2 flag columns, ~8 DAL functions added, chip
bar on 2 listing templates, dropdown in product editor, switch + values in
2 section editors, 0 new routes, 0 new tables beyond specified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-research evaluation (constitution v1.0.0):

- I (source of truth): filters and assignments live in Supabase, read
  through typed functions; no hard-coded values — PASS.
- II (commerce boundaries): no cart/order/auth/payment changes; RLS reused
  DB-side; secrets never in browser — PASS.
- III (type safety/discipline): typed additions, no `any`, indexed
  constant-cost reads — PASS.
- IV (Arabic UX): Arabic chips with pressed/focus states, standard empty
  message, untouched pages identical — PASS.
- V (verification): live renders + queries, temp cleanup proofs, tsc, and
  schemadiff encoded in `quickstart.md`; reproducible migration — PASS.

Post-design re-check (after research.md, data-model.md, contracts/,
quickstart.md): design adds the specified tables plus the implied opt-in
flags and reuses every established pattern; option groups untouched.
No violations. **Gate: PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/006-product-filters/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── filter-access.md # Filter reads, mapping, admin writes, guarantees
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── catalog.ts           # EXTEND: DisplayFilter/ProductWithFilter types,
│   │                        # getSectionFilters, getProductsWithFilters
│   └── admin.ts             # EXTEND: filter CRUD, has_filters toggle,
│                            # saveProductFilter (cross-section validated)
├── routes/
│   ├── category.$categoryId.index.tsx   # EXTEND: chip bar (direct categories)
│   ├── category.$categoryId.$subId.tsx  # EXTEND: chip bar (subcategories)
│   └── admin.product-editor.tsx         # EXTEND: conditional assignment dropdown
├── components/
│   └── FilterBar.tsx        # NEW: chips (الكل first), pressed/focus states
└── routes (admin editors):
    └── categories/subcategories editors  # EXTEND: enable switch + value CRUD
```

**Structure Decision**: Additive tables/columns plus in-place extension of
the files that already own listings and editors; one small new presentational
component; no new routes, packages, or services.

## Complexity Tracking

> No constitution violations — nothing to justify. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
