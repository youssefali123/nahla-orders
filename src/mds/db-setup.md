You are working inside the existing Nahla Arabic RTL food and grocery delivery website.

The project is already running locally.

The current frontend is mostly/static and uses hard-coded catalog data.

Your task in this phase is to transform the catalog/content architecture from static data into a real production-ready Supabase-backed system.

IMPORTANT:

DO NOT BUILD THE ADMIN DASHBOARD IN THIS PHASE.

The Admin Dashboard will be implemented in a later phase.

DO NOT redesign the existing UI.

DO NOT unnecessarily rewrite the existing visual components.

Your main goal is:

STATIC CATALOG
↓
SUPABASE DATABASE
↓
SUPABASE STORAGE
↓
RLS / SECURITY
↓
SUPABASE DATA ACCESS LAYER
↓
PUBLIC WEBSITE LOADS DYNAMIC DATA

The final result of this phase must be a working public website whose catalog comes from Supabase instead of hard-coded frontend data.

==================================================

1. FIRST INSPECT THE EXISTING PROJECT
   ==================================================

Before making changes, inspect the current project.

Identify:

* Current static catalog data
* Categories
* Subcategories
* Products
* Prices
* Images
* Banners
* Existing cart logic
* Existing WhatsApp logic
* Existing Supabase configuration
* Existing Supabase client
* Existing routes/components that consume static catalog data

Pay special attention to:

src/data/catalog.ts
src/lib/cart.tsx
src/lib/whatsapp.ts
src/routes/
src/components/
src/config/
src/styles.css

Do not remove useful existing functionality.

The existing UI should continue to work after the data source is changed.

==================================================
2. SUPABASE DATABASE
====================

Using the connected Supabase MCP, create the required database schema.

Create these tables:

categories
subcategories
products
banners
admin_profiles

Use UUID primary keys.

---

## TABLE: categories

Fields:

id UUID PRIMARY KEY
name TEXT NOT NULL
image_url TEXT
sort_order INTEGER DEFAULT 0
is_active BOOLEAN DEFAULT true
type TEXT DEFAULT 'normal'
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()

Allowed logical values for type:

normal
custom_order

Do not depend on category names to determine functionality.

The custom order category must be identified by:

type = 'custom_order'

Add appropriate constraints if practical.

---

## TABLE: subcategories

Fields:

id UUID PRIMARY KEY
category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE
name TEXT NOT NULL
image_url TEXT
sort_order INTEGER DEFAULT 0
is_active BOOLEAN DEFAULT true
requires_preorder BOOLEAN DEFAULT false
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()

---

## TABLE: products

Fields:

id UUID PRIMARY KEY
category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE
subcategory_id UUID NULL REFERENCES subcategories(id) ON DELETE SET NULL
name TEXT NOT NULL
price NUMERIC(10,2) NOT NULL
image_url TEXT
description TEXT
sort_order INTEGER DEFAULT 0
is_active BOOLEAN DEFAULT true
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()

subcategory_id MUST remain nullable.

This supports both:

Category → Product

and:

Category → Subcategory → Product

Add reasonable validation for price.

---

## TABLE: banners

Fields:

id UUID PRIMARY KEY
title TEXT
image_url TEXT NOT NULL
link_type TEXT
link_id UUID NULL
sort_order INTEGER DEFAULT 0
is_active BOOLEAN DEFAULT true
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()

link_type should support destinations such as:

category
subcategory
product
custom
none

Do not make the frontend dependent on hard-coded banner destinations.

---

## TABLE: admin_profiles

Fields:

id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
role TEXT NOT NULL DEFAULT 'admin'
created_at TIMESTAMPTZ DEFAULT now()

This table is only for future admin authorization.

Do NOT automatically create admin users.

Do NOT make every authenticated Supabase user an admin.

The dashboard will be implemented later.

==================================================
3. UPDATED_AT HANDLING
======================

Implement reliable updated_at behavior.

When a row is updated:

updated_at should automatically change.

