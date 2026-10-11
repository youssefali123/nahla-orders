# Feature Specification: Product Display Filters

**Feature Branch**: `006-product-filters`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "create a specification for i want to create and all details in this file: @src/mds/product-filters.md"

**Source details**: `src/mds/product-filters.md` — give admin-enabled sections
a top chip bar that filters the already-loaded products in place, with
per-section filter values, single assignment per product, and dashboard
management. No pricing, cart, RLS, or design changes beyond the chip bar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shopper filters products in place (Priority: P1)

A shopper opening an enabled section (e.g. منظفات with سوائل/مساحيق/ورقيات)
sees a chip bar starting with الكل, taps a value, and sees only matching
products instantly — no reload, no scroll jump; tapping الكل restores the
full list, and an empty value shows the standard empty-products message.

**Why this priority**: This is the entire shopper-facing value — long
unfilterable lists are the problem being solved.

**Independent Test**: On a section with three values and assigned products,
tap each chip and confirm exactly the matching products show with scroll
preserved; tap الكل and confirm the full list returns.

**Acceptance Scenarios**:

1. **Given** an enabled section with values, **When** opened, **Then** the
   chip bar shows الكل plus values in defined order above the grid.
2. **Given** a tapped value, **When** selected, **Then** only its products
   show with no new reads, no reload, and preserved scroll.
3. **Given** the active value, **When** viewed, **Then** it is distinct by
   more than color alone and exposed as pressed to assistive tech.
4. **Given** a value with no products, **When** selected, **Then** the
   standard empty-products message shows.

---

### User Story 2 - Manager enables sections and curates values (Priority: P1)

A manager flips filtering on for a section, adds/renames/reorders values,
toggles them active, and deletes them knowing assigned products simply lose
their assignment — all inside the existing editors, with no new top-level
pages and no effect on non-enabled sections.

**Why this priority**: Without curation tooling the chip bar has no content
and the feature cannot ship.

**Independent Test**: Enable a test section, manage values through every
operation including duplicates and deletes, and confirm the shopper bar and
editor reflect each change while other sections stay untouched.

**Acceptance Scenarios**:

1. **Given** a section editor, **When** viewed, **Then** a display-filters
   switch plus inline value management exists with no new pages.
2. **Given** a duplicate value name in one section, **When** saved, **Then**
   it is rejected with a clear message.
3. **Given** a deleted value, **When** confirmed, **Then** assigned products
   lose only their assignment and remain orderable.
4. **Given** a non-enabled section, **When** viewed anywhere, **Then** no
   bar and no assignment control appear.

---

### User Story 3 - Manager assigns products to filters (Priority: P2)

A manager editing a product in an enabled section picks one value from a
dropdown of that section's values (values from other sections never
offered); changing sections re-resolves the list; saving stores or clears
the single assignment.

**Why this priority**: Unassigned products never appear under any value —
assignment is what populates the chips.

**Independent Test**: Assign, reassign across values, change sections, and
clear assignments on a test product; confirm listings filter exactly
accordingly and other sections never leak values.

**Acceptance Scenarios**:

1. **Given** a product in an enabled section, **When** edited, **Then** a
   single assignment dropdown lists exactly that section's active values.
2. **Given** a section change, **When** made, **Then** the offered values
   re-resolve and stale assignments cannot be saved.
3. **Given** a product in a non-enabled section, **When** edited, **Then**
   no assignment control appears.

---

### User Story 4 - Filters stay secure and weightless (Priority: P2)

Visitors see only active values of enabled sections and never modify
anything; taps cost zero reads; cart, totals, messages, and option
behaviors are byte-identical; no test rows remain.

**Why this priority**: Filters must not leak unpublished structure, slow
browsing, or disturb money flows.

**Independent Test**: As anonymous, verify active-only visibility and
rejected writes; tap through chips while counting reads (zero new); diff
cart/message/option behavior before and after; confirm zero residue.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor, **When** reading filters, **Then** only
   active values of enabled sections are visible.
