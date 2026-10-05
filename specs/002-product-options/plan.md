# Implementation Plan: Product Options (Variants & Add-ons)

**Branch**: `002-product-options` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-product-options/spec.md`

## Summary

Add a generic product-choice foundation without touching the existing catalog:
one migration creates `product_option_groups` + `product_options` (CHECK-ruled
selection limits, per-parent unique names, cascades, reused trigger/helper,
targeted indexes, active-scoped RLS + admin writes), temporary-row
verification proves rules/security/cascades with zero residue, and
`src/lib/catalog.ts` gains option types plus an embedding `getProduct` and a
constant-cost `getProductsWithOptions` helper. No UI, route, or component
changes; existing pages ignore the new fields. Sequence: migration →
temp-row verification matrix → DAL extension → type check + zero-residue
confirmation.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict) + React 19, TanStack Start SSR
(existing stack; no new framework).

**Primary Dependencies**: `@supabase/supabase-js` v2 (installed),
existing DAL (`src/lib/catalog.ts`, `src/lib/supabase.ts`). No new packages.

**Storage**: Same Supabase Postgres (`nahla_app`); two new tables only.
No storage-bucket changes. Temp verification rows deleted afterwards.

**Testing**: No test framework in repo; verification is live-query probes
(valid/invalid configs, RLS allow/deny, cascade deletes, pricing math) plus
`tsc --noEmit` (0 errors) and unchanged page renders.

**Target Platform**: Unchanged web app; DAL runs in route loaders (SSR) and
client effects as today; three indexed reads per configured product.

**Project Type**: Single-project web application; additive database + library
change.

**Performance Goals**: Configured-product read in 3 indexed queries;
listings flag in constant queries regardless of page size (SC-006); active
filtering at the database; no per-product extra reads.

**Constraints**: Existing tables/rows/behaviors byte-identical; no UI
(selection/cart/checkout/admin) shipped or modified; no order-related
tables; no fake production data persists; service key never in browser;
non-destructive rerunnable migration; Lovable history rule.

**Scale/Scope**: 2 tables, ~10 DAL functions touched-or-added (1 changed, 1
added, rest verified unchanged), 0 route/component files modified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-research evaluation (constitution v1.0.0):

- I (source of truth): choices live in Supabase, read through the typed
  layer; no hard-coded option names — PASS.
- II (commerce boundaries): no cart/order/auth/payment tables; cart untouched
  and local; secrets never in browser; DB-side authorization reused — PASS.
- III (type safety/discipline): typed additions only, no `any`, single DAL
  module, indexed constant-count reads — PASS.
- IV (Arabic UX): no UI shipped, therefore no UX change; existing pages
  render identically — PASS.
- V (verification): live-query matrix + advisors + tsc + zero-residue counts
  encoded in `quickstart.md`; reproducible migration — PASS.

Post-design re-check (after research.md, data-model.md, contracts/,
quickstart.md): design adds `UNIQUE(product_id, name)` /
`UNIQUE(option_group_id, name)` and temp-row verification per ratified
clarifications — both narrow scope. No violations. **Gate: PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/002-product-options/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── options-access.md # Extended types + changed/added DAL functions
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
└── lib/
    └── catalog.ts       # EXTEND: OptionGroup/ProductOption/ConfiguredProduct types;
                          # getProduct embeds ordered active tree;
                          # ADD getProductsWithOptions(ids) flag helper.
                          # All other functions verified unchanged.
```

**Structure Decision**: Single library module extended in place; database
migration additive; zero route/component/config changes. No new packages,
services, or scaffolding.

## Complexity Tracking

> No constitution violations — nothing to justify. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
