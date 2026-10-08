# Quickstart: Delivery Zones

**Feature**: `004-delivery-zones` | **Date**: 2026-10-03

Proves zones end-to-end with zero residue. Details in `data-model.md` and
`contracts/zones-access.md`.

## Prerequisites

- Catalog + options + admin phases live; manager session available.
- Dev server running.

## 1. Table lands intact, empty is valid

- Expected: `delivery_zones` exists with CHECKs, unique name, trigger,
  index, RLS; row count 0; checkout shows the delivery-unavailable state
  (no silent fee-less order).

## 2. Full zone lifecycle (temp rows)

- Create two zones (fees 15 and 0) via the admin screen; rename, reprice,
  reorder, deactivate one; delete a third temp zone.
- Expected: checkout lists active only in order; free zone words free
  delivery; duplicate/negative fees rejected with clear messages; deleted
  temp rows leave zero residue.

## 3. Order proof with both fees

- Expected: completing checkout on the priced zone shows items total, zone
  name, fee, and grand total in the sent message; on the free zone the fee
  line reads as free; reopening checkout preselects the last zone;
  deactivating all zones blocks confirm with explanation.

## 4. Security + quality gates

```bash
npx tsc --noEmit -p tsconfig.json   # must pass with 0 errors
```

- Expected: anon writes rejected, inactive hidden, non-managers gain
  nothing, advisors re-checked; customer pages and admin screens render
  with zero console errors; temp rows fully deleted.

## 5. No drift

- Expected: no other table altered, no UI changed except checkout totals
  and the new admin screen, address field still required alongside zone.
