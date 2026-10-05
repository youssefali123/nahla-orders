# Feature Specification: Admin Dashboard

**Feature Branch**: `003-admin-dashboard`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "create a specification for i want to create and all details in this file: @src/mds/dashboard.md"

**Source details**: `src/mds/dashboard.md` — design and build the Arabic-first,
RTL-correct admin dashboard for managing the live Nahla catalog (categories,
subcategories, products with option groups/options, banners) on the existing
Supabase schema and RLS foundation. The customer website, cart, checkout, and
WhatsApp flows must remain untouched.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authorized manager signs in and is kept out otherwise (Priority: P1)

An authorized store manager opens the dashboard, signs in with their admin
credentials, and manages the catalog; anyone else (visitor, shopper, or
signed-in non-manager) is blocked from every dashboard screen and every
management operation. The very first manager account is created out-of-band
(documented manual step), never through public self-registration.

**Why this priority**: Nothing else is safe to expose without the gate; a
leaked dashboard would let anyone rewrite prices and the homepage.

**Independent Test**: Sign in as a registered manager and reach the dashboard;
as anonymous and as a non-manager, attempt every dashboard route and write
operation and confirm all are blocked; confirm no public path creates a
manager.

**Acceptance Scenarios**:

1. **Given** a registered manager's credentials, **When** they sign in,
   **Then** they reach the dashboard home and stay signed in across reloads
   until they sign out.
2. **Given** an anonymous visitor, **When** they open any dashboard route,
   **Then** they are redirected to the sign-in screen with no catalog data
   exposed.
3. **Given** a signed-in non-manager, **When** they open the dashboard or
   attempt any write, **Then** access is denied and no write succeeds.
4. **Given** the sign-in screen, **When** inspected, **Then** it offers no
   path to self-register as a manager.

---

### User Story 2 - Manager maintains categories and subcategories (Priority: P1)

A manager browses a searchable category list (name, image, type, order,
status), creates/edits/deactivates/deletes categories through a clean form,
and manages subcategories filtered by parent (with preorder flag and ordering
controls), with confirmations on destructive actions and toasts on every
result.

**Why this priority**: Categories structure the entire storefront; without
them no other management task is meaningful.

**Independent Test**: Create, rename, reorder, deactivate, and delete a test
category and subcategory; confirm each change appears on the customer website
according to active flags, and confirm deletes cascade exactly as the
database defines.

**Acceptance Scenarios**:

1. **Given** the categories list, **When** viewed, **Then** each row shows
   image preview, name, type, order, and status with edit, activate/deactivate,
   and delete actions.
2. **Given** a delete action on a category with children, **When** confirmed,
   **Then** the dialog states the cascade impact truthfully and the database
   behavior matches it.
3. **Given** the subcategories list, **When** filtered by a parent, **Then**
   only its children show with the parent relationship visually obvious, and
   the preorder control reads and writes the stored flag.
4. **Given** any mutation, **When** it succeeds or fails, **Then** a toast
   confirms the outcome in Arabic and the list reflects the new state.

---

### User Story 3 - Manager maintains products with options and deltas (Priority: P1)

A manager searches/filters the product table (image, name, category,
subcategory, price, options presence, status), creates/edits products
(base price clearly separated from option additions), and edits nested option
groups (single/multiple, required/optional, min/max with guided limits) and
their options (name, visible price addition, status, order), with a live price
composition preview (e.g. 100 + 30 + 15 = 145) and duplicate-name feedback.

**Why this priority**: Products and their prices are the revenue core; option
misconfiguration here directly corrupts what shoppers pay.

**Independent Test**: Create a product with a required single group and a
capped multiple group, set deltas, and confirm the customer product page
offers exactly those choices with the previewed total; attempt duplicates and
invalid limits and confirm clear rejections.

**Acceptance Scenarios**:

1. **Given** the product editor, **When** viewed, **Then** base price and
   option additions are visually distinct sections, never confused.
2. **Given** a single-type group, **When** edited, **Then** the form guides
   the maximum toward 1 with helper text, and invalid limits are rejected
   with inline errors.
3. **Given** options with additions, **When** listed, **Then** each shows its
   effect explicitly (e.g. `+15 جنيه`, `+0 جنيه`), never hidden.
4. **Given** a configured product saved, **When** the price preview is shown,
   **Then** it composes base + selected additions exactly as the customer
   experience will charge.
5. **Given** a duplicate option name in one group, **When** saved, **Then**
   the admin is told the name is already used in that group.

---

### User Story 4 - Manager maintains banners and sees a truthful home (Priority: P2)

