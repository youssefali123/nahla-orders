# Implementation Plan: Admin Dashboard

**Branch**: `003-admin-dashboard` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-admin-dashboard/spec.md`

## Summary

Build the Arabic-first RTL admin dashboard on the existing schema and RLS
with zero database changes: a browser-session auth gate (email/password,
`admin_profiles` verification, manual first-manager bootstrap), an
`/admin` route family (login, home with live counts, categories,
subcategories, products with nested option editing, banners), a session-
client admin module (`src/lib/admin.ts`) for unfiltered reads and writes,
storage uploads through existing policies, and a token-based reusable
component layer on the current Cairo brand theme and UI library. Sequence:
auth + shell first, then entity screens in catalog order, then home/polish;
customer routes verified untouched throughout. No migrations, no new tables,
no RLS changes.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict) + React 19, TanStack Start
(file routes) + Vite 8 — same stack, new `/admin` route family.

**Primary Dependencies**: Installed `@supabase/supabase-js` v2 (auth +
session client); existing `src/components/ui/` library (dialog, drawer,
form, input, select, checkbox, radio-group, switch, table, badge, sonner,
pagination); `tailwindcss` v4 theme tokens. No new packages expected.

**Storage**: Existing Postgres tables + `nahla-images` bucket only; uploads
via session client under entity prefixes. No migrations planned.

**Testing**: No test framework in repo; verification is the `quickstart.md`
matrix (three-actor gate, one-session full task, honesty checks, usability
sweep) plus `tsc --noEmit` (0 errors) and production build.

**Target Platform**: Same Arabic RTL web app; admin renders client-side
after session resolution (SSR shells only); responsive 320–1440px with
drawer navigation and card-ified tables on phones.

**Project Type**: Single-project web application; new route subtree +
admin library module + admin component set.

**Performance Goals**: Dashboard interactions feel instant (local-first
forms, skeletons, toasts); list queries filtered server-side with existing
indexes; uploads show progress and never block unrelated UI.

**Constraints**: Zero schema/RLS changes; no self-registration or manager
management UI; no fake metrics; no service-role exposure; customer routes,
cart, checkout, WhatsApp frozen; session expiry returns to login without
silent data loss where practical; Lovable history rule.

**Scale/Scope**: ~10 admin routes, 1 library module, ~15 shared admin
components, 0 migrations, 0 new tables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-research evaluation (constitution v1.0.0):

- I (source of truth): dashboard reads/writes the same Supabase rows the
  storefront renders; no parallel model — PASS.
- II (commerce boundaries): no cart/order/auth-customer/payment work;
  manager authorization stays database-side (`admin_profiles` + RLS), UI
  guard display-only; secrets never in browser — PASS.
- III (type safety/discipline): typed admin module beside `catalog.ts`,
  no `any`, indexed filtered queries — PASS.
- IV (Arabic UX): Arabic-first genuine RTL admin with loading/error/empty
  states; customer design untouched and re-verified — PASS.
- V (verification): three-actor gate proofs, live CRUD-vs-storefront
  checks, tsc + production build, advisors re-check — PASS.

Post-design re-check (after research.md, data-model.md, contracts/,
quickstart.md): design adds no tables, policies, or customer changes; auth
approach and bootstrap documented as the single secure path. No violations.
**Gate: PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── admin-access.md  # Auth + unfiltered reads + writes + guarantees
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── admin.ts             # NEW: session client, auth fns, unfiltered reads,
│                            # CRUD, upload helper; reuses catalog.ts types
├── routes/
│   └── admin/               # NEW route family (login, home, categories,
│                            # subcategories, products, product editor,
│                            # banners); customer routes untouched
└── components/
    └── admin/               # NEW shared admin primitives (shell, sidebar,
                             # header, data table/card, dialogs, form sections,
                             # uploader, option editors, badges, states);
                             # composed from src/components/ui/ + brand theme
```

**Structure Decision**: New route subtree + admin library + admin component
set alongside the existing app; no modifications to customer routes, cart,
checkout, styles foundation, or database.

## Complexity Tracking

> No constitution violations — nothing to justify. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
