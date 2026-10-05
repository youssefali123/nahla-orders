# Nahla — Add Product Variants & Add-ons to Supabase

We already have the Nahla Supabase database implemented with the existing catalog structure:

* `categories`
* `subcategories`
* `products`
* `banners`
* `admin_profiles`

Do NOT recreate or replace any existing tables.

I now want to extend the product model so that a product can optionally have configurable options such as:

### Examples

A restaurant product could have:

**الحجم**

* صغير → +0
* وسط → +10
* كبير → +20

**الطعم**

* عادي → +0
* حار → +0

**الإضافات**

* كاتشب → +5
* جبنة إضافية → +15
* صوص ثوم → +10

A product may have:

* no options at all
* only variants
* only add-ons
* both variants and add-ons
* multiple option groups

The solution must be generic and must NOT hard-code Arabic names such as "الحجم", "الطعم", or "الإضافات".

---

## 1. Inspect the existing database first

Before making any changes:

1. Inspect the existing `products` table.
2. Inspect all existing foreign keys, indexes, RLS policies, and triggers related to `products`.
3. Inspect the existing catalog schema.
4. Confirm the current database structure before modifying it.
5. Do not delete or recreate existing data.

Use the connected Supabase MCP.

---

# 2. Create `product_option_groups`

Create a new table:

```sql
product_option_groups
```

Suggested structure:

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

product_id UUID NOT NULL
    REFERENCES products(id)
    ON DELETE CASCADE

name TEXT NOT NULL

type TEXT NOT NULL DEFAULT 'single'

min_selections INTEGER NOT NULL DEFAULT 0

max_selections INTEGER NULL

sort_order INTEGER NOT NULL DEFAULT 0

is_active BOOLEAN NOT NULL DEFAULT true

created_at TIMESTAMPTZ NOT NULL DEFAULT now()

updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

### Meaning of `type`

Supported values:

```text
single
multiple
```

`single` means the customer can select one option from this group.

Example:

```text
الحجم
○ صغير
○ وسط
○ كبير
```

`multiple` means the customer can select multiple options.

Example:

```text
الإضافات
☐ كاتشب
☐ جبنة
☐ صوص ثوم
```

Do NOT use arbitrary values for `type`.

Add a CHECK constraint:

```text
type IN ('single', 'multiple')
```

---

# 3. Selection rules

The table must support configurable selection limits.

Examples:

### Required single choice

```text
type = single
min_selections = 1
max_selections = 1
```

Example:

```text
الحجم
صغير / وسط / كبير
```

The customer must select exactly one.

### Optional single choice

```text
type = single
min_selections = 0
max_selections = 1
```

### Multiple optional choices

```text
type = multiple
min_selections = 0
max_selections = NULL
```

Example:

```text
الإضافات
كاتشب
جبنة
صوص ثوم
```

### Multiple choices with a maximum

Example:

```text
type = multiple
min_selections = 0
max_selections = 3
```

The customer can select up to 3 options.

Add database constraints ensuring:

```text
min_selections >= 0
max_selections IS NULL OR max_selections >= min_selections
```

Also ensure the values make sense for the group type.

---

# 4. Create `product_options`

Create:

```sql
product_options
```

Structure:

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

option_group_id UUID NOT NULL
    REFERENCES product_option_groups(id)
    ON DELETE CASCADE

name TEXT NOT NULL

price_delta NUMERIC(10,2) NOT NULL DEFAULT 0

sort_order INTEGER NOT NULL DEFAULT 0

is_active BOOLEAN NOT NULL DEFAULT true

created_at TIMESTAMPTZ NOT NULL DEFAULT now()

updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

---

# 5. Important pricing rule

Do NOT store the complete product price inside `product_options`.

Use:

```text
price_delta
```

instead.

For example:

Product:

```text
Burger
base price = 100
```

Options:

```text
Small       +0
Medium      +15
Large       +30
```

The final selected price becomes:

```text
100 + selected option price deltas
```

If the customer selects:

```text
Large (+30)
Cheese (+15)
Spicy (+0)
```

Then:

```text
Final item price = 100 + 30 + 15 + 0
                 = 145
```

The database must allow both positive and zero price deltas.

Do not prevent negative values if there is a legitimate business use case such as:

```text
Remove an ingredient → -10
```

However, the normal use case is positive or zero price deltas.

---

# 6. Relationships

The final relationship should be:

```text
products
   │
   ├── product_option_groups
   │        │
   │        ├── product_options
   │        ├── product_options
   │        └── product_options
   │
   └── product_option_groups
            │
            ├── product_options
            └── product_options
```

Example:

```text
Burger
│
├── الحجم
│   ├── صغير       +0
│   ├── وسط       +15
│   └── كبير      +30
│
├── الطعم
│   ├── عادي      +0
│   └── حار       +0
│
└── الإضافات
    ├── كاتشب     +5
    ├── جبنة      +15
    └── صوص ثوم   +10
```

---

# 7. Indexes

Create indexes appropriate for the expected frontend queries.

At minimum:

```text
product_option_groups(product_id, is_active, sort_order)

product_options(option_group_id, is_active, sort_order)
```

Also consider indexes for foreign keys if PostgreSQL does not already create the necessary indexes automatically.

---

# 8. Updated_at trigger

The new tables must use the same `updated_at` strategy already used by the existing database.

Do NOT create a duplicate trigger function if an existing reusable `updated_at` function already exists.

If the project already has a standard updated-at trigger/function, reuse it.

Otherwise create a reusable implementation and attach it to:

```text
product_option_groups
product_options
```

---

# 9. RLS / Security

Both new tables must have Row Level Security enabled.

## Public / anonymous users

The public website does NOT require authentication.

Anonymous users must be able to SELECT only active options belonging to active products.

The public must NOT be allowed to:

```text
INSERT
UPDATE
DELETE
```

on either table.

The public should only see:

```text
product_option_groups.is_active = true
product_options.is_active = true
```

and options must belong to products that are currently active.

Do not expose inactive product options to the public catalog.

---

# 10. Admin authorization

Only authorized administrators from the existing:

```text
admin_profiles
```

table should be allowed to:

```text
INSERT
UPDATE
DELETE
```

product option groups and product options.

Do NOT treat every authenticated Supabase user as an administrator.

Use the existing admin authorization pattern from the current database.

Do NOT use `user_metadata` for authorization.

Do NOT expose the Supabase service-role key to the frontend.

---

# 11. Data integrity

Add appropriate database constraints.

Requirements:

* `product_id` cannot be NULL.
* `option_group_id` cannot be NULL.
* `name` cannot be empty.
* `type` must be either `single` or `multiple`.
* `min_selections >= 0`.
* `max_selections` must be NULL or >= `min_selections`.
* `price_delta` must be a valid numeric value.
* Foreign keys must use the appropriate cascade behavior.
* Deleting a product should automatically delete its option groups and options.
* Deleting an option group should automatically delete its options.

Do not introduce unnecessary business rules that prevent legitimate future use cases.

---

# 12. Prevent invalid option-group configuration

Add database constraints where practical.

For example:

For:

```text
type = single
```

the maximum should not allow more than one selection.

Therefore ensure:

```text
max_selections IS NULL OR max_selections <= 1
```

for single-selection groups.

For a single-selection group, a configuration such as:

```text
min_selections = 2
```

must not be allowed.

Keep these rules at the database level where practical.

---

# 13. Product catalog queries

Extend the existing Supabase data access layer.

The frontend should be able to fetch a product together with its active option groups and active options.

Conceptually:

```text
Product
  ├── id
  ├── name
  ├── price
  ├── image_url
  ├── description
  └── option_groups[]
        ├── id
        ├── name
        ├── type
        ├── min_selections
        ├── max_selections
        └── options[]
              ├── id
              ├── name
              └── price_delta
```

Add/update the appropriate data-access functions.

For example:

```text
getProduct(productId)
```

should return the product together with its active option groups and active options.

Also ensure category/product listing queries can efficiently determine whether a product has active options if the UI needs that information.

---

