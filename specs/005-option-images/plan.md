# Implementation Plan: Product Option Images

**Branch**: `005-option-images` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-option-images/spec.md`

## Summary

Give product options optional photos: one migration adds nullable
`product_options.image_url`, the DAL exposes it in the existing tree at
zero extra cost, the product page resolves the main photo through a
recency stack with pop-on-deselect plus lazy picker thumbnails, and the
admin option row gains upload/preview/remove under the upload-then-save
rule with an `options/` storage prefix. Verification uses temp rows and
files with full cleanup. No pricing, cart, message, listing, RLS, or
design changes beyond the specified image behaviors.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict) + React 19, TanStack Start
(existing stack; no new framework).

**Primary Dependencies**: Installed `@supabase/supabase-js` v2, existing
`src/lib/catalog.ts` / `src/lib/admin.ts`, existing `ImageUploader` and
motion utilities. No new packages.

**Storage**: Same Postgres (`nahla_app`) plus one nullable column; images
in `nahla-images` under `options/`; temp files deleted after verification.

**Testing**: No test framework in repo; verification is live renders
(swap/pop/fallback, thumbnails, cart sameness), live queries (column,
visibility, write rejection), plus `tsc --noEmit` (0 errors).

**Target Platform**: Same Arabic RTL web app; fixed-aspect photo container,
lazy thumbnails, instant swaps under reduced motion.

**Project Type**: Single-project web application; additive column plus
localized UI extension.

**Performance Goals**: Zero extra queries (field rides the tree);
lazy-loaded thumbnails; no layout shift by construction.

**Constraints**: Existing tables/rows/behaviors byte-identical except the
one column; no seeds; no fake data persists; cart/message/listings
untouched; service key never in browser; non-destructive rerunnable
migration; Lovable history rule.

**Scale/Scope**: 1 column, ~4 touched files (DAL ×2, product page, option
editor) plus motion utility, 0 new routes, 0 new tables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-research evaluation (constitution v1.0.0):

- I (source of truth): photos live in Supabase/storage, read through typed
  functions; no hard-coded imagery — PASS.
- II (commerce boundaries): no cart/order/auth/payment changes; RLS reused
  as-is; secrets never in browser — PASS.
- III (type safety/discipline): typed nullable field, no `any`, zero new
  queries — PASS.
- IV (Arabic UX): lazy alt-tagged images, stable layout, reduced-motion
  support; customer design otherwise untouched — PASS.
- V (verification): live renders + queries, temp cleanup proofs, tsc, and
  schemadiff encoded in `quickstart.md`; reproducible migration — PASS.

Post-design re-check (after research.md, data-model.md, contracts/,
quickstart.md): design adds one column and reuses every established
pattern; recency stack is ephemeral UI state, not persisted data. No
violations. **Gate: PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/005-option-images/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── option-image-access.md # Extended type + resolution + guarantees
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── catalog.ts           # EXTEND: ProductOption.image_url (+ mapping)
│   └── admin.ts             # EXTEND: saveOption accepts image_url
├── routes/
│   └── product.$productId.tsx # EXTEND: recency-stack main photo +
│                              # lazy picker thumbnails (fixed aspect)
├── components/admin/
│   └── options.tsx          # EXTEND: option-row upload/preview/remove
└── styles.css               # EXTEND: crossfade utility (+ reduced-motion)
```

**Structure Decision**: Single-column migration plus in-place extension of
the four files that already own options; no new routes, components, or
packages.

## Complexity Tracking

> No constitution violations — nothing to justify. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
