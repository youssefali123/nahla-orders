# Tasks: Supabase Catalog Migration

**Input**: Design documents from `/specs/001-supabase-catalog-migration/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework exists in this repo and the spec requests none. Verification is performed through explicit verify tasks (RLS probes, render checks, `tsc --noEmit`) instead of automated test suites.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root, Supabase work applied to the `nahla_app` project via migration

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependency, environment, and backend-client baseline

- [X] T001 Install `@supabase/supabase-js` v2 (`npm install @supabase/supabase-js`) in `package.json`
- [X] T002 [P] Create `.env.local` (git-ignored via `*.local`) with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` holding the publishable key only — never the secret key
- [X] T003 Create the singleton anon Supabase client in `src/lib/supabase.ts` (no auth flows; clear Arabic runtime error state when env vars are missing)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database, security, seeds, and data-access layer every story builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Apply schema migration to `nahla_app`: tables `categories`, `subcategories`, `products`, `banners`, `admin_profiles` per `data-model.md` — including `name TEXT NOT NULL`, `price NUMERIC(10,2) NOT NULL CHECK (price >= 0)`, nullable `subcategory_id`, `UNIQUE(name)` on categories, `UNIQUE(category_id, name)` on subcategories, `type`/`link_type`/`role` CHECK constraints, UUID PKs with `gen_random_uuid()` defaults, category-cascade and subcategory-nulling foreign keys
- [X] T005 Apply database helpers migration: `public.is_admin()` (`SECURITY DEFINER`, `STABLE`, fixed `search_path`, checks `admin_profiles` for `role = 'admin'`) plus `public.handle_updated_at()` trigger function attached `BEFORE UPDATE` to categories, subcategories, products, banners
- [X] T006 Apply index migration: `categories(is_active, sort_order)`, `subcategories(category_id, is_active, sort_order)`, `products(category_id, is_active, sort_order)`, `products(subcategory_id, is_active, sort_order)`, `banners(is_active, sort_order)`, partial `products(is_featured) WHERE is_active AND is_featured`
- [X] T007 Apply RLS migration: enable RLS on all five tables; anon+authenticated `SELECT` restricted to `is_active = true` on catalog tables; authenticated `ALL` gated on `is_admin()`; `admin_profiles` deny-by-default with owner-only self-read (`auth.uid() = id`), no public write path
- [X] T008 [P] Create storage bucket `nahla-images` (policy-gated, not public-flag) with `SELECT` on `storage.objects` for `bucket_id = 'nahla-images'` and write policies gated on `is_admin()`; seed uploads run with migration-time elevated rights, never from the browser
- [X] T009 Seed categories (ماركت, مطاعم, خضار وفاكهة, عيش ومعجنات as `type = 'normal'`; طلب مخصص as `type = 'custom_order'`; all active with homepage icons) and subcategories (ماركت: ألبان أجبان مخلل, منظفات, مشروبات وسناكس, قهوة شاي أعشاب; مطاعم: مشاوي, فطائر وبيتزا, كشري وطواجن, أسماك, أكل بيتي with `requires_preorder = true` only for أكل بيتي) idempotently via `INSERT ... ON CONFLICT DO NOTHING` on the natural-key unique constraints
- [X] T010 Seed products from `src/data/catalog.ts` (preserve name, price, unit, description, emoji icon, category/subcategory links, listing order; map static `featured` to `is_featured`) and banners (upload `src/assets/banner-hero.jpg` and `src/assets/banner-offers.jpg` to storage `banners/`, create rows linking the ماركت and خضار وفاكهة categories); mark any placeholder/demo content as such
- [X] T011 [P] Implement the typed data-access layer in `src/lib/catalog.ts` exactly per `contracts/data-access.md` (entity types `Category`, `Subcategory`, `Product`, `Banner`, `CatalogError`; functions `getActiveCategories`, `getActiveSubcategories`, `getCategory`, `getSubcategory`, `getActiveProducts`, `getFeaturedProducts`, `getProduct`, `getActiveBanners`, `searchProducts`) with no `any` and no direct Supabase imports outside `src/lib/supabase.ts`
- [X] T012 Verify foundation: anon-key probes prove active-only reads, all anonymous writes rejected, `admin_profiles` invisible anonymously; rerunning seeds creates zero duplicates; security/performance advisors re-checked clean

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Shopper sees a live homepage catalog (Priority: P1) 🎯 MVP

