# Contract: Option Image Access

**Feature**: `005-option-images` | **Date**: 2026-10-03

Extends `../002-product-options/contracts/options-access.md`. Only the option
type, the product page resolution, and the option-row editor change.

## Types (extended)

```text
ProductOption { ..., image_url: string | null }
```

## Functions (changed)

```text
getProduct(productId): unchanged signature and cost; option rows now
  include image_url (NULL when absent). Callers ignore it except the
  product page and the admin option editor.

saveOption(groupId, id, input): input gains optional image_url
  (string | null); upload-then-save enforced by callers, not the DAL.
```

## UI resolution contract (product page)

```text
displayedImage(pickedIds: string[]): string | emoji-fallback
  1. Last picked id whose option has non-null image_url wins.
  2. Else earlier imaged picks in reverse pick order.
  3. Else the existing product base chain (image → icon → placeholder).
  Container aspect fixed; crossfade transition; instant under
  prefers-reduced-motion. Thumbnails: lazy <img> with alt = option name
  beside imaged options only.
```

## Guarantees relied upon

```text
- Anonymous reads include image_url under existing active-only rules.
- Cart and order message never consume image_url.
- Deleting an option leaves its storage file orphaned (acceptable;
  storage lifecycle is out of scope); row removal is what matters.
- Zero residue: test rows and files removed after verification.
```
