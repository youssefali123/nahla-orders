# Tasks: Delivery Zones

**Input**: Design documents from `/specs/004-delivery-zones/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework exists in this repo and the spec requests none. Verification is performed through live-database probes, order-message proofs, and `tsc` instead of automated test suites.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root, Supabase work applied to the `nahla_app` project via migration

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the untouched baseline before adding anything

- [X] T001 Verify baseline in `nahla_app`: row counts of all 7 existing tables recorded; `is_admin()` and `handle_updated_at()` present; no existing table altered afterwards
- [X] T002 [P] Confirm `npx tsc --noEmit -p tsconfig.json` passes and checkout plus admin login render before zone work begins (regression baseline)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The zones table with rules, security, and access functions every story builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Apply schema migration to `nahla_app`: table `delivery_zones` (UUID PK `gen_random_uuid()`; `name` TEXT NOT NULL UNIQUE with non-empty CHECK `length(name) > 0`; `fee NUMERIC(10,2)` NOT NULL DEFAULT 0 CHECK `fee >= 0`; `sort_order` NOT NULL DEFAULT 0; `is_active` NOT NULL DEFAULT true; stamps NOT NULL DEFAULT `now()`) — no seeds
- [ ] T004 Apply trigger migration: attach existing `handle_updated_at()` BEFORE UPDATE to `delivery_zones` (no new function)
- [ ] T005 Apply index migration: `(is_active, sort_order)` composite on `delivery_zones`
- [ ] T006 Apply RLS migration: enable RLS; anon+authenticated `SELECT` restricted to `is_active = true`; authenticated `ALL` gated on existing `is_admin()`; no public writes
- [X] T007 Add `DeliveryZone` type plus `getActiveZones()` (active ordered by `sort_order`, empty array valid) in `src/lib/catalog.ts`
- [X] T008 [P] Add `listZonesAdmin`/`saveZone`/`deleteZone` (input `{ name trimmed non-empty, fee >= 0, sort_order, is_active }`, duplicate-name and invalid-fee Arabic messages) in `src/lib/admin.ts`
- [ ] T009 Verify foundation: table exists with constraints/index/trigger/RLS; empty table handled; existing-table row counts unchanged; temp zone created and deleted with zero residue

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Shopper picks a zone at checkout (Priority: P1) 🎯 MVP

**Goal**: Zone list with fees, preselect + persistence, live-fee grand totals, delivery lines in the order message

**Independent Test**: With priced and free temp zones, complete checkout on each and confirm message lines (items total, zone, fee wording, grand total); reload and confirm preselect; deactivate all and confirm blocked confirm

- [X] T010 [US1] Extend `src/routes/checkout.tsx` (active zone list with name + fee and first-active/stored preselect, grand totals, unavailable state when zero zones, stored zone id in the existing prefill object with stale-id fallback, address field kept and required) and append the three delivery lines in `src/lib/whatsapp.ts` after items
- [X] T011 [US1] Extend checkout confirm revalidation in `src/routes/checkout.tsx` to re-read live zones (recompute grand total, fall back with toast when the stored zone vanished, block with explanation when none remain)
- [ ] T012 [US1] Verify US1 on temp zones: priced + free message proofs, preselect persistence, mid-checkout deactivation behavior, `npx tsc --noEmit` passes, temp data deleted

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manager maintains zones (Priority: P2)

**Goal**: Delivery nav section with full zone CRUD reflected live at checkout

**Independent Test**: Create/rename/reprice/reorder/deactivate/delete a test zone; checkout reflects each change; deletion leaves nothing dangling

- [X] T013 [US2] Create `src/routes/admin.zones.tsx` (searchable table/cards with name, fee formatted in جنيه, order, status; dialog form with name/fee/order/status; toggle; cascade-free delete confirm; toasts) and add the delivery nav group in `src/components/admin/AdminShell.tsx`
- [ ] T014 [US2] Verify US2: temp zone lifecycle reflected at checkout, duplicate/negative fees rejected with clear messages, temp rows deleted, `npx tsc --noEmit` passes

**Checkpoint**: Content management complete with live storefront reflection

---

## Phase 5: User Story 3 - Zones secure and consistent (Priority: P2)

**Goal**: Active-only public reads, admin-only writes, integrity proofs, advisors clean

**Independent Test**: Anon reads hide inactive zones, all anon writes rejected, non-managers gain nothing, invalid fees rejected, advisors re-checked

- [ ] T015 [US3] Run the full RLS matrix on temp rows (anon allow/deny on `delivery_zones`, inactive hidden, signed-in non-manager rejected, negative/duplicate fees rejected) and re-check security/performance advisors with findings fixed
- [ ] T016 [US3] Verify US3: zero residue by counts, existing pages and admin screens render unchanged except checkout totals and the new screen, customer address flow untouched

**Checkpoint**: Backend and security posture proven with nothing left behind

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation sweep across all stories

- [ ] T017 Run the complete `quickstart.md` validation end-to-end (empty-valid table, temp lifecycle, two-fee proofs, security, gates) and fix any deviations
- [X] T018 Confirm zero residue (temp counts match pre-run), `npx tsc --noEmit` passes, no secrets in frontend code, `admin_profiles` holds no new rows
- [ ] T019 Write the final implementation report (table, constraints, RLS, indexes, data access, checkout/admin integration, pricing proofs, zero-residue confirmation, remaining issues/manual actions)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3–5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable on temp rows
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Verification-only; independently testable

### Within Each User Story

- Foundation table/policies/functions complete before any story phase
- [P] tasks in different files run in parallel; migration-order tasks run sequentially
- Temp rows created for a phase are deleted within that phase
- Verification task closes each phase before moving on

### Parallel Opportunities

- T002 (baseline) runs parallel with T001 (counts)
- T008 (admin writes) runs parallel with T007 (public read) — different modules
- After Foundation: US2 admin screen and US3 security matrix can be staffed in parallel (temp rows)
- US1 checkout work proceeds independently once DAL functions land

---

## Parallel Example: User Story 1

```bash
# Implement checkout list and revalidation as reviewable units:
Task: "Extend src/routes/checkout.tsx (zone list, preselect, grand totals, unavailable state)"
Task: "Extend checkout confirm revalidation in src/routes/checkout.tsx (live zones, fallback, block)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (checkout zones + totals + message)
4. **STOP and VALIDATE**: Test User Story 1 independently per its Independent Test (admin screen can come later; temp zones via SQL)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Temp lifecycle → Demo
4. Add User Story 3 → Security matrix → Zero residue → Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (checkout)
   - Developer B: User Story 2 (admin screen)
   - Developer C: User Story 3 (security matrix)
3. Stories complete and integrate independently; Polish closes the feature

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No automated tests exist in this repo; live-query probes, order proofs, `tsc`, and render checks are the quality gates per constitution principle V
- Temp rows are created and deleted within their phase — never persist demo data (never seed real zones)
- Commit after each task or logical group; never rewrite published history (Lovable rule)
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
```

---

## Format Validation

All 19 tasks verified against `- [ ] [TaskID] [P?] [Story?] Description with file path`:

- Checkbox first: 19/19 ✅
- Sequential IDs T001–T019, no gaps/duplicates: ✅
- `[P]` only on parallel-safe tasks: ✅ (T002, T008)
- `[USn]` labels on all story-phase tasks, absent on Setup/Foundational/Polish: ✅
- Exact file path or concrete target in every description: ✅ (`nahla_app` tables, `src/routes/checkout.tsx`, `src/routes/admin.zones.tsx`, `src/lib/whatsapp.ts`, `src/lib/catalog.ts`, `src/lib/admin.ts`, `src/components/admin/AdminShell.tsx`)