A manager manages banners visually (image preview/upload, title, link target,
status, ordering) and lands on a dashboard home showing only real counts
(active categories/products/banners, configurable products) plus catalog
shortcuts — never fake revenue, orders, customers, charts, or activity.

**Why this priority**: Banners drive the homepage; the home screen must stay
honest while giving fast access to daily tasks.

**Independent Test**: Create/reorder/deactivate a banner and confirm the
customer homepage reflects exactly that; confirm every home-screen number
matches a live database count.

**Acceptance Scenarios**:

1. **Given** the banners screen, **When** viewed, **Then** each banner shows
   its image, title, resolved link target, status, and order with edit and
   delete actions.
2. **Given** an uploaded banner image, **When** saved, **Then** it is stored
   in managed storage and served to shoppers without exposing secrets.
3. **Given** the dashboard home, **When** viewed, **Then** all numbers equal
   live counts and shortcuts jump to the right creation screens.

---

### User Story 5 - Dashboard is usable by everyone, everywhere (Priority: P2)

A manager works from desktop, tablet, or a 320px phone, entirely by keyboard
if needed, with genuine RTL layout throughout, skeleton loading states,
intentional empty states, confirmation dialogs, and subtle motion — while the
customer website keeps working identically.

**Why this priority**: An internal tool that only works on one screen size or
pointer excludes real-world use (e.g. updating prices from a phone in the
store).

**Independent Test**: Exercise core flows at 320/375/768/1024/1440px widths
with keyboard only; confirm no horizontal overflow, no blank screens, visible
focus, and that all customer routes still return successfully.

**Acceptance Scenarios**:

1. **Given** any dashboard table on a phone, **When** viewed, **Then** rows
   become cards/stacks with no overflow, reachable actions, and visible
   primary buttons.
2. **Given** any data load, **When** pending, **Then** a skeleton or indicator
   shows (never a blank screen); empty results show guidance plus a creation
   shortcut.
3. **Given** keyboard-only use, **When** tabbing, **Then** focus is visible,
   dialogs trap and label correctly, and state is never conveyed by color
   alone.
4. **Given** the customer website during and after dashboard work, **When**
   its routes are checked, **Then** all return successfully with unchanged
   behavior.

---

### Edge Cases

- What happens when two managers edit the same record? → Last write wins;
  the form warns when the record changed underneath (stale-data notice) where
  practical, never silent overwrites without refresh.
- What happens when the session expires mid-edit? → The manager is returned
  to sign-in with their draft preserved where practical, never silently
  logged out losing work without notice.
- What happens when an image upload fails? → Inline error with retry; the
  record is not saved pointing at a missing image.
- What happens when a category needed by products is deleted? → The
  confirmation states the cascade (subcategories/products/options removed)
  and the customer site immediately stops listing them.
- What happens when option limits are tightened below existing usage? →
  Saved (future selections obey it); already-saved cart snapshots are
  unaffected (carts are client-side history).
- What happens when the backend is unreachable? → Arabic error states with
  retry; mutations stay disabled while failing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST live under an isolated route family (e.g.
  `/admin`) reusing the existing app shell conventions but MUST NOT alter any
  customer route, component, cart, checkout, or WhatsApp behavior.
- **FR-002**: Sign-in MUST use the project's authentication with
  email/password for managers; sessions MUST persist across reloads; sign-out
  MUST end the session; NO self-registration path to manager may exist.
- **FR-003**: Every dashboard route and every management write MUST verify
  manager status database-side (existing `admin_profiles` pattern); shoppers
  and non-managers MUST be denied reads and writes alike.
- **FR-004**: The first manager MUST be provisioned by a documented manual
  database step (no UI, no seed managers, no default credentials).
- **FR-005**: Categories MUST support searchable listing with image, type,
  order, status, and create/edit/activate/deactivate/delete with truthful
  cascade confirmations.
- **FR-006**: Subcategories MUST support parent filtering, search, status,
  preorder control bound to the stored flag, ordering, and image handling
  with the parent relationship visually obvious.
- **FR-007**: Products MUST support search plus category/subcategory/status
  filters, image/status/order display, options-presence column, and full
  create/edit with base price visually separated from option additions.
- **FR-008**: Option groups MUST be editable nested in the product flow
  (name, single/multiple with guided limits and helper text, min/max,
  status), with single capped at one pick and invalid limits rejected inline.
- **FR-009**: Options MUST expose name, price addition (always visible,
  formatted like `+15 جنيه`), status, and order; duplicates per parent MUST
  be rejected with the specified Arabic message.
