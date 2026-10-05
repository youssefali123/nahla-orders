# Data Model: Admin Dashboard

**Feature**: `003-admin-dashboard` | **Date**: 2026-10-03

No schema changes. This feature reads and writes the existing tables through
the existing RLS posture with a manager session. Field reference (all
editable unless noted):

## categories (managed)

name (unique, required), icon emoji, image upload → `image_url`, `sort_order`,
`is_active` toggle, `type` (`normal` | `custom_order`, shown as read-only
badge after creation — changing behavior type of a live section is
destructive-adjacent). Delete cascades to subcategories/products/groups/
options (confirmation states this).

## subcategories (managed)

Parent category (required, filterable), name (unique per parent), icon,
image upload, `sort_order`, `is_active`, `requires_preorder` switch.
Delete cascades to products (nulls their link) — confirmation states this.

## products (managed)

Name, description, base `price` (numeric ≥ 0), category + optional
subcategory (subcategory list narrows to the chosen category), image upload,
`unit`, `sort_order`, `is_active`, `is_featured`. Options-presence shown from
`getProductsWithOptions`. Delete cascades through groups to options
(confirmation states this).

## product_option_groups (managed, nested in product editor)

Name (unique per product), `type` single/multiple (single guides max → 1),
`min_selections`, `max_selections` (null = open for multiple), status,
order. Invalid combinations rejected by CHECKs, surfaced inline.

## product_options (managed, inline rows)

Name (unique per group), `price_delta` always visible formatted `+15 جنيه` /
`+0 جنيه`, status, order.

## banners (managed)

Title, image upload (required), `link_type` + conditional target picker
(category/subcategory/product record or custom URL) + `link_url` for custom,
`sort_order`, `is_active`.

## admin_profiles (read-only reference)

 managers are never created/edited/removed through the dashboard in this
phase; the table is read only to resolve the signed-in manager's status
(first manager via documented manual SQL).

## Dashboard home metrics (computed, never stored)

Active category/product/banner counts, configurable-product count — each a
live count query; creation shortcuts only. No analytics entities exist and
none are created.

## Session shape (client-side only)

Supabase auth session (email/password); manager flag resolved by presence of
the user's row in `admin_profiles`. Expiry returns the manager to sign-in.
