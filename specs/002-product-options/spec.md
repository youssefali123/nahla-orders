# Feature Specification: Product Options (Variants & Add-ons)

**Feature Branch**: `002-product-options`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "create a specification for i want to create and all details in this file: @src/mds/addons-variant.md"

**Source details**: `src/mds/addons-variant.md` — extend the live Nahla catalog so a
product can optionally carry configurable choices (sizes, flavors, add-ons)
through a generic option-group model in Supabase plus data-access support. This
phase builds the database foundation and data-access layer ONLY — no selection
UI, no cart/checkout changes, no admin UI.

## Clarifications

### Session 2026-10-03

- Q: Should option group names be unique within their product, and option names unique within their group? → A: Unique per parent.
- Q: Should verification leave demo option groups on a real product, or use temporary rows removed afterwards? → A: Temporary rows only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Product with choices loads as one unit (Priority: P1)

A future ordering screen needs the full picture for a configurable product
(e.g. size choices, flavor choices, extra add-ons with their price additions)
in a single read, while a plain product with no options keeps working exactly
as today. Listings can also tell cheaply whether a product has choices (e.g.
to show a "customize" affordance later).

**Why this priority**: Everything downstream (selection UI, cart, WhatsApp
message) depends on this read; without it the feature cannot function.

**Independent Test**: Configure a product with three option groups and several
options each, fetch it, and confirm the complete tree (groups in order, options
in order, only active records) arrives together; fetch a plain product and
confirm it returns with an empty option list.

**Acceptance Scenarios**:

1. **Given** a product with active option groups and options, **When** it is
   fetched, **Then** the product arrives with its groups in defined order and
   each group with its active options in defined order.
2. **Given** a product with no options, **When** it is fetched, **Then** it
   returns with an empty option list and behaves exactly as before.
3. **Given** a product listing, **When** it is fetched, **Then** each product
   indicates whether it has active options without requiring one extra read
   per product.

---

### User Story 2 - Choice rules are expressible and enforceable (Priority: P1)

The store needs rules like "pick exactly one size" (required single),
"flavor is optional" (optional single), and "up to 3 extras" (capped multiple).
The model must express these generically — never by hard-coding names like
"الحجم" or "الإضافات" — and must reject nonsense configurations (e.g. a
single-choice group demanding 2 picks) at the data level.

**Why this priority**: Invalid configurations would surface as broken ordering
screens later; rejecting them at the source protects every future UI.

**Independent Test**: Insert each documented rule shape (required single,
optional single, open multiple, capped multiple) and confirm acceptance;
attempt invalid shapes (single with max 2, min above max, negative min) and
confirm rejection.

**Acceptance Scenarios**:

1. **Given** a required single-choice group (min 1, max 1), **When** saved,
   **Then** it is accepted and documented as requiring exactly one pick.
2. **Given** a capped multiple group (max 3), **When** saved, **Then** it is
   accepted and documents "up to 3 picks".
3. **Given** a single-choice group allowing more than one pick, or any group
   with min above max or negative min, **When** saved, **Then** it is rejected
   with a clear error.

---

### User Story 3 - Order pricing stays base-plus-choices, cart stays local (Priority: P2)

When ordering later supports choices, the item price must be the product base
price plus the selected options' additions (e.g. 100 + 30 + 15 + 0 = 145), the
cart must remain on the device with the selections inside the cart item, and
the WhatsApp message must use live catalog data — never a manipulated
client-side price. No cart/order UI or tables are built in this phase.

**Why this priority**: Guarantees the pricing model is sound before any
money-adjacent UI is built on top of it.

**Independent Test**: Using sample data, compute an order line from live base
price + live deltas and confirm the formula; confirm no cart/order/checkout
tables or UI changes ship in this phase.

**Acceptance Scenarios**:

1. **Given** a base price and selected option additions, **When** the line
   price is computed, **Then** it equals base plus the sum of additions,
   times quantity.
2. **Given** this phase's delivery, **When** inspected, **Then** no cart,
   order, checkout, or selection UI exists or changed, and no order-related
   tables were created.
3. **Given** option records carry stable identifiers, **When** a future cart
   item references them, **Then** the reference resolves to the same group
   and option.

---

### User Story 4 - Choices stay secure and consistent (Priority: P2)

Visitors must see only active options of active products and must never modify
choices; only future authorized managers may manage them; deleting a product
or group must clean up its children; existing catalog data and behavior must
be untouched.

**Why this priority**: Choices affect what shoppers pay — integrity and
access control are non-negotiable before any ordering UI relies on them.

**Independent Test**: As anonymous, verify reads return active-only trees and
every write is rejected; verify cascade deletes on copies of data; verify all
pre-existing catalog rows and behaviors are unchanged.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor, **When** reading options, **Then** only
   active groups/options of active products are visible.
2. **Given** an anonymous visitor, **When** attempting any write to choices,
   **Then** it is rejected.
3. **Given** a signed-in non-manager, **When** attempting to manage choices,
   **Then** it is rejected.
4. **Given** a product or group deletion, **When** executed, **Then** its
   child groups/options disappear with it and nothing else is affected.
5. **Given** the existing catalog, **When** compared before and after,
   **Then** no existing table, row, or behavior changed except by explicit
   addition.

---

### Edge Cases

- What happens when an option group has no active options? → The group is
  hidden from the product's choice list (an empty group offers no choice).
- What happens when a product is deactivated? → Its entire option tree
  disappears from public reads with it.
- What happens when an option's price addition changes after a shopper saved
  it in the local cart? → The future checkout re-reads live data (same rule
  as base prices); this phase only guarantees the data is re-readable.