Use a reusable PostgreSQL trigger/function if appropriate.

Apply it to:

categories
subcategories
products
banners

==================================================
4. DATABASE INDEXES
===================

Create useful indexes.

At minimum:

categories(is_active, sort_order)

subcategories(category_id, is_active, sort_order)

products(category_id, is_active, sort_order)

products(subcategory_id, is_active, sort_order)

banners(is_active, sort_order)

Also add other indexes only when justified by the application queries.

==================================================
5. DATA INTEGRITY
=================

Add appropriate database constraints.

Examples:

* Required names cannot be NULL.
* Product price cannot be negative.
* sort_order should have a sensible default.
* Foreign keys must be correct.
* subcategory_id must be nullable.
* Category deletion should cascade to its subcategories/products appropriately.
* Product subcategory deletion should SET NULL.
* Avoid invalid relationships where possible.

Do not over-engineer the schema.

==================================================
6. ROW LEVEL SECURITY
=====================

Enable RLS on:

categories
subcategories
products
banners
admin_profiles

Public anonymous users must be able to SELECT ONLY active catalog records.

Categories:

is_active = true

Subcategories:

is_active = true

Products:

is_active = true

Banners:

is_active = true

Public users MUST NOT be able to:

INSERT
UPDATE
DELETE

catalog records.

==================================================
7. ADMIN RLS FOUNDATION
=======================

Prepare the database for future admin dashboard access.

Only users who exist in:

admin_profiles

with:

role = 'admin'

should receive administrative database permissions.

Admins should eventually be able to:

SELECT
INSERT
UPDATE
DELETE

categories
subcategories
products
banners

Implement the RLS foundation now.

Do NOT build the dashboard.

Do NOT create admin UI.

Do NOT assume every authenticated user is an admin.

Use database-side authorization rather than client-side role checks.

If a helper function is useful for checking admin status, implement it securely.

Avoid recursive RLS policies.

==================================================
8. ADMIN_PROFILES SECURITY
==========================

Customers/public users must not be able to modify admin_profiles.

Do not expose role escalation through public INSERT/UPDATE policies.

The role must be controlled securely.

Do not create a public policy that allows a user to make themselves admin.

==================================================
9. SUPABASE STORAGE
===================

Create a Storage bucket:

nahla-images

Use logical folders:

categories/
subcategories/
products/
banners/

Configure storage securely.

Public website users need to be able to display active catalog images.

Future admins will need upload/update/delete permissions.

Do NOT expose service_role credentials.

Do NOT put service_role keys in frontend code.

Create appropriate Storage policies for the future admin workflow.

==================================================
10. SEED INITIAL CATEGORIES
===========================

Seed these initial categories:

1. ماركت
2. مطاعم
3. خضار وفاكهة
4. عيش ومعجنات
5. طلب مخصص

All should initially be:

is_active = true

The "طلب مخصص" category must use:

type = 'custom_order'

The others must use:

type = 'normal'

Use deterministic seed behavior where possible so rerunning the migration does not create duplicate records.

==================================================
11. SEED MARKET SUBCATEGORIES
=============================

Create under:

ماركت

These initial subcategories:

ألبان أجبان مخلل
منظفات
مشروبات وسناكس
قهوة شاي أعشاب

All:

is_active = true

requires_preorder = false

==================================================
12. SEED RESTAURANT SUBCATEGORIES
=================================

Create under:

مطاعم

These initial subcategories:

مشاوي
فطائر وبيتزا
كشري وطواجن
أسماك
أكل بيتي

All active.

For:

أكل بيتي

set:

requires_preorder = true

The frontend should later use this database field to display:

"طلبات الأكل البيتي يجب طلبها قبلها بيوم."

Do NOT make the frontend detect this using the Arabic name.

==================================================
13. PRODUCTS
============

Do NOT invent fake production products.

If the existing static project already contains actual/demo catalog products, inspect them.

If they are clearly intended as the current catalog/seed data, migrate them into Supabase.