- **FR-010**: A live price-composition preview MUST aid the manager
  (base + additions = total) as a display-only helper that cannot diverge
  from backend pricing.
- **FR-011**: Banners MUST support visual management (preview, upload,
  title, link target, status, ordering) with images in managed storage and
  no exposed secrets.
- **FR-012**: The dashboard home MUST show only live counts (active
  categories/products/banners, configurable products) plus creation
  shortcuts; fake revenue/orders/customers/charts/activity MUST NOT exist.
- **FR-013**: Every mutation MUST give Arabic toast feedback (success, error
  with retry guidance, duplicate-name message verbatim); destructive actions
  MUST require confirmation dialogs stating real impact.
- **FR-014**: All screens MUST implement skeleton loading, intentional empty
  states with creation shortcuts, and inline form validation with required
  indicators — never blank screens.
- **FR-015**: The full interface MUST be RTL-genuine (sidebar, tables, forms,
  dialogs, pagination, numbers/prices), responsive (320–1440px, drawer-based
  mobile nav, card-ified tables), keyboard-accessible with visible focus and
  non-color state cues, and subtly animated.
- **FR-016**: A reusable visual system MUST back the dashboard (color,
  spacing, radius, shadow, typography, border, control-height tokens reusing
  the brand greens/yellow/teal roles and the existing Arabic font), built
  from shared components (shell, sidebar, header, table/card, search,
  filters, badges, dialogs, form sections, uploader, option editors) reusing
  the existing UI library where suitable.
- **FR-017**: The database schema, RLS posture, and Supabase usage MUST NOT
  weaken: no recreated tables, no new backend entities, no relaxed policies,
  no service-role exposure, no fake analytics data.
- **FR-018**: The implementation MUST be verified live: type check and
  production build pass; sign-in gate proven for all three actor types;
  every CRUD list verified against the customer site; uploads, deltas,
  rules, confirmations, RLS intactness, mobile/desktop layouts, overflow,
  RTL, and zero console errors all confirmed.

### Key Entities

- **Manager Session**: An authenticated session whose user row exists in
  `admin_profiles` with an admin role; the sole key to dashboard routes and
  writes; created out-of-band, ended by sign-out or expiry.
- **Managed Category / Subcategory / Product / Option Group / Option /
  Banner**: The existing catalog rows, manipulated through dashboard forms
  with identical fields, rules, and cascade behavior as the database
  defines — no parallel model.
- **Dashboard Home Metrics**: Live counts only (active categories, products,
  banners, configurable products) plus navigation shortcuts; explicitly not
  a reporting/analytics entity.
- **Design System Tokens & Shared Components**: Brand roles, reusable
  shell/table/form/dialog/uploader/editor components; the consistency
  backbone, not business data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A manager signs in and completes a full catalog task (create
  category → subcategory → product with options → banner) in one session
  with every change visible on the customer site within a minute.
- **SC-002**: 100% of anonymous and non-manager route visits and write
  attempts are blocked, and no self-registration path to manager exists
  anywhere in the interface.
- **SC-003**: A product configured with a required single group and a capped
  multiple group saves with correct deltas, and its customer page offers
  exactly those choices totaling the previewed amount.
- **SC-004**: Every dashboard number matches its live database count at all
  times, with zero fabricated metrics anywhere in the interface.
- **SC-005**: Core flows complete at 320px and 1440px widths by keyboard
  alone, with zero horizontal overflow, zero blank screens, and zero console
  errors.
- **SC-006**: Type check and production build pass, and all customer routes
  return successfully with behavior identical to before the dashboard work.

## Assumptions

- Manager sign-in uses Supabase email/password (standard pattern; the
  brief's account/logout navigation implies session auth, and no other
  method is specified).
- The first manager is bootstrapped by a documented manual insert into
  `admin_profiles` for an existing auth user; the team performing setup
  holds database access (same assumption as prior phases).
- The existing RLS model (public active-read, `is_admin()` writes) already
  permits everything the dashboard needs — no schema or policy changes are
  expected, only read/write through them with an admin session.
- Image uploads reuse the `nahla-images` bucket and its admin-gated write
  policies with the signed-in manager's session.
- Arabic (Cairo or current project font) is the dashboard language with
  genuine RTL; no English-first or LTR fallback screens.
- Catalog scale stays small, so table pagination/filtering needs no
  virtualization or caching layer.
- The customer website, cart, checkout, and WhatsApp flows are frozen
  scope-wise; any shared-component change must leave them pixel- and
  behavior-identical.
