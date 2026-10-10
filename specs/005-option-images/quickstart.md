# Quickstart: Product Option Images

**Feature**: `005-option-images` | **Date**: 2026-10-03

Proves option photos end-to-end with zero residue. Details in
`data-model.md` and `contracts/option-image-access.md`.

## Prerequisites

- Options foundation live; manager session available.
- Dev server running.

## 1. Column lands clean

- Expected: `product_options.image_url` exists, nullable, all existing rows
  NULL; schemadiff shows exactly one added column; RLS/policies/triggers
  otherwise identical.

## 2. Upload → swap → pop → fallback (temp product)

- Upload images to two options in different groups of a temp configured
  product (files under `options/`).
- Expected: selecting shows the picked photo; picking the second switches
  to it; deselecting pops back down the stack to the base photo; options
  without photos change nothing; container never shifts layout.

## 3. Thumbnails, cart, security

- Expected: thumbnails only beside imaged options, lazy-loaded with option
  names as alt; cart lines still show base images with identical totals;
  anonymous reads obey active-only visibility with writes rejected.

## 4. Quality gates

```bash
npx tsc --noEmit -p tsconfig.json   # must pass with 0 errors
```

- Expected: type check passes; product and editor pages render with zero
  console errors; temp rows and uploaded files fully deleted (counts and
  storage listing match pre-run); reduced-motion shows instant swaps.
