# Research: Product Display Filters

**Feature**: `006-product-filters` | **Date**: 2026-10-03

No NEEDS CLARIFICATION — spec is closed on every decision.

## R1 — Two tables, no reuse of option groups

- **Decision**: New `subcategory_filters` (one-of parent FKs) plus
  `product_filter_values` (PK on product_id for single-select).
- **Rationale**: Filters are classificatory and price-free; option groups
  carry pricing semantics, limits, and cart behavior that must never leak
  into display filtering. Separate tables keep both models honest.
- **Alternatives considered**: reusing option groups with zero deltas
  (rejected — conflates pricing with classification, pollutes the product
  page pickers); generic tag table shared across entities (rejected —
  parent-scoped filters match the brief exactly with simpler queries).

## R2 — Opt-in flag placement

- **Decision**: `has_filters BOOLEAN DEFAULT false` added to subcategories;
  direct-listing categories reuse the same column on categories. No flag =
  no bar, no assignment UI, byte-identical behavior.
- **Rationale**: One boolean per section is the smallest possible opt-in;
  placing it on both tables covers subcategory and direct-category cases
  uniformly (a direct category simply has no subcategories to consult).
- **Alternatives considered**: inferring opt-in from filter-row existence
  (rejected — an admin staging values would leak a half-built bar).

## R3 — In-page filtering without reads

- **Decision**: Listing loaders return products already tagged with their
  filter id; the chip bar filters the loaded array client-side by id match.
  Scroll position preserved by never re-rendering the page container (only
  the grid children change).
- **Rationale**: Data is already in hand; any per-tap read would be pure
  waste and would visibly lag on mobile connections.
- **Alternatives considered**: query-per-tap (rejected — latency, read
  amplification); URL-param-driven server filtering (rejected — full page
  reloads, scroll loss).

## R4 — Mapping resolution without N+1

- **Decision**: One constant-cost query per listing page mapping the listed
  product ids to filter ids (batched `in` query), merged in code; plus one
  query for the section's active filters.
- **Rationale**: Mirrors the proven `getProductsWithOptions` pattern; two
  bounded reads regardless of page size.
- **Alternatives considered**: per-product lookups (rejected — N+1);
  denormalized filter name on products (rejected — rename anomalies).

## R5 — Assignment UX in the editor

- **Decision**: Single dropdown in the product editor, visible only when the
  product's current section is enabled, populated from that section's
  active values; saving with an empty choice clears the assignment;
  section switches re-resolve and drop stale values before save.
- **Rationale**: Dropdown enforces single-select structurally; conditional
  visibility keeps non-enabled products byte-identical in UX.
- **Alternatives considered**: free-text filter entry (rejected — typos,
  duplicates, no validation); multi-checkboxes (rejected — contradicts
  single-select).

## R6 — Value management placement

- **Decision**: Inline value CRUD inside the existing subcategory/category
  edit screens (same dialog family as option groups), with per-parent
  duplicate rejection and assignment-loss-only delete confirmations.
- **Rationale**: Values belong to their section's lifecycle; no new pages
  keeps navigation and mental model intact.
- **Alternatives considered**: standalone filters section (rejected — extra
  navigation for tightly-coupled data).

## R7 — Verification with zero residue

- **Decision**: Temp enabled section (or temp values on a scratch
  subcategory), temp products assigned, full matrix, then delete values
  and products; counts compared pre/post.
- **Rationale**: Same temp-row discipline as prior phases; filters touch
  nothing but their own rows.