2. **Given** an anonymous write attempt, **When** tried, **Then** it is
   rejected.
3. **Given** any filter tap, **When** performed, **Then** no data read
   occurs.
4. **Given** the cart and order message, **When** compared, **Then** values
   and amounts are identical with and without the feature.

---

### Edge Cases

- What happens when the selected value is deactivated mid-browse? → The bar
  refreshes to valid values (falling back to الكل) without errors.
- What happens when a product's section changes away from filtering? → Its
  stale assignment is ignored in listings until reassigned or cleared.
- What happens when all values of a section are inactive? → The bar hides
  and the page behaves as a non-enabled section.
- What happens when test rows are created for verification? → Removed
  afterwards with zero residue.
- What happens on small screens? → The bar scrolls horizontally with no
  page-level overflow and full keyboard operability.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST add exactly two tables,
  `subcategory_filters` (one-of parent FKs with exactly-one-set CHECK,
  non-empty name, per-parent uniqueness, ordering, active flag, reused
  trigger) and `product_filter_values` (`PRIMARY KEY (product_id)`,
  dual-cascade FKs), via new migrations, altering nothing else.
- **FR-002**: Filtering MUST be opt-in per section defaulting off; only
  enabled sections with at least one active value show the bar or any
  assignment control.
- **FR-003**: The chip bar MUST list الكل plus active values in order,
  filter the loaded list client-side with preserved scroll, mark the
  active chip beyond color with pressed semantics, and show the standard
  empty message for empty values.
- **FR-004**: Assignment MUST be a single dropdown of the product's own
  section values, re-resolved on section change, storing or clearing one
  assignment; cross-section values MUST never be offered or saved.
- **FR-005**: Value management MUST live inside existing editors (add,
  rename, reorder, toggle, delete with assignment-loss-only confirms and
  per-parent duplicate rejection) with no new top-level pages.
- **FR-006**: Anonymous reads MUST be active-only and writes rejected;
  non-managers MUST gain nothing; the reused RLS shape MUST NOT weaken.
- **FR-007**: The data layer MUST resolve filters plus the product mapping
  in constant-cost reads beside existing listing queries (no N+1); all
  other functions MUST keep exact behavior.
- **FR-008**: Verification MUST use live queries and renders (schema,
  opt-in gating, in-place filtering, assignment flows, rejections,
  security, money sameness, zero residue, clean type check) with findings
  fixed.

### Key Entities

- **Display Filter**: A named value owned by exactly one subcategory or
  direct-listing category (order, active flag); shown as a chip when its
  section is enabled.
- **Product Filter Assignment**: The single link between a product and one
  value (primary-keyed by product); deleted with either side, cleared on
  section moves.
- **Filter Bar (presentational)**: الكل plus values driving client-side
  filtering of the loaded list; no data, no persistence.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper filters a three-value section through every chip
  with exact matches, preserved scroll, zero new reads, and full restore
  via الكل.
- **SC-002**: A manager enables a section, curates values through every
  operation, and assigns products with each change reflected correctly and
  non-enabled sections untouched.
- **SC-003**: Duplicate values and cross-section assignments are rejected,
  anonymous writes fail, and inactive content never surfaces.
- **SC-004**: Cart totals, order messages, and option behaviors are
  identical with the feature on and off, with zero test residue.
- **SC-005**: Type check passes with zero errors and the schemadiff shows
  exactly the two specified tables.

## Assumptions

- The live catalog/options/admin foundation from prior phases is the
  untouched baseline; only additive changes ship.
- One value per product suffices; multi-tagging is explicitly out of scope.
- Filter names are short Arabic labels; no translations or slugs needed.
- Catalog scale stays small, so in-memory client filtering needs no
  virtualization or caching layer.
- Keyboard, focus, overflow, and motion expectations follow the project's
  established accessibility patterns.
