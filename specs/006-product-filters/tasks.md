# Tasks: Product Display Filters

**Input**: Design documents from `/specs/006-product-filters/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework exists in this repo and the spec requests none. Verification is performed through live renders, live queries, and `tsc` instead of automated test suites.

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

- [X] T001 Verify baseline in `nahla_app`: row counts of all existing tables recorded; no `subcategory_filters` or `product_filter_values` tables and no `has_filters` columns exist; no existing table altered afterwards
- [X] T002 [P] Confirm `npx tsc --noEmit -p tsconfig.json` passes and listing pages render before filter work begins (regression baseline)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The two tables, opt-in flags, and security posture every story builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Apply schema migration to `nahla_app`: table `subcategory_filters` (UUID PK `gen_random_uuid()`; `subcategory_id` NULL REFERENCES `subcategories(id)` ON DELETE CASCADE; `category_id` NULL REFERENCES `categories(id)` ON DELETE CASCADE; exactly-one-parent CHECK `((subcategory_id IS NULL) != (category_id IS NULL))`; `name` NOT NULL CHECK `length(name) > 0`; `sort_order` NOT NULL DEFAULT 0; `is_active` NOT NULL DEFAULT true; stamps NOT NULL DEFAULT `now()`; per-parent uniques) and table `product_filter_values` (`product_id` NOT NULL REFERENCES `products(id)` ON DELETE CASCADE; `filter_id` NOT NULL REFERENCES `subcategory_filters(id)` ON DELETE CASCADE; `PRIMARY KEY (product_id)`)
- [ ] T004 Apply columns migration: `subcategories.has_filters BOOLEAN NOT NULL DEFAULT false` and `categories.has_filters BOOLEAN NOT NULL DEFAULT false` (no other alteration to existing tables)
- [ ] T005 Apply trigger migration: attach existing `handle_updated_at()` BEFORE UPDATE to `subcategory_filters` (no new function)
- [ ] T006 Apply index migration: `(subcategory_id, is_active, sort_order)` and `(category_id, is_active, sort_order)` on filters; `(filter_id)` on assignments
- [ ] T007 Apply RLS migration: enable RLS on both tables; anon+authenticated SELECT on filters restricted to `is_active` rows with an enabled, active parent via EXISTS (no `auth.*` calls); assignments readable active-only; authenticated `ALL` gated on existing `is_admin()`; no public writes
- [ ] T008 Verify foundation: both tables exist with constraints/uniques/cascades/trigger/indexes/RLS; flag columns default false everywhere; existing-table row counts unchanged; temp enabled section with values created and fully deleted with zero residue

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - In-place chip filtering (Priority: P1) 🎯 MVP

**Goal**: Enabled sections show a chip bar filtering loaded products with zero new reads

**Independent Test**: On a temp enabled section with three values and assigned products, tap each chip for exact matches with preserved scroll and zero new reads; tap الكل for full restore

- [X] T009 [US1] Add `DisplayFilter`/`ProductWithFilter` types plus `getSectionFilters` and `getProductsWithFilters` (one constant-cost mapping query, no N+1) in `src/lib/catalog.ts`
- [X] T010 [US1] Create the `FilterBar` chips component in `src/components/FilterBar.tsx` (الكل first, pressed/focus states beyond color, keyboard-navigable, horizontal scroll without page overflow)
- [X] T011 [US1] Wire the chip bar with client-side filtering into `src/routes/category.$categoryId.index.tsx` and `src/routes/category.$categoryId.$subId.tsx` (bar only when the section is enabled with active values; standard empty message for empty values)
- [ ] T012 [US1] Verify US1 on temp data: per-chip exact matches, scroll preservation, zero new reads per tap, `npx tsc --noEmit` passes, temp rows deleted

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Section opt-in and value curation (Priority: P1)

**Goal**: Enable switch plus full value lifecycle inside existing editors with no new pages

**Independent Test**: Enable a test section, manage values through add/rename/reorder/toggle/delete including duplicates, and confirm the shopper bar and editor reflect each change while other sections stay untouched

- [X] T013 [P] [US2] Add the display-filters enable switch plus inline value CRUD (add, rename, reorder, toggle, delete with assignment-loss-only confirms and per-parent duplicate rejection) to the subcategory editor in `src/routes/admin.subcategories.tsx`
- [X] T014 [P] [US2] Add the same enable switch plus inline value CRUD to the category editor in `src/routes/admin.categories.tsx` (applies to direct-listing categories)
- [X] T015 [US2] Add `listFiltersAdmin`/`saveFilter`/`deleteFilter`/`setSectionFiltering` in `src/lib/admin.ts` (cross-section values impossible by construction; duplicate names rejected verbatim)
- [ ] T016 [US2] Verify US2: full curation lifecycle on temp data reflected in bar and editor, duplicates rejected, deletes drop assignments only, temp rows deleted

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Product assignment (Priority: P2)

**Goal**: Conditional single-assignment dropdown that re-resolves per section

**Independent Test**: Assign, reassign, switch sections, and clear assignments on a test product; listings filter exactly accordingly with no cross-section leakage

- [X] T017 [US3] Add `saveProductFilter` (validates the value belongs to the product's own section) in `src/lib/admin.ts`
- [X] T018 [US3] Add the conditional assignment dropdown in `src/routes/admin.product-editor.tsx` (visible only for enabled sections, populated from that section's active values, re-resolved on section change, clearable)
- [ ] T019 [US3] Verify US3: assignment flows, re-resolution, clearing, and rejection of stale values on temp data, temp rows deleted

**Checkpoint**: Assignment populates chips with exactly the right products

---

## Phase 6: User Story 4 - Secure and weightless filters (Priority: P2)

**Goal**: Active-only visibility, rejected writes, and byte-identical money flows

**Independent Test**: Anonymous reads hide inactive content, all anon writes rejected, non-managers gain nothing, taps cost zero reads, cart/messages/options identical, zero residue

- [ ] T020 [US4] Run the security matrix (anon allow/deny on both tables, inactive and disabled-section content hidden, signed-in non-manager rejected) and confirm zero reads per tap plus byte-identical cart, totals, messages, and option behaviors
- [ ] T021 [US4] Verify US4: zero residue by counts, existing pages render unchanged, advisors re-checked clean

**Checkpoint**: Filters add delight with zero security, money, or weight regressions

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation sweep across all stories

- [ ] T022 Run the complete `quickstart.md` validation end-to-end (additive schema, opt-in bar, editor flows, security/sameness/gates) and fix any deviations
- [ ] T023 Confirm zero residue (temp counts match pre-run), `npx tsc --noEmit` passes, no secrets in frontend code, `admin_profiles` holds no new rows
- [ ] T024 Write the final implementation report (schema additions, DAL changes, shopper filtering behavior, dashboard changes, verification evidence per the brief list, remaining issues/manual actions)

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
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independently testable on temp data
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Needs US1's mapping reads for the flag data; independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Verification-only; independently testable

### Within Each User Story

- Foundation tables/flags/policies complete before any story phase
- [P] tasks in different files run in parallel; migration-order tasks run sequentially
- Temp rows created for a phase are deleted within that phase
- Verification task closes each phase before moving on

### Parallel Opportunities

- T002 (baseline) runs parallel with T001 (counts)
- T013/T014 (subcategory/category editors) run parallel with T015 (admin functions) — different files
- After Foundation: US2 curation and US4 security matrix can be staffed in parallel (temp rows)
- US1 bar work and US3 assignment work proceed independently once DAL lands

---

## Parallel Example: User Story 1

```bash
# Implement the reads and the bar as reviewable units:
Task: "Add DisplayFilter types and getSectionFilters in src/lib/catalog.ts"
Task: "Create the FilterBar chips component in src/components/FilterBar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (chip bar filtering)
4. **STOP and VALIDATE**: Test User Story 1 independently per its Independent Test
5. Deploy/demo if ready (additive only — safe to ship)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Curation lifecycle → Demo
4. Add User Story 3 → Assignment flows → Demo
5. Add User Story 4 → Security matrix → Zero residue → Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (bar + filtering)
   - Developer B: User Story 2 (curation editors)
   - Developer C: User Story 4 (security matrix)
3. Stories complete and integrate independently; US3 assignment closes the feature

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No automated tests exist in this repo; live renders, live queries, `tsc`, and storage checks are the quality gates per constitution principle V
- Temp rows are created and deleted within their phase — never persist demo data
- Commit after each task or logical group; never rewrite published history (Lovable rule)
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
```

---

## Format Validation

All 24 tasks verified against `- [ ] [TaskID] [P?] [Story?] Description with file path:

- Checkbox first: 24/24 ✅
- Sequential IDs T001–T024, no gaps/duplicates: ✅
- `[P]` only on parallel-safe tasks: ✅ (T002, T013, T014, T015)
- `[USn]` labels on all story-phase tasks, absent on Setup/Foundational/Polish: ✅
- Exact file path or concrete target in every description: ✅ (`nahla_app` tables, `src/lib/catalog.ts`, `src/lib/admin.ts`, `src/components/FilterBar.tsx`, `src/routes/category.*`, `src/routes/admin.product-editor.tsx`, `src/routes/admin.subcategories.tsx`, `src/routes/admin.categories.tsx`, `quickstart.md` sections)