Preserve:

* Product names
* Prices
* Descriptions
* Images where possible
* Category relationships
* Subcategory relationships
* Ordering

Do not silently invent products.

If static products contain placeholder/demo content, clearly identify them as seed/demo data rather than pretending they are real production inventory.

Prices must come from Supabase after migration.

==================================================
14. BANNERS
===========

Inspect the existing static banner assets.

If the project already contains banner assets intended for the Nahla homepage, migrate them into Supabase Storage under:

banners/

Create corresponding rows in:

banners

Preserve their intended ordering.

Only active banners should be returned publicly.

Do not hard-code banner records in the frontend.

==================================================
15. IMAGE MIGRATION
===================

Inspect existing assets.

Identify:

* Category images
* Subcategory images
* Product images
* Banner images

Where appropriate, upload them to:

Supabase Storage → nahla-images

Use:

categories/
subcategories/
products/
banners/

Then store the resulting usable image path/URL in the database.

Do not break existing image display.

If an asset cannot reasonably be migrated automatically, report it clearly rather than inventing a URL.

==================================================
16. SUPABASE DATA ACCESS LAYER
==============================

Create a clean data-access layer.

Do NOT scatter Supabase queries throughout UI components.

Create reusable functions such as:

getActiveCategories()

getActiveSubcategories(categoryId)

getActiveProducts(categoryId, subcategoryId?)

getProduct(productId)

getActiveBanners()

searchProducts(query)

Use appropriate TypeScript types.

Keep Supabase/database concerns separate from presentation components.

==================================================
17. PUBLIC CATALOG BEHAVIOR
===========================

Replace static catalog reads with Supabase reads.

The following must come from Supabase:

Categories
Subcategories
Products
Prices
Product descriptions
Product images
Banners

The public website should no longer depend on:

src/data/catalog.ts

for the primary catalog source.

You may keep the file temporarily if necessary for migration/reference, but it must not remain the source of truth.

Supabase becomes the source of truth.

==================================================
18. CATEGORY NAVIGATION
=======================

Do NOT hard-code category names.

Do NOT use:

if category === "ماركت"

or:

if category === "مطاعم"

to determine whether a category has subcategories.

Instead:

1. Load active subcategories for the category.
2. If active subcategories exist → show subcategory page.
3. If no active subcategories exist → show product listing.

The only special category behavior should come from:

categories.type

For:

type = 'custom_order'

open the custom-order functionality.

==================================================
19. HOME FOOD PREORDER
======================

Do not check:

subcategory.name === "أكل بيتي"

Instead use:

requires_preorder = true

When the selected subcategory has:

requires_preorder = true

display:

"طلبات الأكل البيتي يجب طلبها قبلها بيوم."

==================================================
20. CUSTOM ORDER
================

Do NOT store custom order requests in Supabase.

Custom order text belongs only in the local shopping cart.

The database only stores the category definition:

type = custom_order

The actual customer request remains client-side.

==================================================
21. CART MUST REMAIN LOCAL
==========================

Do NOT move the cart into Supabase.

Do NOT create a cart table.

Keep:

React state
+
localStorage

The cart remains client-side.

Products added to cart should use the current Supabase product data.

The cart should continue supporting:

product_id
name
price
image
quantity

and custom order items.

==================================================
22. CHECKOUT MUST REMAIN LOCAL
==============================

Do NOT create:

orders
customers
checkout_records
payment_records

Checkout data must NOT be persisted to Supabase.

The existing checkout should continue to generate the WhatsApp order.

==================================================
23. WHATSAPP
============

Do not redesign the WhatsApp flow in this phase unless required to make it compatible with the dynamic catalog.

The WhatsApp message must use current Supabase product data.

Do not hard-code product prices.

The WhatsApp number must remain configurable through an environment variable.

==================================================
24. LOADING / ERROR / EMPTY STATES
==================================

Because the catalog is now remote, every dynamic catalog query must handle:

Loading
Error
Empty

