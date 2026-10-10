# Data Model: Product Option Images

**Feature**: `005-option-images` | **Date**: 2026-10-03

Exactly one additive change; everything else untouched.

## product_options.image_url

| Aspect | Value |
|---|---|
| Column | `image_url TEXT NULL` (NULL = no dedicated image, the common case) |
| Backfill | none (existing rows read as NULL) |
| Storage | `nahla-images` bucket, `options/` prefix, existing admin-gated writes |
| RLS | unchanged (table policies already scope active-only reads, admin writes) |
| Indexes/triggers | unchanged (no query pattern needs them) |

## Read shapes (extended, not new)

- **ProductOption**: gains `image_url: string | null`; rides the existing
  ordered tree at zero extra query cost.
- **Main product photo (resolved client-side)**: newest imaged selection →
  earlier imaged selections → product base chain (image → icon →
  placeholder). Ephemeral component state; never persisted, never in cart.
- **Picker thumbnails**: presentational projection of the same field;
  lazy-loaded; absent when NULL.

## Explicit non-changes

Cart lines, cart totals, order message, listings, flags, group editing,
limits, deltas, price preview, auth, RLS, and all other tables.
