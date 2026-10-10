# Nahla — Product Option Images

Extend the live Nahla catalog so that an individual product option can
optionally carry its own image. When the shopper selects that option on the
product page, the displayed product image switches to the selected option's
image.

## 1. Scope and non-goals

Build the database foundation, data-access support, product-page image
switching, option thumbnails in the picker, and dashboard upload controls.

Do NOT change:

* pricing logic (base price + deltas, unchanged)
* cart totals or the WhatsApp order message (text-only, images irrelevant)
* cart line thumbnails (always show the product base image)
* existing tables, RLS posture, or auth model
* the customer website design beyond the specified image behaviors

## 2. Database

Add exactly one nullable column using a new migration. Do NOT recreate or
replace any existing table.

```text
product_options.image_url TEXT NULL
```

Rules:

* NULL means "no dedicated image" (fully valid, the common case).
* Reuse the existing `nahla-images` bucket and its admin-gated write
  policies; store option images under a new `options/` prefix.
* No new RLS policies beyond what the table already enforces; no new
  tables; no schema changes to any other table.

## 3. Display priority rule (the core UX decision)

The product page shows exactly one main image at a time, resolved by this
priority, top wins:

1. The most recently selected option (across all groups) that has its own
   image.
2. If that selection is removed, fall back to the previously selected option
   with an image (recency stack).
3. If no selected option has an image, show the product base image
   (`products.image_url`), then the product emoji icon, then the generic
   placeholder — the existing fallback chain, unchanged.

Single-selection groups swap the image on every tap. Multiple-selection
groups follow the same recency rule; deselecting pops the stack.

## 4. Picker thumbnails

Each option button shows a small thumbnail of its own image next to the
option name (lazy-loaded). Options without an image show no thumbnail and
keep the current text-only appearance. Thumbnails are presentational only
and never affect selection state or pricing.

## 5. Cart behavior (explicitly unchanged)

Cart lines always display the product base image (or icon/placeholder
fallback), never option images. The selected option names and deltas
continue to appear as text under each line. No schema or pricing changes
in the cart.

## 6. Dashboard (admin)

Extend the existing option editor only:

* Each option row gains an image upload control (upload-then-save: a failed
  upload blocks the save with retry, same rule as all other images).
* Preview the option image next to its thumbnail slot once uploaded, with a
  remove-image action.
* No new top-level pages; no changes to group editing, limits, deltas, or
  the price preview.

## 7. Data access

* `ProductOption` gains `image_url: string | null`.
* `getProduct()` includes the new field in its ordered option tree at zero
  extra query cost.
* Listings and the `getProductsWithOptions` flag are unchanged (thumbnails
  load only inside the product page and editor).

## 8. Performance and accessibility

* Option images lazy-load; picker thumbnails use small files (resize or
  compress on upload guidance: keep each under ~200KB).
* Every image keeps a meaningful `alt` (option name); decorative wrappers
  are `aria-hidden`.
* Changing the main image must not move layout (fixed aspect container,
  same as today) and must respect `prefers-reduced-motion` for any
  transition.

## 9. Verification

After implementation, verify with live queries and renders:

1. The new column exists and is nullable; nothing else in the schema changed.
2. Upload an image to one option of a test product and confirm the product
   page swaps to it on select, pops back on deselect, and falls back to the
   base image with no selection.
3. Select two imaged options from different groups and confirm the most
   recent selection wins.
4. Confirm thumbnails appear only for options that have images.
5. Confirm the cart still shows base images and totals are unchanged.
6. Confirm anonymous reads see option images only under the existing
   active-only rules; anonymous writes remain rejected.
7. Remove all test images/rows afterwards; zero residue.
8. `tsc` passes with zero errors.

## 10. Final report

When finished, report: the schema change, storage prefix, DAL changes,
product-page behavior (priority rule + thumbnails), dashboard changes,
verification evidence for each item above, and anything requiring manual
action. Do not claim completion for anything not verified live.