- What happens when a banner-style dangling reference occurs (option points
  at a deleted group)? → Impossible by construction: cascade delete removes
  orphans; the API never returns half-trees.
- What happens when seed/test rows are created for verification? → They are
  removed afterwards; no fake production options remain.
- What happens when a group is configured `single` with `max_selections`
  unset (NULL)? → Treated as at most one pick, consistent with the
  single-choice rule.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST add exactly two tables, `product_option_groups`
  and `product_options`, and MUST NOT recreate, replace, or alter any existing
  table's columns or behavior.
- **FR-002**: An option group MUST belong to exactly one product
  (`product_id` NOT NULL, product delete cascades to its groups); an option
  MUST belong to exactly one group (`option_group_id` NOT NULL, group delete
  cascades to its options).
- **FR-003**: Group `type` MUST be only `single` or `multiple` (database CHECK);
  `min_selections >= 0` (CHECK); `max_selections` MUST be NULL or `>=
  min_selections` (CHECK); `name` MUST be non-empty on groups and options.
- **FR-003a**: Group names MUST be unique within their product
  (`UNIQUE(product_id, name)`) and option names unique within their group
  (`UNIQUE(option_group_id, name)`), so shoppers never face two visually
  identical choices and future writes stay idempotent.
- **FR-004**: For `single` groups the maximum MUST NOT exceed one pick
  (`max_selections IS NULL OR max_selections <= 1`) and `min_selections`
  MUST NOT exceed 1; violations MUST be rejected by the database.
- **FR-005**: Options MUST carry `price_delta` (numeric, default 0) as the
  ONLY price field — no full prices on options; zero and positive deltas are
  normal, negatives are permitted only as legitimate business cases (e.g.
  ingredient removal).
- **FR-006**: `products.price` MUST remain the base price; products MUST NOT
  be converted into variants; pricing formula MUST be base + sum of selected
  deltas, times quantity, computed by the application (no cart-total triggers).
- **FR-007**: Anonymous reads MUST return only active groups/options
  belonging to active products; anonymous INSERT/UPDATE/DELETE on both tables
  MUST be rejected.
- **FR-008**: Choice management (all writes) MUST be restricted to managers
  in `admin_profiles` through the existing database-side authorization
  pattern; no other authenticated user may manage choices; no service-role
  key may reach the frontend.
- **FR-009**: Both tables MUST reuse the existing `updated_at` trigger
  function and MUST be covered by `(product_id/group, is_active, sort_order)`
  indexes plus FK-supporting indexes where not automatic.
- **FR-010**: The data-access layer MUST return a product together with its
  active groups and active options in defined order, and listings MUST expose
  whether a product has active options without N+1 reads.
- **FR-011**: Groups and options MUST use stable UUIDs suitable for future
  cart-item references (group id/name + option id/name/delta snapshot).
- **FR-012**: This phase MUST NOT ship any UI (no admin, editor, selection,
  cart, or checkout changes) and MUST NOT create cart/order/customer tables;
  the cart MUST remain client-side.
- **FR-013**: Verification MUST use live database queries (tables, FKs,
  constraints, indexes, RLS allow/deny, cascades on test rows, representative
  SELECTs, advisors) with findings fixed; no fake production data may remain
  afterwards.
- **FR-013a**: Schema verification MUST use temporary rows that are deleted
  afterwards; no demo option groups may persist on real products.
- **FR-014**: The model MUST represent size/flavor/add-on and future option
  kinds (bread type, doneness, drink choice, …) with zero schema changes and
  zero hard-coded option names anywhere.

### Key Entities

- **Product Option Group**: A named choice set on one product (behavior
  `single` | `multiple`, min/max selection rules, display order, active
  flag); owns options; deleted with its product.
- **Product Option**: One pickable choice (name, price addition defaulting to
  0, display order, active flag); belongs to exactly one group; deleted with
  its group.
- **Configured Product (extended view, not a new table)**: A product plus its
  active groups in order, each with its active options in order; empty for
  plain products.
- **Cart Selection Snapshot (future, client-side only)**: group id/name +
  option id/name/delta captured in the local cart item; priced live at
  checkout from base + deltas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A product configured with 3 groups and 8 options round-trips
  in one read with correct ordering, while an option-less product returns an
  unchanged shape with an empty option list.
- **SC-002**: 100% of invalid configurations (single with max 2, min above
  max, negative min, unknown type) are rejected by the database, and all four
  documented valid shapes are accepted.
- **SC-003**: 100% of anonymous write attempts on the new tables are rejected
  and anonymous reads never include inactive groups/options or options of
  inactive products.
- **SC-004**: The documented price example (base 100 + 30 + 15 + 0) computes
  to exactly 145 through live data, and cascade deletes remove only the
  intended subtree.
- **SC-005**: Zero UI screens changed or added, zero order-related tables
  created, all pre-existing catalog rows byte-identical, and no fake
  production options remain.
- **SC-006**: Listings report option availability for 50 products with a
  constant number of reads (no per-product extra query).

## Assumptions

- The live `nahla_app` catalog from the prior phase (5 tables, RLS with
  `is_admin()`, shared `updated_at` trigger, `nahla-images` bucket) is the
  untouched baseline; its patterns are reused verbatim.
- Shopper flows stay anonymous; the only writers are future managers (no
  manager accounts are created now).
- Scale stays small (hundreds of products, a handful of groups each), so
  indexed relational reads need no caching layer.
- The WhatsApp-number env configuration and local-cart architecture from the
  prior phase are unchanged.
- Selection UI, cart/checkout integration, and the admin dashboard arrive in
  later phases against the stable UUIDs and access functions built here.
