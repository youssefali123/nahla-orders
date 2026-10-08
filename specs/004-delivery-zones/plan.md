# Implementation Plan: Delivery Zones

**Branch**: `004-delivery-zones` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-delivery-zones/spec.md`

## Summary

Add flat-fee delivery zones end to end: one migration creates
`delivery_zones` (unique name, non-negative fee, ordering, active flag,
reused trigger/helper/index/RLS pattern, no seeds), the DAL gains
`getActiveZones` plus admin `listZonesAdmin`/`saveZone`/`deleteZone`, the
checkout lists zones with live-fee grand totals (address field kept and
required), the order message carries the three delivery lines, the choice
persists in the existing prefill object, and a new admin zones screen under
a delivery nav group reuses the category-page pattern. Sequence: migration
→ DAL → checkout → admin screen → verification with temp rows deleted.
No existing table altered; no other UI touched.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict) + React 19, TanStack Start
(existing stack; no new framework).

**Primary Dependencies**: Installed `@supabase/supabase-js` v2, existing
`src/lib/catalog.ts` / `src/lib/admin.ts`, existing admin primitives
(DataTable, dialogs, forms, toasts). No new packages.

**Storage**: Same Supabase Postgres (`nahla_app`); one new table, no
storage changes. Temp verification rows deleted afterwards.

**Testing**: No test framework in repo; verification is live-query probes
(constraints, RLS allow/deny), two-fee order proofs, preselect/fallback
checks, plus `tsc --noEmit` (0 errors) and render checks.

**Target Platform**: Same Arabic RTL web app; checkout zone list and admin
screen follow existing responsive/card patterns (table desktop, cards
mobile).

**Project Type**: Single-project web application; additive table + library
functions + one route + one admin screen.

**Performance Goals**: Zone listing is one indexed query on checkout load
and inside the existing confirm revalidation; no per-item extra reads.

**Constraints**: Existing tables/rows/behaviors byte-identical; no seeds;
no fake zones persist; address field stays required; zero zones blocks
confirm (never a silent fee-less order); service key never in browser;
non-destructive rerunnable migration; Lovable history rule.

**Scale/Scope**: 1 table, ~5 DAL functions added, checkout route extended,
1 admin route + 1 nav group, 0 other files modified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-research evaluation (constitution v1.0.0):

- I (source of truth): zones and fees live in Supabase, read through typed
  functions; no hard-coded areas or prices — PASS.
- II (commerce boundaries): totals stay computed client-side from live
  rows; no orders/cart/auth-customer/payment tables; RLS DB-side; secrets
  never in browser — PASS.
- III (type safety/discipline): typed additions, no `any`, indexed
  constant-count reads — PASS.
- IV (Arabic UX): Arabic fee wording, free-delivery phrasing, loading/
  error/unavailable states; customer design otherwise untouched — PASS.
- V (verification): live-query matrix, two-fee proofs, tsc, zero-residue
  counts encoded in `quickstart.md`; reproducible migration — PASS.

Post-design re-check (after research.md, data-model.md, contracts/,
quickstart.md): design adds one table and reuses every established pattern;
address coexistence ratified in clarification. No violations.
**Gate: PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/004-delivery-zones/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── zones-access.md  # Zone types + added functions + changed behaviors
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── catalog.ts           # EXTEND: DeliveryZone type + getActiveZones()
│   └── admin.ts             # EXTEND: listZonesAdmin/saveZone/deleteZone
├── routes/
│   ├── checkout.tsx         # EXTEND: zone list, grand totals, live re-read,
│   │                        # prefill zoneId, unavailable state; address kept
│   └── admin.zones.tsx      # NEW: zones screen (category-page pattern)
├── components/admin/
│   └── AdminShell.tsx       # TOUCH: add delivery nav group only
└── lib/
    └── whatsapp.ts          # EXTEND: three delivery lines after items
```

**Structure Decision**: Single table plus minimal extensions along existing
seams; one new admin route; no other customer or admin files modified.

## Complexity Tracking

> No constitution violations — nothing to justify. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
