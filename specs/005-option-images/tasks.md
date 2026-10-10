# Tasks: Product Option Images

**Input**: Design documents from `/specs/005-option-images/`

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

- [X] T001 Verify baseline in `nahla_app`: row counts of all 9 existing tables recorded; `product_options` has no `image_url` column; no existing table altered afterwards
- [X] T002 [P] Confirm `npx tsc --noEmit -p tsconfig.json` passes and the product page renders before option-image work begins (regression baseline)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The single nullable column every story builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Apply schema migration to `nahla_app`: `ALTER TABLE product_options ADD COLUMN image_url TEXT NULL` (no backfill — existing rows read as NULL; no other table, policy, trigger, or index touched)
- [X] T004 Verify foundation: `image_url` exists and is nullable, all existing option rows read as NULL, existing-table row counts unchanged

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Selected option photo shows (Priority: P1) 🎯 MVP

**Goal**: Main product photo follows the recency stack with pop-on-deselect and base-chain fallback

**Independent Test**: On a temp product with imaged options in two groups, select across groups (newest wins), deselect back down the stack to the base photo, and confirm zero layout shift throughout

- [X] T005 [US1] Extend `ProductOption` in `src/lib/catalog.ts` with `image_url: string | null` (mapped in the existing ordered tree; zero extra queries)
- [X] T006 [US1] Implement recency-stack main photo in `src/routes/product.$productId.tsx` (ephemeral pick-order state; newest imaged selection wins; pop on deselect; fallback to the unchanged product base chain; fixed-aspect container; crossfade honoring reduced motion)
- [X] T007 [US1] Verify US1 on temp rows/files: cross-group recency, pop-to-base, no-shift layout, `npx tsc --noEmit` passes, temp rows and files deleted afterwards

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Picker thumbnails (Priority: P2)

**Goal**: Lazy thumbnails beside imaged options only, with zero selection/pricing impact

**Independent Test**: Mixed imaged/imageless group shows thumbnails only beside imaged options; selection and price behave identically with and without photos

- [X] T008 [US2] Add lazy thumbnails (`loading="lazy"`, `alt` = option name, `aria-hidden` wrappers) to option buttons in `src/routes/product.$productId.tsx`, rendered only when `image_url` is present
- [X] T009 [US2] Verify US2: thumbnail presence/absence, lazy loading, identical selection and pricing behavior, temp files deleted

**Checkpoint**: Picker aids decisions without touching state or money

---

## Phase 5: User Story 3 - Manager uploads option photos (Priority: P2)

**Goal**: Upload/preview/remove per option inside the existing editor with upload-then-save

**Independent Test**: Upload, preview, remove, and re-upload an option photo; customer page reflects each state; failed uploads block saves with retry and never store broken references

- [X] T010 [US3] Extend `saveOption` in `src/lib/admin.ts` to accept optional `image_url` (`string | null`)
- [X] T011 [US3] Extend the option row in `src/components/admin/options.tsx` with image upload (prefix `options/`), preview, and remove action under upload-then-save with retry
- [X] T012 [US3] Verify US3: full upload lifecycle reflected on the customer page, failure blocks saves, group editing/limits/deltas/preview unchanged, temp files deleted

**Checkpoint**: Content pipeline complete without touching editor structure

---

## Phase 6: User Story 4 - Secure and weightless photos (Priority: P2)

**Goal**: Active-only visibility, rejected writes, unchanged cart/message, clean residue

**Independent Test**: Anonymous reads obey active-only photo visibility with writes rejected; cart totals and order messages identical; zero leftover test rows/files

- [X] T013 [US4] Run the security matrix (anon allow/deny on option images, inactive hidden, non-managers gain nothing) and confirm cart totals plus order messages are byte-identical before/after
- [X] T014 [US4] Verify US4: zero residue by counts and storage listing, existing pages render unchanged, advisors re-checked clean

**Checkpoint**: Photos add delight with zero security, money, or weight regressions

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation sweep across all stories

- [X] T015 Run the complete `quickstart.md` validation end-to-end (column, swap/pop/fallback, thumbnails, cart sameness, security, gates) and fix any deviations
- [X] T016 Confirm zero residue (temp counts and storage match pre-run), `npx tsc --noEmit` passes, no secrets in frontend code
- [X] T017 Write the final implementation report (schema change, storage prefix, DAL changes, product-page behavior, dashboard changes, verification evidence per the brief list, remaining issues/manual actions)

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on the US1 photo field; independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independently testable on temp rows
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Verification-only; independently testable

### Within Each User Story

- Foundation column complete before any story phase
- [P] tasks in different files run in parallel; migration-order tasks run sequentially
- Temp rows and files created for a phase are deleted within that phase
- Verification task closes each phase before moving on

### Parallel Opportunities

- T002 (baseline) runs parallel with T001 (counts)
- After Foundation: US3 admin upload work and US2 thumbnail work proceed in parallel (different files)
- US4 security matrix can be staffed in parallel with any story phase (temp rows)

---

## Parallel Example: User Story 1

```bash
# Implement the type and the photo resolution as reviewable units:
Task: "Extend ProductOption in src/lib/catalog.ts with image_url (mapped, zero queries)"
Task: "Implement recency-stack main photo in src/routes/product.$productId.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (photo swapping)
4. **STOP and VALIDATE**: Test User Story 1 independently per its Independent Test
5. Deploy/demo if ready (photo swapping with zero other impact)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Thumbnails → Demo
4. Add User Story 3 → Upload pipeline → Demo
5. Add User Story 4 → Security matrix → Zero residue → Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (photo swapping)
   - Developer B: User Story 3 (admin upload)
   - Developer C: User Story 4 (security matrix)
3. Stories complete and integrate independently; US2 thumbnails close the feature

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No automated tests exist in this repo; live renders, live queries, `tsc`, and storage checks are the quality gates per constitution principle V
- Temp rows and files are created and deleted within their phase — never persist demo data
- Commit after each task or logical group; never rewrite published history (Lovable rule)
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
```

---

## Format Validation

All 17 tasks verified against `- [ ] [TaskID] [P?] [Story?] Description with file path`:

- Checkbox first: 17/17 ✅
- Sequential IDs T001–T017, no gaps/duplicates: ✅
- `[P]` only on parallel-safe tasks: ✅ (T002)
- `[USn]` labels on all story-phase tasks, absent on Setup/Foundational/Polish: ✅
- Exact file path or concrete target in every description: ✅ (`nahla_app` tables, `src/lib/catalog.ts`, `src/lib/admin.ts`, `src/routes/product.$productId.tsx`, `src/components/admin/options.tsx`, `quickstart.md` sections)
