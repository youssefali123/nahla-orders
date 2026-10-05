# Tasks: Product Options (Variants & Add-ons)

**Input**: Design documents from `/specs/002-product-options/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework exists in this repo and the spec requests none. Verification is performed through live-database probes and `tsc` instead of automated test suites.

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

- [X] T001 Verify baseline in `nahla_app`: row counts of `categories`, `subcategories`, `products`, `banners`, `admin_profiles` recorded; helpers `is_admin()` and `handle_updated_at()` present; no existing table altered afterwards
- [X] T002 [P] Confirm `src/lib/catalog.ts` and `src/lib/supabase.ts` typecheck clean (`npx tsc --noEmit -p tsconfig.json`) before extension

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The two option tables with rules, security, and performance in place

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Apply schema migration to `nahla_app`: tables `product_option_groups` (UUID PK `gen_random_uuid()`; `product_id` NOT NULL REFERENCES `products(id)` ON DELETE CASCADE; `name` NOT NULL CHECK `length(name) > 0`; `type` NOT NULL DEFAULT `'single'` CHECK in (`'single'`, `'multiple'`); `min_selections` NOT NULL DEFAULT 0 CHECK `>= 0`; `max_selections` NULL CHECK `max IS NULL OR max >= min`; single caps `type='multiple' OR max IS NULL OR max <= 1` and `type='multiple' OR min <= 1`; `UNIQUE(product_id, name)`; `sort_order`/`is_active` defaults; stamps) and `product_options` (`option_group_id` NOT NULL REFERENCES `product_option_groups(id)` ON DELETE CASCADE; `name` NOT NULL CHECK `length(name) > 0`; `price_delta NUMERIC(10,2)` NOT NULL DEFAULT 0; `UNIQUE(option_group_id, name)`; `sort_order`/`is_active` defaults; stamps)
- [X] T004 Apply trigger migration: attach existing `handle_updated_at()` BEFORE UPDATE to `product_option_groups` and `product_options` (no new function)
- [X] T005 Apply index migration: `(product_id, is_active, sort_order)` on groups and `(option_group_id, is_active, sort_order)` on options
- [X] T006 Apply RLS migration: enable RLS on both tables; anon+authenticated SELECT restricted to active rows with active ancestors (groups: own `is_active` plus product active; options: own flag plus group and product active); authenticated `ALL` gated on existing `is_admin()`; no public writes
- [X] T007 Verify foundation: both tables exist with constraints/indexes/triggers/RLS; existing-table row counts unchanged; temp product created and deleted proving cascade with zero residue

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Product with choices loads as one unit (Priority: P1) 🎯 MVP

**Goal**: `getProduct` returns the ordered active option tree; listings flag option availability at constant cost

**Independent Test**: Temp configured product (3 groups, 8 options) round-trips complete and ordered; plain product returns `option_groups: []`; 50-id flag mapping uses constant query count

- [X] T008 [US1] Extend types in `src/lib/catalog.ts` (`OptionGroupType`, `OptionGroup`, `ProductOption`, `ConfiguredGroup`, `ConfiguredProduct`) with nullable fields exact per `contracts/options-access.md`
- [X] T009 [US1] Extend `getProduct` in `src/lib/catalog.ts` to embed active groups (ordered) each with active options (ordered) in 3 indexed reads, omitting groups with zero active options, preserving the null-when-missing and inactive-handling contract
- [X] T010 [P] [US1] Add `getProductsWithOptions(ids)` in `src/lib/catalog.ts` (empty input → `{}`, one constant-count existence query, no N+1)
- [X] T011 [US1] Verify US1 on temp rows: full ordered tree, empty list for plain products, flag mapping correct, `npx tsc --noEmit` passes, temp rows deleted afterwards

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Choice rules expressible and enforceable (Priority: P1)

**Goal**: All documented valid shapes accepted, all invalid shapes rejected by the database

**Independent Test**: Insert required single (1,1), optional single (0,1), open multiple (0,NULL), capped multiple (0,3) — accepted; single with max 2, min 2 on single, min above max, negative min, unknown type, duplicate names per parent — rejected

- [X] T012 [US2] Run the rule-shape matrix on temp rows in `nahla_app` (4 valid accepted, 6 invalid rejected with clear errors) and delete all temp rows afterwards
- [X] T013 [US2] Verify US2: rejections come from CHECK/UNIQUE constraints (not app code) and pre-existing catalog rows are byte-identical

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Base-plus-choices pricing, cart stays local (Priority: P2)

**Goal**: Pricing formula proven through live data with zero cart/checkout/UI/table changes

**Independent Test**: Live base + live deltas compute the documented example exactly; repo contains no new UI, routes, or order tables

- [X] T014 [US3] Prove pricing on temp rows: base 100 with deltas +30/+15/+0 computes to exactly 145 via `getProduct` data, unit × quantity confirmed
- [X] T015 [US3] Verify US3: no cart/order/customer tables created, no selection/cart/checkout/admin UI added or modified, cart remains client-side only

**Checkpoint**: Pricing model proven without touching commerce flows

---

## Phase 6: User Story 4 - Choices secure and consistent (Priority: P2)

**Goal**: Active-only public reads, admin-only writes, cascades proven, advisors clean

**Independent Test**: Anon reads hide inactive trees, all anon writes rejected, non-managers gain nothing, product/group deletes cascade on temp rows, advisors re-checked

- [X] T016 [US4] Run the full RLS matrix on temp rows (anon allow/deny on both tables, inactive-product tree hidden, signed-in non-manager rejected) and re-check security/performance advisors with findings fixed
- [X] T017 [US4] Verify US4: temp product delete cascades through groups to options, temp group delete cascades to its options, zero residue by counts, existing pages render unchanged

**Checkpoint**: Backend and security posture proven with nothing left behind

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation sweep across all stories

- [X] T018 Run the complete `quickstart.md` validation end-to-end and fix any deviations
- [X] T019 Confirm zero residue (temp counts match pre-run), `npx tsc --noEmit` passes, no secrets in frontend code, `admin_profiles` holds no new rows
- [X] T020 Write the final implementation report (tables, constraints, RLS, indexes, data access, pricing proof, zero-residue confirmation, remaining issues/manual actions)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Verification-only; independently testable on temp rows
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Needs US1's `getProduct` tree for the pricing proof
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Verification-only; independently testable

### Within Each User Story

- Foundation tables/policies complete before any story phase
- [P] tasks in different files run in parallel; migration-order tasks run sequentially
- Temp rows created for a phase are deleted within that phase
- Verification task closes each phase before moving on

### Parallel Opportunities

- T002 (baseline typecheck) runs parallel with T001 (baseline counts)
- T010 (flag helper) runs parallel with T008–T009 (types + tree) — same file, so sequence in practice; marked [P] as independently reviewable units
- After Foundation: US2/US3/US4 verification phases can be staffed in parallel (all work on temp rows)
- US1 DAL work and any US2 probe preparation proceed independently

---

## Parallel Example: User Story 1

```bash
# Implement the tree embedding and the flag helper as reviewable units:
Task: "Extend types in src/lib/catalog.ts (OptionGroup, ProductOption, ConfiguredProduct)"
Task: "Add getProductsWithOptions(ids) in src/lib/catalog.ts (constant-count flag)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (configured-product read + flag)
4. **STOP and VALIDATE**: Test User Story 1 independently per its Independent Test
5. Deploy/demo if ready (no UI impact — safe to ship the DAL)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo (MVP!)
3. Add User Story 2 → Rule matrix proven → Demo
4. Add User Story 3 → Pricing proven, commerce untouched → Demo
5. Add User Story 4 → Security matrix → Zero residue → Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (DAL tree + flag)
   - Developer B: User Story 2 (rule matrix probes)
   - Developer C: User Story 4 (security matrix probes)
3. Stories complete and integrate independently; US3 pricing proof closes the feature

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No automated tests exist in this repo; live-query probes plus `tsc` are the quality gate per constitution principle V
- Temp rows are created and deleted within their phase — never persist demo data
- Commit after each task or logical group; never rewrite published history (Lovable rule)
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
```

---

## Format Validation

All 20 tasks verified against `- [ ] [TaskID] [P?] [Story?] Description with file path`:

- Checkbox first: 20/20 ✅
- Sequential IDs T001–T020, no gaps/duplicates: ✅
- `[P]` only on parallel-safe tasks: ✅ (T002, T010)
- `[USn]` labels on all story-phase tasks, absent on Setup/Foundational/Polish: ✅
- Exact file path or concrete target in every description: ✅ (`nahla_app` tables, `src/lib/catalog.ts`, `quickstart.md` sections)
