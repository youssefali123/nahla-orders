# Feature Specification: Delivery Zones

**Feature Branch**: `004-delivery-zones`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "add delivery zones in the database, each with a name and a fee (delivery price); shoppers see available zones at checkout and pick one; admin can add/edit/delete zones"

## Clarifications

### Session 2026-10-03

- Q: When the zone picker is added, should the free-text address field stay alongside it? → A: Keep both (zone sets the fee area, address keeps street/building details).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shopper picks a delivery zone at checkout (Priority: P1)

A shopper finishing an order sees the available delivery zones (each with its
name and delivery fee), picks one, and sees the grand total (items + delivery
fee) before confirming. The choice is remembered for next time, and the sent
order message states the zone, its fee, and the grand total.

**Why this priority**: Delivery fees change what the shopper pays — without
this the order total is wrong and the courier doesn't know the zone price.

**Independent Test**: With two active zones of different fees, complete
checkout on each and confirm the message shows the right zone, fee, and grand
total; reload and confirm the last zone is preselected.

**Acceptance Scenarios**:

1. **Given** active zones exist, **When** a shopper reaches checkout, **Then**
   the zones list with names and fees, the first one preselected, and the
   total includes its fee.
2. **Given** a zone is picked, **When** confirmed, **Then** the order message
   shows items total, zone name, delivery fee, and grand total as separate
   lines.
3. **Given** a previous order, **When** reopening checkout, **Then** the last
   used zone is preselected when still active.
4. **Given** no active zones exist, **When** a shopper reaches checkout,
   **Then** a clear state explains delivery is currently unavailable instead
   of a silently fee-less order.

---

### User Story 2 - Manager maintains delivery zones (Priority: P2)

A manager opens a zones screen, sees all zones (name, fee, order, status),
and adds/edits/deactivates/deletes them with confirmations and Arabic
feedback; shoppers immediately see the effect per active flags.

**Why this priority**: Zone prices change with fuel/areas — the manager must
own them without developer help.

**Independent Test**: Create, rename, reprice, reorder, deactivate, and delete
a test zone; confirm checkout reflects each change and deletion never
orphans anything (zones are referenced by name snapshot in messages only).

**Acceptance Scenarios**:

1. **Given** the zones list, **When** viewed, **Then** each row shows name,
   fee formatted in جنيه, order, and status with edit, toggle, and delete
   actions.
2. **Given** a zone edit, **When** saved, **Then** checkout shows the new
   name/fee on next load and past order messages are untouched.
3. **Given** a zone delete, **When** confirmed, **Then** it disappears with
   no dangling references (selections are validated live at checkout).
4. **Given** any mutation, **When** done, **Then** an Arabic toast confirms
   and the list refreshes.

---

### User Story 3 - Zone data stays secure and consistent (Priority: P2)

Visitors read only active zones and never modify them; only managers manage
them; fees are never negative; the customer site and admin share the same
source of truth.

**Why this priority**: Delivery fees are money — integrity and access control
are non-negotiable.

**Independent Test**: As anonymous, verify active-only reads and rejected
writes; attempt negative/blank fees and confirm rejection; confirm the admin
screen and checkout read identical data.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor, **When** reading zones, **Then** only
   active zones in defined order are visible.
2. **Given** an anonymous write attempt, **When** tried, **Then** it is
   rejected; non-managers gain nothing.
3. **Given** a zero fee, **When** saved, **Then** it is accepted and shown
   as free delivery; a negative fee is rejected.

---

### Edge Cases

- What happens when the last active zone is deactivated mid-checkout? → The
  zone list refreshes on submit validation; if none remain, confirm is
  blocked with an explanatory message.
- What happens when a stored zone id no longer exists? → Falls back to the
  first active zone (or the unavailable state when none exist).
- What happens when the fee changes between cart and confirm? → The confirm
  step re-reads live zones (same rule as prices) and totals update.
- What happens when a zone name duplicates another? → Rejected with a clear
  message (names unique).
- What happens when the backend is unreachable at checkout? → Arabic error
  with retry; confirm stays disabled until zones load.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST add exactly one table, `delivery_zones`, and
  MUST NOT alter existing tables: `id` UUID PK, `name` TEXT NOT NULL UNIQUE,
  `fee NUMERIC(10,2)` NOT NULL DEFAULT 0 CHECK `>= 0`, `sort_order`,
  `is_active`, stamps with the reused `updated_at` trigger.
- **FR-002**: Anonymous reads MUST return only active zones ordered by
  `sort_order`; anonymous writes MUST be rejected; management writes MUST be
  restricted to `admin_profiles` managers via the existing `is_admin()`
  pattern; no service-role exposure.
- **FR-003**: Checkout MUST list active zones (name + fee) with the stored
  zone preselected when still active, else the first active zone; confirm
  MUST be blocked when zero active zones exist, with an explanatory message.
- **FR-003a**: The free-text address field MUST stay alongside the zone
  picker: the zone determines the delivery fee area while the address keeps
  street/building details; both are required at confirm time.
- **FR-004**: Totals MUST be items total + selected zone fee; the order
  message MUST carry items total, zone name, delivery fee, and grand total
  as separate lines; a zero fee MUST display as free delivery.
- **FR-005**: The selected zone id MUST persist on-device and prefill next
  checkout; stale ids MUST fall back gracefully per the edge cases.
- **FR-006**: The dashboard MUST provide a zones screen (new navigation
  section for delivery) with searchable listing and full create/edit/toggle/
  delete with cascade-free confirmations and Arabic toasts; home metrics
  stay live-counts-only (zones count may join them).
- **FR-007**: The confirm step MUST re-read live zones before sending
  (never trust stored fees), updating totals or blocking with explanation.
- **FR-008**: Verification MUST use live queries (table, constraints,
  indexes, RLS allow/deny, invalid-fee rejections, checkout + message
  proofs, advisors) with zero residue and no fake zones remaining.

### Key Entities

- **Delivery Zone**: A deliverable area (name unique, delivery fee ≥ 0 with
  0 = free, display order, active flag); referenced by live id at checkout,
  snapshotted by name+fee into the sent order message.
- **Order Totals (computed, never stored)**: items total + selected zone fee
  = grand total; recomputed live at confirm time.
- **Stored Zone Choice (client-side only)**: last used zone id on the
  device; fallback chain: stored → first active → unavailable state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper completes checkout with each of two differently
  priced zones and both order messages show the correct zone, fee, and grand
  total.
- **SC-002**: A manager creates, renames, reprices, reorders, deactivates,
  and deletes a test zone with every change reflected at checkout and zero
  residue afterwards.
- **SC-003**: 100% of anonymous zone writes are rejected, reads never
  include inactive zones, and negative/duplicate fees are rejected by the
  database.
- **SC-004**: Reopening checkout preselects the last used zone, and a
  mid-checkout deactivation blocks confirm with explanation instead of a
  wrong total.
- **SC-005**: Type check and production build pass with zero new console
  errors and unchanged behavior everywhere except checkout totals and the
  new admin screen.

## Assumptions

- One zone per order (no multi-zone carts); fee is flat per zone regardless
  of items, weight, or distance.
- Currency and formatting follow the existing جنيه conventions.
- The existing RLS helper, trigger, storage patterns, and admin shell are
  reused verbatim; one composite index covers the public listing query.
- Free delivery is expressed as fee 0, never null.
- Selection UI, admin screen, and message lines stay Arabic-first RTL per
  the established design language.
