# Feature Specification: Product Option Images

**Feature Branch**: `005-option-images`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "create a specification for i want to create and all details in this file: @src/mds/option-images.md"

**Source details**: `src/mds/option-images.md` — let individual product options
carry their own image so the product page shows the selected option's photo,
with picker thumbnails and dashboard upload controls. No pricing, cart, RLS,
or design changes beyond the specified image behaviors.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shopper sees the selected option's photo (Priority: P1)

A shopper configuring a product (e.g. picking the "large" size) sees the main
product photo switch to that option's own photo; changing or removing the
choice updates the photo by a fixed priority (most recent imaged selection,
then earlier ones, then the product's own photo), all without layout jumps.

**Why this priority**: This is the entire user-visible value — a shopper
seeing what each choice looks like before paying.

**Independent Test**: On a product with imaged options in two groups, select
across groups and confirm the most recent imaged pick shows; deselect back
down the stack and confirm each fallback; with nothing selected confirm the
base photo.

**Acceptance Scenarios**:

1. **Given** an option with its own image, **When** a shopper selects it,
   **Then** the main photo switches to that image with no layout shift.
2. **Given** two imaged selections in different groups, **When** both are
   picked, **Then** the most recently picked one shows.
3. **Given** the imaged selection is removed, **When** it is deselected,
   **Then** the photo falls back down the recency stack to the base photo.
4. **Given** an option without an image, **When** selected, **Then** the
   currently shown photo does not change and layout does not move.

---

### User Story 2 - Shopper previews choices in the picker (Priority: P2)

A shopper browsing an option group sees a small thumbnail next to each option
that has a photo, helping the choice itself; options without photos look
exactly as today, and thumbnails never affect selection or price.

**Why this priority**: Thumbnails aid the decision at the point of choice;
without them shoppers must select blindly to see photos.

**Independent Test**: Open a group mixing imaged and imageless options and
confirm thumbnails appear only beside imaged ones, load lazily, and tapping
any option still toggles selection and price exactly as before.

**Acceptance Scenarios**:

1. **Given** options with and without photos, **When** the picker renders,
   **Then** only imaged options show thumbnails.
2. **Given** any thumbnail, **When** tapped as part of its option, **Then**
   selection and price behave identically to the text-only version.

---

### User Story 3 - Manager attaches photos to options (Priority: P2)

A manager editing options uploads a photo per option (previewed with a remove
action, failed uploads blocking the save with retry), while group editing,
limits, deltas, and the price preview work exactly as before.

**Why this priority**: Without manageable uploads the feature has no content
pipeline and dies on arrival.

**Independent Test**: Upload, preview, remove, and re-upload an option photo;
confirm the customer page reflects each state; confirm failed uploads block
saves with retry and never store broken references.

**Acceptance Scenarios**:

1. **Given** the option editor, **When** a photo is uploaded, **Then** it
   previews beside the option with a working remove action.
2. **Given** a failed upload, **When** it occurs, **Then** the save is
   blocked with a retry option and no broken reference is stored.
3. **Given** the rest of the product editor, **When** used, **Then** groups,
   limits, deltas, and the price preview behave exactly as before.

---

### User Story 4 - Option photos stay secure and weightless (Priority: P2)

Visitors see option photos only under the existing active-only rules and can
never modify them; photos lazy-load at sensible sizes with meaningful
alternatives; the cart, totals, and order message are byte-identical to
before.

**Why this priority**: Photos must not leak unpublished content, slow the
page, exclude assistive-technology users, or corrupt money flows.

**Independent Test**: As anonymous, verify photo visibility follows
active-only rules and writes are rejected; verify lazy loading, alt text,
no layout shift, cart totals unchanged, and zero leftover test rows.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor, **When** reading options, **Then** photos
   appear only for active options of active products.
2. **Given** an anonymous write attempt on photos, **When** tried, **Then**
   it is rejected.
3. **Given** the cart and order message, **When** compared before and after,
   **Then** images shown and all amounts are identical.

---

### Edge Cases

- What happens when an option image file is deleted from storage but the row
  still references it? → The display falls back as if no image (broken
  images never render; the admin preview surfaces the problem).
- What happens when two groups each hold an imaged selection and one group
  is deactivated? → Its options leave the stack; the newest remaining imaged
  selection shows.
- What happens on slow networks? → The main container keeps its aspect and
  previous photo until the new one loads (no flashing placeholders).
- What happens when test images/rows are created for verification? → Removed
  afterwards with zero residue.
- What happens with reduced-motion settings? → Image swaps apply instantly
  with no transition.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST add exactly one nullable column,
  `product_options.image_url` (NULL = no dedicated image), via a new
  migration and MUST NOT alter any other table, policy, or helper.
- **FR-002**: Option images MUST live in the existing `nahla-images` bucket
  under a new `options/` prefix with the existing admin-gated writes; no
  new buckets, tables, or RLS policies.
- **FR-003**: The product page MUST resolve one main image by recency
  priority (newest imaged selection → earlier imaged selections → product
  base chain, unchanged) for both single-tap swaps and multiple-group
  stacks with pop-on-deselect.
- **FR-004**: Option buttons MUST show lazy-loaded thumbnails only for
  options that have images; thumbnails MUST NOT affect selection or price.
- **FR-005**: Cart lines MUST always show the product base chain and cart
  totals plus the order message MUST remain exactly as before.
- **FR-006**: The option editor MUST gain upload (upload-then-save with
  retry), preview, and remove controls and MUST NOT change group editing,
  limits, deltas, or the price preview, nor add any page.
- **FR-007**: The data layer MUST expose `image_url` on options inside the
  existing ordered tree at no extra query cost; listings and the options
  flag MUST stay unchanged.
- **FR-008**: Images MUST lazy-load at reasonable sizes, carry the option
  name as alternative text with decorative wrappers hidden, hold layout in
  a fixed-aspect container, and honor reduced-motion settings.
- **FR-009**: Verification MUST use live queries and renders (column
  nullability, swap/pop/fallback, recency across groups, thumbnail
  presence, cart/message sameness, active-only visibility, write rejection,
  zero residue, clean type check) with findings fixed.

### Key Entities

- **Product Option Image**: An optional photo on one option (nullable
  reference, storage prefix `options/`); displayed by recency priority,
  never priced, never required.
- **Recency Stack (client-side only)**: The ordered history of imaged
  selections driving the main photo; popped on deselect, rebuilt from the
  base chain when empty.
- **Picker Thumbnail (presentational)**: The small lazy-loaded rendering of
  an option's photo inside its button; no state, no pricing effect.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper swapping between imaged options sees the correct
  photo within one interaction with zero layout shift, and deselecting
  restores the exact prior photo down to the base image.
- **SC-002**: Mixed imaged/imageless groups show thumbnails only beside
  imaged options, and selection plus pricing behave identically with and
  without photos.
- **SC-003**: A manager uploads, previews, removes, and re-uploads an
  option photo with each customer state reflected and failed uploads never
  storing broken references.
- **SC-004**: Anonymous reads obey active-only photo visibility with writes
  rejected, cart totals and order messages are unchanged values, and zero
  test rows or files remain.
- **SC-005**: Type check passes with zero errors and the schemadiff shows
  exactly one added nullable column.

## Assumptions

- The live options foundation (tables, RLS with `is_admin()`, trigger,
  DAL tree, editor, selection UI) from prior phases is the untouched
  baseline; only additive changes ship.
- One small photo per option is sufficient; no galleries, zoom viewers, or
  video are in scope.
- Upload guidance (~200KB per thumbnail) is advisory copy, not an enforced
  limit.
- Shoppers use image-capable browsers on typical mobile connections, so
  lazy loading plus aspect-held containers suffice for stability.
- The admin dashboard editor from the prior phase hosts the upload control;
  no new admin pages are needed.
