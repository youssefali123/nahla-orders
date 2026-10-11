# Quickstart: Product Display Filters

**Feature**: `006-product-filters` | **Date**: 2026-10-03

Proves opt-in filtering end-to-end with zero residue. Details in
`data-model.md` and `contracts/filter-access.md`.

## Prerequisites

- Catalog + admin foundation live; manager session available.
- Dev server running.

## 1. Schema lands additive

- Expected: `subcategory_filters` and `product_filter_values` exist with
  constraints, uniques, cascades, trigger, indexes, RLS; `has_filters`
  columns exist defaulting false; nothing else changed.

## 2. Opt-in bar on a test section

- Enable filters on a scratch subcategory with three values; assign temp
  products (including one left unassigned).
- Expected: chip bar (الكل + 3) appears only there; each chip shows exact
  matches with preserved scroll and zero new reads; الكل restores all;
  unassigned products appear only under الكل.

## 3. Editor flows

- Expected: assignment dropdown lists exactly the section's values,
  re-resolves on section switch, clears on demand; value duplicates
  rejected; deletes drop assignments without touching products.

## 4. Security + sameness + gates

```bash
npx tsc --noEmit -p tsconfig.json   # must pass with 0 errors
```

- Expected: anon reads active-only with writes rejected; non-enabled
  sections show no bar or control; cart, totals, messages, and options
  byte-identical; temp rows deleted with counts matching pre-run;
  advisors re-checked.

## 5. No drift

- Expected: no other table altered, no UI changed except the bar and the
  two editor touchpoints, address/checkout flows untouched.
