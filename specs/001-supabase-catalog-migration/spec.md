# Feature Specification: Supabase Catalog Migration

**Feature Branch**: `001-supabase-catalog-migration`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "create a specification for i want to create and all details in this file: @src/mds/db-setup.md"

**Source details**: `src/mds/db-setup.md` — migrate the Nahla Arabic RTL food/grocery
delivery website from a hard-coded static catalog (`src/data/catalog.ts`) to a
Supabase-backed catalog system, without building the admin dashboard and without
changing the existing UI or the local cart / WhatsApp checkout flow.

## Clarifications

### Session 2026-10-03

- Q: How should the homepage "most-ordered" section choose products given no order history is stored? → A: Add is_featured flag.
- Q: How should product visuals be represented given products use emoji icons with no photo assets? → A: Keep emoji + image.
- Q: What should a banner with a custom destination do when tapped? → A: Open external URL.
- Q: Should categories/subcategories keep emoji icons given the schema only has image_url? → A: Add icon columns.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shopper sees a live homepage catalog (Priority: P1)

A shopper opens the Nahla homepage and sees the store sections (ماركت، مطاعم،
خضار وفاكهة، عيش ومعجنات، طلب مخصص) and promotional banners, all loaded from
the central catalog instead of fixed content baked into the website. When the
store assortment changes (e.g. a section is deactivated), the homepage reflects
it without a website redeploy.

**Why this priority**: The homepage is the entry point of every shopping
session; if it does not load live data, the whole migration delivers no value.

**Independent Test**: Seed the catalog with a known set of active/inactive
categories and banners, open the homepage, and confirm exactly the active ones
appear in the defined order. Deactivate one category in the catalog and confirm
it disappears after refresh.

**Acceptance Scenarios**:

1. **Given** active categories and banners exist in the catalog, **When** a
   shopper opens the homepage, **Then** all and only the active categories and
   banners are displayed in their defined order.
2. **Given** a category is marked inactive in the catalog, **When** a shopper
   opens the homepage, **Then** that category is not shown.
3. **Given** the catalog cannot be reached, **When** a shopper opens the
   homepage, **Then** a friendly Arabic error message with a retry option is
   shown instead of a blank screen.

---

### User Story 2 - Shopper browses sections, products, and search (Priority: P2)

A shopper taps a section and either sees its subsections (e.g. ماركت → ألبان،
منظفات…) or its products directly when the section has no subsections; opens a
product for details and price; and searches by product name. All listings,
prices, descriptions, and images come from the catalog. Special behaviors are
data-driven: the custom-order section opens the custom request form, and a
subsection flagged for pre-order shows the "order a day ahead" notice.

**Why this priority**: Browsing and product discovery is the core shopping flow;
it must work end-to-end on live data before the static catalog can be retired.

**Independent Test**: For each category shape (with subcategories, without
subcategories, custom-order type, pre-order subsection), navigate the flow and
verify the correct page type, products, prices, and notices appear, matching the
catalog records.

**Acceptance Scenarios**:

1. **Given** a category with active subcategories, **When** a shopper opens it,
   **Then** the subcategories are listed (not hard-coded) and each leads to its
   products.
2. **Given** a category with no active subcategories, **When** a shopper opens
   it, **Then** its products are listed directly.
3. **Given** the custom-order category, **When** a shopper opens it, **Then**
   the custom request form opens (no product listing is expected).
4. **Given** a subsection flagged as requiring pre-order, **When** a shopper
   views it, **Then** the notice "طلبات الأكل البيتي يجب طلبها قبلها بيوم."
   is displayed.
5. **Given** a search query matching product names, **When** a shopper searches,
   **Then** matching available products from the catalog are returned.
6. **Given** a section with no available products, **When** a shopper opens it,
   **Then** the message "مفيش منتجات في القسم ده حالياً." is shown.

---

### User Story 3 - Shopper completes cart and WhatsApp order on live data (Priority: P1)

A shopper adds catalog products to the cart, adjusts quantities, enters delivery
details, and confirms — the order is sent via WhatsApp with current catalog
names and prices. The cart stays on the device (survives reload), custom-order
texts stay local, and no order, customer, or payment records are stored
server-side.

**Why this priority**: Ordering is the revenue flow; the migration must not
break it, and prices in the WhatsApp message must match the live catalog.

**Independent Test**: Change a product price in the catalog, reload, add the
product to the cart, complete checkout, and verify the WhatsApp message shows
the new price. Confirm the cart persists across reload and that no order data
was stored server-side.

**Acceptance Scenarios**:

1. **Given** a shopper adds a catalog product to the cart, **When** the device
   reloads, **Then** the cart contents are preserved.
2. **Given** a product price changed in the catalog, **When** a shopper orders
   it, **Then** the cart and the WhatsApp message show the current catalog
   price.