Do not leave blank screens.

Use the existing design system/components where possible.

Friendly Arabic messages should include:

"حصل خطأ، حاول تاني."

"مفيش منتجات متاحة حالياً."

"مفيش منتجات في القسم ده حالياً."

Do not over-design new UI in this phase.

==================================================
25. QUERY EFFICIENCY
====================

Use efficient Supabase queries.

Avoid:

* Fetching the entire database unnecessarily
* N+1 queries where avoidable
* Duplicate requests
* Fetching inactive records
* Fetching unnecessary columns

Filter active content at the database query level.

Use ordering from:

sort_order ASC

==================================================
26. TYPE SAFETY
===============

Create/update TypeScript types for:

Category
Subcategory
Product
Banner

Ensure nullable fields are correctly represented.

Especially:

Product.subcategory_id: string | null

Banner.link_id: string | null

Category.type

Subcategory.requires_preorder

Do not use `any` to bypass type errors.

==================================================
27. ENVIRONMENT VARIABLES
=========================

Use environment variables for Supabase configuration.

The frontend may use:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

or the project's existing naming convention.

Never expose:

SUPABASE_SERVICE_ROLE_KEY

to the browser.

If a service-role operation is genuinely required, it must NOT be implemented in frontend code.

==================================================
28. DO NOT BUILD ADMIN DASHBOARD
================================

This is extremely important.

Do NOT implement:

/admin
/admin/login
/admin/categories
/admin/subcategories
/admin/products
/admin/banners
/admin/settings

in this phase.

Only create the database/RLS/storage foundation required for them later.

==================================================
29. DO NOT REWRITE THE UI
=========================

Preserve the current Nahla visual design.

Do not replace all components.

Do not redesign pages.

Do not introduce a new UI framework unnecessarily.

Only modify UI code where required to replace static catalog data with dynamic Supabase data or to correctly handle loading/error/empty states.

==================================================
30. MIGRATION SAFETY
====================

Before changing the database:

Inspect the current Supabase database.

Do not drop existing unrelated tables.

Do not destroy existing data.

Do not reset the entire Supabase project.

Use migrations for schema changes.

Make migrations reproducible.

Use safe constraints and foreign keys.

==================================================
31. VERIFICATION
================

After implementation, verify:

Database:

* All required tables exist.
* Relationships are correct.
* Indexes exist.
* RLS is enabled.
* Public policies only expose active catalog records.
* Admin authorization is database-controlled.
* Storage bucket exists.
* Storage policies are reasonable.

Data:

* Initial categories exist.
* Initial subcategories exist.
* custom_order category has type='custom_order'.
* أكل بيتي has requires_preorder=true.
* Existing usable static catalog data has been migrated where appropriate.

Frontend:

* Homepage loads categories from Supabase.
* Homepage loads banners from Supabase.
* Category navigation uses database relationships.
* Product listings load from Supabase.
* Product detail loads from Supabase.
* Search uses Supabase.
* Prices come from Supabase.
* Images come from Supabase Storage/database URLs.
* Cart still works with localStorage.
* Custom orders remain local.
* Checkout remains local.
* WhatsApp order still works.

==================================================
32. FINAL REPORT
================

When finished, provide a concise implementation report:

1. Database tables created
2. Columns created
3. Relationships
4. Indexes
5. RLS policies
6. Storage bucket/policies
7. Seed data
8. Images migrated
9. Static files replaced
10. Data-access layer created
11. Public pages converted to Supabase
12. Remaining issues
13. Anything that requires manual action

IMPORTANT:

Do not claim something was completed unless you actually verified it.

Do not create the Admin Dashboard.

Do not create an orders table.

Do not create customer authentication.

Do not create customer profiles.

Do not create online payments.

Do not store checkout/customer information in Supabase.

Supabase's role in this phase is:

CATALOG + CONTENT + ADMIN AUTHORIZATION FOUNDATION

The cart remains:

LOCALSTORAGE

The final order remains:

WHATSAPP
