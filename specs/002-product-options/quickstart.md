# Quickstart: Product Options (Variants & Add-ons)

**Feature**: `002-product-options` | **Date**: 2026-10-03

Proves the foundation end-to-end with zero residue. Details in
`data-model.md` and `contracts/options-access.md`.

## Prerequisites

- Prior phase live (`nahla_app` catalog with RLS, `is_admin()`,
  `handle_updated_at()`, `src/lib/catalog.ts` + anon client).
- Migration rights on the project; anon key for read/write probes.
- `npx tsc --noEmit -p tsconfig.json` available.

## 1. Schema lands intact

- Expected: tables `product_option_groups`, `product_options` exist with all
  CHECKs, uniques, FKs (cascade both levels), indexes, reused trigger, RLS
  enabled; no existing table altered (row counts byte-identical).

## 2. Rules accept valid, reject invalid (temp product)

- Create TEMP product + groups covering required single (1,1), optional
  single (0,1), open multiple (0,NULL), capped multiple (0,3) — all accepted.
- Expected rejections: single with max 2, min 2 on single, min above max,
  negative min, unknown type, duplicate group/option names per parent.
- Delete the temp product — expected: its groups and options vanish, nothing
  else changes. Separately delete one temp group — expected: its options
  vanish.

## 3. Security matrix (anon key)

- Expected: anon reads return active-only trees of active products;
  deactivating the temp product hides its tree; every anon write rejected;
  non-managers gain nothing; advisors re-checked with findings fixed.

## 4. Data-access layer

```bash
npx tsc --noEmit -p tsconfig.json   # must pass with 0 errors
```

- Expected: `getProduct` on the temp configured product returns the full
  ordered tree; on a plain product returns `option_groups: []`;
  `getProductsWithOptions` maps 50 ids with a constant query count; price
  math (100 + 30 + 15 + 0 = 145) verified through live rows.

## 5. Zero residue, zero UI drift

- Expected: temp rows fully deleted (counts match pre-run); no selection,
  cart, checkout, or admin UI changed or added; no order-related tables
  exist; existing pages render exactly as before.