# 14. Do NOT change the existing product price model

Keep:

```text
products.price
```

as the base price.

Do NOT convert the product itself into variants.

The product remains the base catalog item.

Options modify the selected item's price through:

```text
price_delta
```

---

# 15. Important distinction: variants vs add-ons

Do not create separate hard-coded tables such as:

```text
product_variants
product_addons
```

unless there is a strong database-level reason.

Use the generic:

```text
product_option_groups
product_options
```

model.

This allows the same system to represent:

### Variants

```text
الحجم
الصغير
الوسط
الكبير
```

### Flavor

```text
الطعم
عادي
حار
```

### Add-ons

```text
الإضافات
جبنة
كاتشب
صوص
```

### Future options

```text
نوع الخبز
نوع الأرز
درجة التسوية
اختيار المشروب
```

without changing the database schema.

---

# 16. Example seed/test data

Do NOT invent production catalog data.

However, after creating the schema, if there is an existing product suitable for testing, you may create a minimal test configuration only if it is clearly safe and does not corrupt real catalog data.

If there is no suitable existing product, do NOT create fake production data.

Instead verify the schema using SQL queries.

---

# 17. Do not implement the UI yet

This task is ONLY for the Supabase/database foundation and data-access layer.

Do NOT build:

* admin dashboard
* product editor UI
* add-on selection UI
* variant selection UI
* checkout UI changes
* cart UI redesign

Those will be implemented later.

However, the schema and data-access layer must be ready for those future features.

---

# 18. Cart compatibility

The current Nahla architecture keeps the customer cart client-side.

Do NOT create:

```text
cart
cart_items
orders
order_items
```

tables for this feature.

The selected options will later be stored inside the local cart item.

The future cart item should conceptually be able to contain:

```text
product_id
product_name
base_price
quantity

selected_options:
  [
    {
      option_group_id,
      option_group_name,
      option_id,
      option_name,
      price_delta
    }
  ]

unit_price
total_price
```

The database should therefore provide stable UUIDs for option groups and options.

---

# 19. Price calculation principle

The database stores:

```text
products.price
```

and:

```text
product_options.price_delta
```

The application calculates the selected item's price.

Conceptually:

```text
unit_price =
    product.base_price
    +
    SUM(selected option price_delta)
```

Then:

```text
item_total =
    unit_price * quantity
```

Do NOT create a database trigger that calculates the customer's cart total.

The cart remains client-side.

---

# 20. Do not trust frontend prices

The public frontend can read catalog prices, but the architecture should treat Supabase as the source of truth for:

```text
product base price
option price delta
option availability
```

When the cart/checkout layer is implemented later, it should retrieve the current product and option information from Supabase before generating the final WhatsApp order message.

Do not rely on a manipulated client-side price as authoritative business data.

---

# 21. Verification

After implementing the schema:

1. Verify both tables exist.
2. Verify all foreign keys.
3. Verify all constraints.
4. Verify indexes.
5. Verify RLS is enabled.
6. Verify public SELECT policies.
7. Verify public INSERT/UPDATE/DELETE are denied.
8. Verify admin mutations follow the existing admin authorization model.
9. Verify deleting a product cascades correctly.
10. Verify deleting an option group cascades to its options.
11. Run representative SELECT queries.
12. Run Supabase security/database advisors if available.
13. Fix any security or schema issues found.

Do not consider the task complete until the implementation has been verified with actual database queries.

---

# 22. Final report

At the end, report:

### Tables created

```text
product_option_groups
product_options
```

### Relationships

Explain the relationships with `products`.

### Constraints

List the important constraints.

### RLS

Explain who can read and who can modify the data.

### Indexes

List the indexes created.

### Data access

Explain how the existing `getProduct()` / catalog layer now retrieves options.

### Example

Show a conceptual example such as:

```text
Burger — 100 EGP

الحجم
  صغير +0
  وسط +15
  كبير +30

الطعم
  عادي +0
  حار +0

الإضافات
  كاتشب +5
  جبنة +15
```

Do not build the admin dashboard or frontend UI in this task.