**Goal**: Homepage sections, banners, and most-ordered products load from Supabase with Arabic loading/error/empty states

**Independent Test**: Seed known active/inactive categories and banners, open `/`, confirm exactly the active ones in catalog order; deactivate one category and confirm it disappears after refresh; block the backend and confirm a retryable Arabic error instead of a blank screen

- [X] T013 [P] [US1] Convert `src/routes/index.tsx` to route loaders (active categories, active banners, featured products) via `src/lib/catalog.ts`, add loading/error/empty states, drop the static catalog import
- [X] T014 [P] [US1] Convert `src/components/Navbar.tsx` to render loader-provided categories, routing `type = 'custom_order'` to `/custom-order` and the rest to `/category/$categoryId` by UUID
- [X] T015 [P] [US1] Convert `src/components/BannerCarousel.tsx` to accept banners as props and resolve links (`category`/`subcategory`/`product` → record route, `custom` → `link_url`, `none`/dangling → `/`)
- [X] T016 [US1] Verify US1: homepage acceptance scenarios (spec US1), `npx tsc --noEmit` passes, `/` renders HTTP 200 with zero `file://` and zero hard-coded entries

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 3 - Cart and WhatsApp order on live data (Priority: P1)

**Goal**: Cart persists locally on live catalog data; checkout produces a WhatsApp order with current prices; nothing order-related is stored server-side

**Independent Test**: Change a product price in the database, reload, order it, and confirm the WhatsApp message shows the new price; confirm the cart survives reload and no order/customer/payment rows exist server-side

- [X] T017 [P] [US3] Extend the cart item in `src/lib/cart.tsx` with optional `image` and pass `image_url`/icon from `src/routes/product.$productId.tsx` and `src/components/ProductCard.tsx` add-to-cart call sites
- [X] T018 [P] [US3] Update `src/routes/cart.tsx` so items whose ids no longer resolve (e.g. legacy slug ids) render as unavailable, are excluded from totals, keep working quantity/delete controls for valid items, and link valid items to `/product/$productId` by UUID
- [X] T019 [P] [US3] Touch `src/routes/checkout.tsx` and `src/routes/custom-order.tsx` only as needed for the new product shape; confirm checkout still builds the WhatsApp order from live cart data and the number stays env-configured
- [X] T020 [US3] Verify US3: price-change propagation, reload persistence, local-only custom orders, zero server-side order rows, `npx tsc --noEmit` passes, `/cart` and `/checkout` render

**Checkpoint**: At this point, User Stories 1 AND 3 should both work independently

---

## Phase 5: User Story 2 - Browse sections, products, and search (Priority: P2)

**Goal**: Category, subcategory, product-detail, and search pages run on Supabase with data-driven navigation and Arabic states

**Independent Test**: For each category shape (with/without subcategories, custom-order type, pre-order subsection) verify the correct page type, products, prices, and notices match database records; verify search and empty states

- [X] T021 [P] [US2] Convert `src/components/ProductCard.tsx` to the DAL `Product` type with the photo-first visual rule (photo → emoji icon → placeholder)
- [X] T022 [P] [US2] Convert `src/routes/category.$categoryId.index.tsx` to loaders: fetch category + active subcategories, redirect `type = 'custom_order'` to `/custom-order`, show subcategories when any exist else the product grid, plus loading/error/empty states ("مفيش منتجات في القسم ده حالياً.")
- [X] T023 [P] [US2] Convert `src/routes/category.$categoryId.$subId.tsx` to loaders: show products with the `requires_preorder` notice ("طلبات الأكل البيتي يجب طلبها قبلها بيوم.") instead of any name check, plus loading/error/empty states
- [X] T024 [P] [US2] Convert `src/routes/product.$productId.tsx` to the `getProduct` loader: missing → not-found, inactive → unavailable state, active → details with live price and add-to-cart
- [X] T025 [P] [US2] Convert `src/routes/search.tsx` to a loader calling `searchProducts(q)` (blank query → no search, results capped at 50), keeping the no-result state with its custom-order call-to-action
- [X] T026 [US2] Verify US2: all browse acceptance scenarios (spec US2), `npx tsc --noEmit` passes, category/subcategory/product/search pages render with correct data

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Secure catalog, ready for future management (Priority: P2)