3. **Given** a shopper writes a custom-order request, **When** it is added,
   **Then** it is kept only in the local cart and never stored server-side.
4. **Given** a shopper confirms checkout, **When** the order is sent, **Then**
   a WhatsApp order message opens and no order/customer/payment record is
   created server-side.

---

### User Story 4 - Catalog stays secure and ready for future management (Priority: P2)

The store owner needs the catalog readable by every visitor but changeable by
nobody except future authorized managers; catalog images served reliably; and
the authorization foundation for the future admin dashboard prepared now
(without building any admin UI or accounts).

**Why this priority**: A public catalog without read/write protection would
expose the business to defacement and data theft; the admin foundation must
exist before the later dashboard phase can use it.

**Independent Test**: As an anonymous visitor, verify all catalog reads return
only active records and every insert/update/delete attempt is rejected. Verify
catalog images load from managed storage. Verify no visitor can grant
themselves a manager role.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor, **When** reading categories, subcategories,
   products, or banners, **Then** only records marked active are returned.
2. **Given** an anonymous visitor, **When** attempting to insert, update, or
   delete any catalog record, **Then** the attempt is rejected.
3. **Given** an anonymous visitor, **When** attempting to read or modify the
   manager list, **Then** non-public entries stay hidden and modification is
   rejected.
4. **Given** a signed-in user who is not a registered manager, **When** acting
   on the catalog, **Then** they receive no management permissions.
5. **Given** catalog images, **When** a shopper views the website, **Then**
   images load from the managed image store.

---

### Edge Cases

- What happens when the catalog backend is unreachable or slow? → Arabic error
  message ("حصل خطأ، حاول تاني.") with retry; never a blank screen.
- What happens when a product saved in the local cart was deleted or
  deactivated in the catalog? → Cart shows it as unavailable; it is excluded
  from totals and the WhatsApp message.
- What happens when a category has subcategories but all are inactive? → The
  category behaves as having no subcategories (product listing or empty-state
  message).
- What happens when a product image is missing? → A placeholder is shown; the
  product remains orderable.
- What happens when seed/migration scripts run twice? → No duplicate categories
  or subcategories are created (idempotent seeds).
- What happens when a banner points to a deleted category/product? → The banner
  still displays; its link falls back to the homepage.
- What happens when required environment configuration is missing? → The
  website shows a clear Arabic error state instead of crashing silently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST serve categories, subcategories, products,
  prices, descriptions, images, and banners from the central catalog; the
  static catalog file MUST NOT remain the source of truth.
- **FR-002**: The system MUST distinguish the custom-order category by its
  stored type flag (`custom_order`), never by matching its name.
- **FR-003**: The system MUST decide category navigation dynamically: load
  active subcategories, show the subsection page when any exist, otherwise show
  the product listing.
