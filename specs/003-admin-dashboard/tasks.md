# Tasks: Admin Dashboard

**Input**: Design documents from `/specs/003-admin-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework exists in this repo and the spec requests none. Verification is performed through live three-actor gate probes, CRUD-vs-storefront checks, and `tsc` + production build instead of automated test suites.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root, Supabase work against the `nahla_app` project (reads/writes only — zero migrations in this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap documentation and clean baseline before building

- [X] T001 Document the first-manager bootstrap (create auth user via dashboard Auth panel, then `INSERT INTO admin_profiles (id) VALUES ('<auth-user-uuid>')`) in `specs/003-admin-dashboard/bootstrap.md` and verify one manager row exists
- [X] T002 [P] Confirm `npx tsc --noEmit -p tsconfig.json` passes and all customer routes render before dashboard work begins (regression baseline)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Session auth, admin data layer, and shell primitives every screen builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Implement `src/lib/admin.ts` auth trio per `contracts/admin-access.md` (browser-session `signInManager`/`signOutManager` with Arabic invalid-credentials message, `getManagerSession` verifying the `admin_profiles` row; no self-registration, no manager writes)
- [X] T004 Implement unfiltered reads in `src/lib/admin.ts` (`listCategoriesAdmin`, `listSubcategoriesAdmin`, `listProductsAdmin`, `getProductAdmin`, `listBannersAdmin`, `dashboardCounts`) reusing `src/lib/catalog.ts` types, inactive rows included, `sort_order ASC`
- [X] T005 Implement writes + upload in `src/lib/admin.ts` (save/delete for categories, subcategories, products, option groups, options, banners with CHECK/UNIQUE violations mapped to Arabic messages including the per-parent duplicate-name message; `uploadImage` to `nahla-images` under entity prefixes with failure blocking the save)
- [X] T006 Create the admin route guard in `src/components/admin/AdminGuard.tsx` (no session → redirect `/admin/login`; session without manager row → access-denied screen; RLS remains the real enforcer)
- [X] T007 [P] Create shell primitives in `src/components/admin/` (`AdminShell.tsx`, `AdminSidebar.tsx` with drawer mobile nav, `AdminHeader.tsx`, `PageHeader.tsx`) on the Cairo brand theme with genuine RTL layout
- [X] T008 [P] Create shared primitives in `src/components/admin/` (`DataTable.tsx` + `MobileDataCard.tsx`, `StatusBadge.tsx` with non-color cues, `ConfirmDialog.tsx` stating real cascade impact, `EmptyState.tsx` with creation shortcut, `ErrorState.tsx` with retry, `FormSection.tsx`, `ImageUploader.tsx` with progress)
- [X] T009 Verify foundation: manager sign-in/out works, guard redirects anonymous and denies non-managers, `npx tsc --noEmit` passes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Manager gate and shell (Priority: P1) 🎯 MVP

**Goal**: Isolated `/admin` family with working sign-in, denial paths, and shell navigation

**Independent Test**: Manager signs in, persists across reloads, signs out; anonymous hits redirect to login with nothing exposed; non-manager denied on routes and writes; no self-registration path exists

- [X] T010 [US1] Create `src/routes/admin.login.tsx` (email/password form, Arabic validation, invalid-credentials message, no signup link, redirects authenticated managers away)
- [X] T011 [US1] Create `src/routes/admin.index.tsx` behind `AdminGuard` rendering `AdminShell` with sidebar navigation (home, catalog section, content section, account section) and session-aware header (manager email, sign-out)
- [X] T012 [US1] Verify US1: three-actor gate matrix passes live, `npx tsc --noEmit` passes, `/admin/*` never leaks data pre-auth

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Categories and subcategories (Priority: P1)

**Goal**: Searchable category management and parent-filtered subcategory management with truthful cascades

**Independent Test**: Create/rename/reorder/deactivate/delete test category and subcategory; storefront reflects active flags; cascade deletes match dialog statements; preorder flag round-trips

- [X] T013 [P] [US2] Create `src/routes/admin.categories.tsx` (searchable list with image preview, type badge with `type` read-only after creation, order, status toggle, create/edit dialog form, delete with cascade confirmation)
- [X] T014 [P] [US2] Create `src/routes/admin.subcategories.tsx` (parent filter + search, status and `requires_preorder` switches bound to stored flags, ordering, image, visually obvious parent link, create/edit/delete with confirmations)
- [X] T015 [US2] Verify US2: full category/subcategory lifecycle on temp rows (deleted afterwards), storefront reflects each change, preorder notice appears/disappears with the flag

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Products with options and deltas (Priority: P1)

**Goal**: Filterable product table plus structured editor with nested option groups, guided limits, visible deltas, and price preview

**Independent Test**: Create product with required single + capped multiple groups and deltas; customer page offers exactly those choices totaling the preview; duplicates/invalid limits rejected inline

- [X] T016 [US3] Create `src/routes/admin.products.tsx` (image, name, category, subcategory, price, options-presence via `getProductsWithOptions`, status; search + category/subcategory/status filters; mobile card layout; add/edit entry points)
- [X] T017 [US3] Create `src/routes/admin.products_.$productId.tsx` (product sections: name, description, base price, category with narrowing subcategory picker, image upload, unit, status, order; base price visually separated from options; live display-only price preview recomputed from form values)
- [X] T018 [US3] Create nested option editing in `src/components/admin/` (`OptionGroupEditor.tsx` with name, single/multiple guided max-toward-1 and helper text, min/max, status; `OptionItemEditor.tsx` with name, always-visible delta formatted `+15 جنيه`/`+0 جنيه`, status, order; add-option inline rows) wired into the product editor with the specified duplicate-name message
- [X] T019 [US3] Verify US3: temp product lifecycle (create → configure → customer-page total matches preview → delete with subtree cascade confirmed), invalid limits and duplicates rejected inline, temp rows deleted

**Checkpoint**: Pricing-critical flows proven without touching commerce code

---

## Phase 6: User Story 4 - Banners and honest home (Priority: P2)

**Goal**: Visual banner management plus a dashboard home showing only live counts and shortcuts

**Independent Test**: Banner create/reorder/deactivate reflects on customer homepage exactly; every home number equals its live count query

- [X] T020 [P] [US4] Create `src/routes/admin.banners.tsx` (image preview cards, upload, title, link-target picker for category/subcategory/product record or custom URL, status, ordering, edit/delete)
- [X] T021 [P] [US4] Fill `src/routes/admin.index.tsx` home (live counts: active categories, products, banners, configurable products; creation shortcuts for product/category/banner; zero fabricated metrics)
- [X] T022 [US4] Verify US4: temp banner lifecycle reflected on the customer homepage, counts match live queries, temp rows deleted

**Checkpoint**: Content management complete with honesty guarantees

---

## Phase 7: User Story 5 - Universal usability, untouched storefront (Priority: P2)

**Goal**: Keyboard-complete responsive RTL experience with zero customer regression

**Independent Test**: Core flows keyboard-only at 320/375/768/1024/1440px with no overflow, blank screens, or console errors; all customer routes return successfully

- [X] T023 [US5] Sweep responsive layouts in `src/components/admin/` and `src/routes/admin/` (drawer nav, card-ified tables, reachable actions, visible primary buttons, no clipped dialogs at 320–414px widths)
- [X] T024 [US5] Sweep accessibility (visible focus states, dialog semantics and trapping, keyboard-complete flows, non-color status cues, Arabic labels, touch targets) across all admin routes
- [X] T025 [US5] Verify US5: usability matrix passes and every customer route (`/`, categories, products, search, cart, checkout) returns successfully with unchanged behavior

**Checkpoint**: Dashboard usable by everyone, storefront untouched

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation sweep across all stories

- [X] T026 Run the complete `quickstart.md` validation end-to-end (three-actor gate, one-session full task, honesty checks, usability, quality gates) and fix deviations
- [X] T027 Confirm `npx tsc --noEmit` passes, `npm run build` passes, RLS posture unchanged (advisors re-checked), no secrets in code or bundle, all destructive actions confirmation-gated
- [X] T028 Write the final implementation report (auth model, screens, components, verification evidence per the brief's final-verification list, remaining issues/manual actions)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3–7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independently testable on temp rows
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Uses shared primitives; independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independently testable
- **User Story 5 (P2)**: Needs all screens built - runs last among stories, verifiable incrementally

### Within Each User Story

- Foundation auth/data/shell complete before any story phase
- [P] tasks in different files run in parallel; same-file tasks run sequentially
- Temp rows created for a phase are deleted within that phase
- Verification task closes each phase before moving on

### Parallel Opportunities

- T002 (baseline) runs parallel with T001 (bootstrap doc)
- T007/T008 (shell + shared primitives) run parallel with T003–T006 (auth/data/guard)
- After Foundation: T013/T014 (categories/subcategories), T020/T021 (banners/home) in parallel pairs
- T016 (product table) proceeds while T018 (option editors) is built — both consumed by T017 editor assembly

---

## Parallel Example: User Story 2

```bash
# Launch both category screens together (different files, foundation done):
Task: "Create src/routes/admin.categories.tsx (searchable list, dialog form, cascade confirms)"
Task: "Create src/routes/admin.subcategories.tsx (parent filter, preorder switch, ordering)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (gate + shell + navigation)
4. **STOP and VALIDATE**: Test the three-actor gate independently
5. Deploy/demo if ready (empty shell behind a proven lock)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test gate independently → Demo (MVP!)
3. Add User Story 2 → Temp lifecycle → Demo
4. Add User Story 3 → Temp product + preview match → Demo
5. Add User Story 4 → Banner reflected on homepage → Demo
6. Add User Story 5 → Usability matrix + storefront regression → Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 2 (categories/subcategories)
   - Developer B: User Story 3 (products + options)
   - Developer C: User Story 4 (banners + home)
3. Stories complete and integrate independently; US5 sweep closes the feature

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No automated tests exist in this repo; live three-actor probes, CRUD-vs-storefront checks, `tsc`, and production build are the quality gates per constitution principle V
- Temp rows are created and deleted within their phase — never persist demo data
- Commit after each task or logical group; never rewrite published history (Lovable rule)
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
```

---

## Format Validation

All 28 tasks verified against `- [ ] [TaskID] [P?] [Story?] Description with file path`:

- Checkbox first: 28/28 ✅
- Sequential IDs T001–T028, no gaps/duplicates: ✅
- `[P]` only on parallel-safe tasks: ✅ (T002, T007, T008, T013, T014, T020, T021)
- `[USn]` labels on all story-phase tasks, absent on Setup/Foundational/Polish: ✅
- Exact file path or concrete target in every description: ✅ (`src/routes/admin/*`, `src/components/admin/*`, `src/lib/admin.ts`, `quickstart.md` sections)