**Goal**: Prove the public surface is read-only-active and the admin foundation exists without any admin UI, users, or privilege paths

**Independent Test**: As anonymous and as a signed-in non-manager, verify reads return active-only rows, every write is rejected, no self-promotion to manager is possible, and images load from managed storage

- [X] T027 [US4] Run the full RLS/storage verification matrix from `quickstart.md` §1–3 (anon + signed-in-non-manager probes on all tables and the bucket) and re-check security/performance advisors
- [X] T028 [US4] Delete `src/data/catalog.ts` after proving zero imports remain, then run the full render pass (`/`, one category, one subcategory, one product, `/search`, `/cart`, `/checkout`) plus `npx tsc --noEmit`
- [X] T029 [US4] Write the final implementation report covering the 12 required items (tables, columns, relationships, indexes, RLS, storage, seeds, images, replaced files, access layer, converted pages, remaining issues/manual actions)

**Checkpoint**: Backend and security posture proven; static source fully retired

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation sweep across all stories

- [X] T030 Run the complete `quickstart.md` validation end-to-end and fix any deviations
- [X] T031 Search/UX sweep: empty query, no-result state, slow-backend error-with-retry on every converted page — zero blank screens
- [X] T032 Bundle/env hygiene: confirm no secret keys in frontend code or the built bundle, `.env.local` untracked, no `/admin` routes, no orders/cart/customer tables exist, `admin_profiles` holds no rows

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US3 → US2 → US4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Independently testable; shares only the DAL contract
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable; shares only the DAL contract
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Verification-heavy; retires the static file last

### Within Each User Story

- Foundation tasks (schema/seeds/DAL) complete before any story phase
- [P] tasks in different files run in parallel; same-file/migration-order tasks run sequentially
- Verification task closes each phase before moving on

### Parallel Opportunities

- T002 (env) runs parallel with T001 (install); T008 (storage) and T011 (DAL) run parallel with the migration chain
- After Foundation: T013/T014/T015 (homepage, navbar, carousel) in parallel; T017/T018/T019 (cart lib, cart route, checkout) in parallel; T021–T025 (card, category, subcategory, product, search) in parallel
- US1, US3, US2, US4 phases can be staffed in parallel once Foundation is done

---

## Parallel Example: User Story 1

```bash
# Launch all User Story 1 conversions together (different files, foundation done):
Task: "Convert src/routes/index.tsx to route loaders in Phase 3"
Task: "Convert src/components/Navbar.tsx to loader-provided categories in Phase 3"
Task: "Convert src/components/BannerCarousel.tsx to banners prop in Phase 3"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (live homepage)
4. **STOP and VALIDATE**: Test User Story 1 independently per its Independent Test
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo (ordering safe on live prices)
4. Add User Story 2 → Test independently → Deploy/Demo (full browsing live)
5. Add User Story 4 → Verify security matrix → Retire static file → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (homepage)
   - Developer B: User Story 3 (cart/checkout)
   - Developer C: User Story 2 (browse/search)
3. Stories complete and integrate independently; US4 verification closes the feature

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No automated tests exist in this repo; verify tasks (RLS probes, render checks, tsc) are the quality gate per constitution principle V
- Commit after each task or logical group; never rewrite published history (Lovable rule)
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
```

---

## Format Validation

All 32 tasks verified against the checklist format `- [ ] [TaskID] [P?] [Story?] Description with file path`:

- Checkbox first: 32/32 ✅
- Sequential IDs T001–T032, no gaps/duplicates: ✅
- `[P]` only on parallel-safe tasks (different files, foundation-complete): ✅ (T002, T008, T011, T013–T015, T017–T019, T021–T025)
- `[USn]` labels on all story-phase tasks, absent on Setup/Foundational/Polish: ✅
- Exact file path or concrete target in every description: ✅ (routes/components/lib paths, `nahla_app` tables, `quickstart.md` sections)
