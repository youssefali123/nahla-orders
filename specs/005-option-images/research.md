# Research: Product Option Images

**Feature**: `005-option-images` | **Date**: 2026-10-03

No NEEDS CLARIFICATION — spec is closed on every decision.

## R1 — Single nullable column, zero ceremony

- **Decision**: `ALTER TABLE product_options ADD COLUMN image_url TEXT NULL`
  in a new migration; no backfill (existing rows read as NULL).
- **Rationale**: The only missing datum is one optional reference; defaults,
  constraints, indexes, and triggers are all unaffected.
- **Alternatives considered**: sidecar table keyed by option (rejected —
  1:1 bloat for a nullable attribute).

## R2 — Recency stack lives in component state

- **Decision**: The product page keeps an ordered list of selected option
  ids (append on select, remove on deselect); the displayed image resolves
  to the last list entry having a non-null `image_url`, else the existing
  base chain. No persistence, no URL params — the stack is ephemeral
  selection UI state.
- **Rationale**: Selections already live in component state; the image is a
  pure function of that state, so no storage, sync, or hydration concerns.
- **Alternatives considered**: deriving from snapshot order (rejected —
  loses true recency across groups); persisting in cart (rejected — brief
  forbids option images in cart).

## R3 — Thumbnails reuse the same field

- **Decision**: Picker buttons read `option.image_url` directly with
  `loading="lazy"`; no thumbnail variants, no separate column, no extra
  queries (field rides the existing ordered tree).
- **Rationale**: One source of truth; browser downscaling of a sensibly
  sized upload is sufficient at thumbnail dimensions.
- **Alternatives considered**: generated thumbnails via image service
  (rejected — no such service in stack, advisory size guidance suffices).

## R4 — Storage prefix and upload rule

- **Decision**: `options/` prefix in `nahla-images` via the existing
  `uploadImage` helper extended with the new prefix; upload-then-save with
  retry, identical to all other image fields.
- **Rationale**: Follows the established one-prefix-per-entity convention;
  zero policy work (table RLS + bucket policies already cover it).
- **Alternatives considered**: reusing `products/` prefix (rejected —
  muddies per-entity organization and future cleanup).

## R5 — Admin surface is one control

- **Decision**: Extend the existing option row in the product editor with
  an image upload + preview + remove control; no new pages, dialogs, or
  editor restructuring.
- **Rationale**: Smallest change satisfying the pipeline (upload → preview
  → save) exactly where options are already managed.
- **Alternatives considered**: standalone media manager (rejected — scope
  explosion for one nullable field).

## R6 — Motion and layout stability

- **Decision**: Fixed-aspect image container (already present) with a CSS
  opacity crossfade on swap, disabled under `prefers-reduced-motion`;
  `alt` = option name, decorative wrappers `aria-hidden`.
- **Rationale**: Reuses the project's hand-made motion system; no library,
  no layout shift by construction.