- **FR-004**: The system MUST show the pre-order notice ("طلبات الأكل البيتي
  يجب طلبها قبلها بيوم.") based on the stored pre-order flag, never by matching
  the subsection name.
- **FR-005**: Anonymous visitors MUST be able to read only active catalog
  records (categories, subcategories, products, banners).
- **FR-006**: Anonymous visitors MUST NOT be able to insert, update, or delete
  any catalog record.
- **FR-007**: The system MUST provide a manager registry for future admin
  authorization; managers MUST be identified database-side, and no visitor may
  grant themselves a manager role through any public operation.
- **FR-008**: The system MUST serve catalog images from managed image storage
  organized in `categories/`, `subcategories/`, `products/`, and `banners/`
  folders; signing/secret credentials MUST NOT be exposed to the browser.
- **FR-008a**: Products MUST retain their current emoji icon alongside the
  optional photo; listings MUST show the photo when present and the
  emoji/placeholder otherwise, so no product loses its visual on migration.
- **FR-008b**: Categories and subcategories MUST likewise retain their emoji
  icon alongside the optional image, shown with the same photo-first fallback.
- **FR-009**: The system MUST seed the five initial categories (ماركت، مطاعم،
  خضار وفاكهة، عيش ومعجنات، طلب مخصص) with correct type flags, idempotently.
- **FR-010**: The system MUST seed ماركت subcategories (ألبان أجبان مخلل،
  منظفات، مشروبات وسناكس، قهوة شاي أعشاب) and مطاعم subcategories (مشاوي،
  فطائر وبيتزا، كشري وطواجن، أسماك، أكل بيتي), with أكل بيتي flagged for
  pre-order, idempotently.
- **FR-011**: The system MUST migrate usable existing static products and
  homepage banners into the catalog (preserving names, prices, descriptions,
  relationships, and ordering) and clearly mark placeholder/demo content as
  such; it MUST NOT silently invent products.
- **FR-011a**: Products MUST carry an `is_featured` flag (default false); the
  homepage "most-ordered" (الأكثر طلبًا) section MUST show active featured
  products, and static products marked featured MUST be migrated as featured.
- **FR-012**: The system MUST expose a typed, reusable data-access layer
  (active categories, subcategories by category, products by category and
  optional subcategory, single product, active banners, product search);
  presentation components MUST NOT embed direct backend queries.
- **FR-013**: Every dynamic catalog view MUST implement loading, error, and
  empty states using friendly Arabic messages ("حصل خطأ، حاول تاني.",
  "مفيش منتجات متاحة حالياً.", "مفيش منتجات في القسم ده حالياً.").
- **FR-014**: The system MUST keep the cart fully client-side (device-persisted
  across reloads) supporting product id, name, price, image, quantity, and
  custom-order items; it MUST NOT create a server-side cart.
- **FR-015**: The system MUST keep checkout local: no orders, customers,
  checkout, or payment records stored server-side; checkout MUST continue to
  produce the WhatsApp order with current catalog data; the WhatsApp number
  MUST remain environment-configurable.
- **FR-016**: The system MUST automatically refresh record modification
  timestamps on update for categories, subcategories, products, and banners.
- **FR-017**: The system MUST enforce data integrity: non-null names,
  non-negative prices, nullable product-to-subsection link (supporting both
  category→product and category→subsection→product shapes), cascading deletes
  from category to its records, and null-setting when a subsection is deleted.
- **FR-018**: The system MUST NOT build any admin UI (no `/admin` routes,
  login, or management screens) in this phase; MUST NOT create admin users
  automatically; MUST NOT treat every signed-in user as a manager.
- **FR-019**: The system MUST preserve the existing visual design and MUST
  only modify UI code where needed to switch data sources or add
  loading/error/empty states.
- **FR-020**: The system MUST apply catalog changes via reproducible,
  non-destructive migrations that never drop unrelated tables or destroy
  existing data.

### Key Entities

- **Category**: A top-level store section (name, emoji icon, optional image,
  display order, active flag, behavior type `normal` | `custom_order`); owns
  subcategories and products.
- **Subcategory**: A subdivision of a category (name, emoji icon, optional image,
  display order, active flag, pre-order flag); belongs to exactly one category;
  products may optionally belong to one.
- **Product**: A sellable item (name, price, emoji icon, optional photo, description,
  display order, active flag, featured flag for the homepage most-ordered
  section); belongs to a category and optionally to a subcategory of that
  category. The emoji icon is preserved from the current catalog; the photo is
  shown when present, otherwise the emoji/placeholder is shown.
- **Banner**: A homepage promotion (title, image, display order, active flag,
  link destination type `category` | `subcategory` | `product` | `custom` |
  `none`, an optional target record reference, and — for `custom` only — an
  external web address opened when the banner is tapped).
- **Admin Profile**: A future-manager registry entry (user reference, role);
  used only for database-side authorization, never exposed publicly.
- **Cart Item (client-side only, never stored server-side)**: product id, name,
  price, image, quantity, plus optional custom-order text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper opening the homepage sees exactly the active catalog
  categories and banners in catalog-defined order, with zero hard-coded entries.
- **SC-002**: 100% of displayed catalog content (listings, prices,
  descriptions, images, banners) matches current catalog records; changing a
  record is reflected on the website without redeploying it.
- **SC-003**: 100% of anonymous insert/update/delete attempts against catalog
  data are rejected, and anonymous reads never include inactive records.
- **SC-004**: Shoppers complete the full journey (browse → cart → WhatsApp
  order) at the same success rate as before the migration, with order messages
  showing current catalog prices.
- **SC-005**: Catalog content is visible within 3 seconds on a typical mobile
  connection, and every catalog view shows a proper loading, error (with retry),
  or empty state — zero blank screens.
- **SC-006**: No admin UI, orders storage, customer accounts, or online payment
  exists after this phase; cart and custom orders remain fully local.

## Assumptions

- The connected Supabase project (`nahla_app`) is reachable and the team holds
  credentials to apply schema/storage changes there.
- Frontend backend access uses the publishable/anonymous key via environment
  configuration; secret keys never ship to the browser.
- The existing static products and banner assets represent the intended current
  catalog and are suitable as seed/migration sources, with demo content
  explicitly labeled rather than presented as real inventory.
- The website audience is Arabic-speaking shoppers on mobile connections; all
  user-facing copy stays in Arabic with RTL layout.
- Shopper authentication is out of scope; the only authenticated role in this
  phase is the future manager (no manager accounts are created now).
- Catalog scale is small (tens of categories, hundreds of products), so
  standard indexed queries with active-flag filtering are sufficient.
- The admin dashboard arrives in a later phase and will reuse the manager
  registry, storage permissions, and RLS foundation built here.
