# Nahla — Product Display Filters

Give admin-designated subcategories (and direct-listing categories) a
top filter bar on their product listing pages. The admin enables filtering
per section, defines the filter values, and assigns each product to exactly
one value. Shoppers tap a chip to filter the already-loaded products
in-page with zero extra queries.

## 1. Scope and non-goals

Build the database foundation, data-access support, the in-page chip bar
with client-side filtering, and dashboard management (enable flag, filter
values, product assignment).

Do NOT change:

* pricing logic, cart, checkout, or the order message in any way
* existing tables, RLS posture, or auth model
* product option groups/options (filters are classificatory and never
  affect price — the two systems stay fully separate)
* the customer website design beyond the specified chip bar

## 2. Database

Add exactly two new tables using new migrations. Do NOT recreate or replace
any existing table.

```text
subcategory_filters
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  subcategory_id UUID NULL REFERENCES subcategories(id) ON DELETE CASCADE
  category_id UUID NULL REFERENCES categories(id) ON DELETE CASCADE
  name TEXT NOT NULL (non-empty)
  sort_order INTEGER NOT NULL DEFAULT 0
  is_active BOOLEAN NOT NULL DEFAULT true
  timestamps (reused updated_at trigger)

  Exactly one of subcategory_id / category_id is set per row
  (CHECK constraint). Uniqueness per parent.
```

```text
product_filter_values
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE
  filter_id UUID NOT NULL REFERENCES subcategory_filters(id) ON DELETE CASCADE
  PRIMARY KEY (product_id)
```

Rules:

* Exactly one of `subcategory_id` / `category_id` per filter row; a filter
  belongs either to a subcategory (e.g. منظفات under ماركت) or to a
  direct-listing category (e.g. خضار وفاكهة), never both, never neither.
* Each product carries at most one filter value (single-select only).
* Deleting a subcategory, category, or filter cascades correctly; deleting
  a product removes its assignment.
* Reuse the existing RLS pattern (public active-only reads, admin writes
  via the existing admin authorization), the shared `updated_at` trigger
  function, and composite `(parent, is_active, sort_order)` indexes.
* A section opts in explicitly; sections without the flag behave exactly
  as today (no chip bar, no assignment UI anywhere).

## 3. Opt-in model

Filtering is off by default everywhere. The admin enables it per
subcategory (or per direct-listing category) with a single flag. Only
enabled sections show the chip bar to shoppers and the assignment control
in the product editor. Disabled sections are byte-identical in behavior to
today.

## 4. Shopper experience

On an enabled listing page, a horizontal chip bar appears above the grid,
starting with an "الكل" (All) chip followed by the section's active filter
values in defined order. Tapping a chip filters the already-loaded product
list in place — no new queries, no page reload, scroll position preserved.
The active chip is visually distinct (non-color cues included). With no
products under a value, show the standard empty-products message. The bar
scrolls horizontally on small screens with no page-level overflow.

## 5. Product assignment (dashboard)

In the product editor, when (and only when) the chosen subcategory — or the
chosen direct-listing category — has filtering enabled, show a single
assignment dropdown listing that section's active filter values. Changing
the product's section re-resolves the available values; values from another
section are never offered. Saving stores the single assignment (or clears
it). Products in non-enabled sections never show the control.

## 6. Filter management (dashboard)

Inside the subcategory editor (and the category editor for direct-listing
categories): an enable/disable switch for display filters plus inline
management of values (add, rename, reorder, activate/deactivate, delete)
with duplicate-name rejection per parent and delete confirmations stating
that assigned products simply lose their assignment (products themselves
are never deleted). No new top-level admin pages.

## 7. Data access

* New types plus: active filters for a section in order; product-to-filter
  mapping resolved inside the existing product-list reads (no N+1 — one
  constant-cost query per listing page).
* Listings expose each product's filter assignment so the chip bar filters
  client-side with zero extra reads.
* All other functions keep exact signatures and behavior.

## 8. Performance and accessibility

* Zero extra queries per filter tap (client-side only); chips are real
  buttons with `aria-pressed`; the bar is keyboard-navigable with visible
  focus; active state never color-only; the control respects
  `prefers-reduced-motion`.

## 9. Verification

After implementation, verify with live queries and renders:

1. Both tables exist with constraints, uniques, cascades, trigger, indexes,
   and RLS; nothing else in the schema changed.
2. Enable filters on a test subcategory with three values; assign products;
   confirm the chip bar appears only there and filters in place with the
   All chip restoring the full list.
3. Confirm non-enabled sections show no bar and no assignment control.
4. Confirm duplicate values per parent and invalid assignments are rejected.
5. Confirm anonymous reads see active-only data with writes rejected.
6. Confirm cart, totals, messages, and option behaviors are byte-identical.
7. Remove all test rows afterwards; zero residue.
8. `tsc` passes with zero errors.

## 10. Final report

When finished, report: the schema additions, DAL changes, shopper
filtering behavior, dashboard changes, verification evidence for each item
above, and anything requiring manual action. Do not claim completion for
anything not verified live.
