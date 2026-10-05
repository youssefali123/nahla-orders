<!-- Sync Impact Report (temporary review scratch — remove before commit)
- Version change: (none) → 1.0.0 (initial ratification)
- Modified principles: none (new document; template placeholders replaced)
- Added sections: Core Principles I–V, Technology Stack & Constraints,
  Development Workflow & Quality Gates, Governance
- Removed sections: none
- Follow-up TODOs: none — all placeholders resolved from repo context
-->

# Nahla Constitution

## Core Principles

### I. Supabase Is the Source of Truth

Catalog and content data (categories, subcategories, products, prices,
descriptions, images, banners) MUST come from Supabase, never from hard-coded
frontend data. Static reference files may exist temporarily for migration but
MUST NOT remain the source of truth. Behavior MUST be data-driven: category
capabilities come from `categories.type`, preorder notices from
`subcategories.requires_preorder` — never from matching hard-coded Arabic names.

### II. Client-Side Commerce Boundaries (NON-NEGOTIABLE)

The cart MUST remain client-side (React state + localStorage); there MUST NOT be
a cart table. Checkout MUST remain local and finalize through the existing
WhatsApp order flow; there MUST NOT be `orders`, `customers`,
`checkout_records`, or `payment_records` tables, MUST NOT be customer
authentication or customer profiles, and MUST NOT be online payments. Custom
order text belongs only in the local cart; the database stores only the
`custom_order` category definition. `SUPABASE_SERVICE_ROLE_KEY` MUST NEVER reach
the browser; authorization MUST be enforced database-side via RLS, never by
client-side role checks.

### III. Type Safety and Data-Access Discipline

All Supabase access MUST go through a typed, reusable data-access layer — never
scattered queries inside UI components. TypeScript types MUST cover `Category`,
`Subcategory`, `Product`, and `Banner` with nullable fields represented
correctly (`Product.subcategory_id: string | null`, `Banner.link_id:
string | null`). `any` MUST NOT be used to bypass type errors. Queries MUST be
efficient: filter `is_active` at the database level, order by `sort_order ASC`,
fetch only needed columns, and avoid N+1 and duplicate requests.

### IV. Arabic-First UX Preservation

The existing Arabic RTL visual design MUST be preserved; UI code changes only to
swap static data for dynamic data or to add loading / error / empty states.
Every remote catalog query MUST handle loading, error, and empty states with
friendly Arabic messages — blank screens are never acceptable. The WhatsApp
number MUST stay configurable via environment variable, and WhatsApp messages
MUST use current Supabase product data, never hard-coded prices.

### V. Verification Before Done (NON-NEGOTIABLE)

No work is complete until verified by execution: `tsc --noEmit` MUST pass, and
page-level changes MUST be confirmed by rendering them (dev server + HTTP check
or equivalent). Do NOT claim completion without verification. Database changes
MUST be reproducible migrations; MUST NOT drop unrelated tables, destroy data,
or reset the project. The Admin Dashboard is explicitly out of scope until its
own phase — only the database / RLS / storage foundation for it is built.

## Technology Stack & Constraints

Stack: TanStack Start (SSR) + TanStack Router + React Query + React 19 +
TypeScript (strict) + Tailwind CSS v4 + Vite, Supabase (Postgres 17, Auth,
Storage). Path alias `@/*` maps to `./src/*`. Frontend Supabase config uses
`VITE_`-prefixed environment variables only. This project is connected to
Lovable: published git history MUST NOT be rewritten (no force-push, rebase,
amend, or squash of pushed commits), and pushed branches MUST stay working.

## Development Workflow & Quality Gates

Feature work follows specify → plan → tasks → implement. Every change MUST pass:
`tsc --noEmit` with zero errors, successful dev-server render of touched pages,
and confirmation that existing functionality (cart, checkout, WhatsApp order)
still works. Schema changes require inspecting current tables first and
re-checking security / performance advisories after DDL changes.

## Governance

This constitution supersedes all other practices for the Nahla project.
Amendments require documenting the change, bumping the version per the policy
below, and updating the ratification metadata. All reviews MUST verify
compliance with the Core Principles; any exception MUST be explicitly justified
in the relevant spec or plan.

Versioning policy (semantic): MAJOR for backward-incompatible removals or
redefinitions of principles; MINOR for new principles or materially expanded
guidance; PATCH for clarifications, wording, or typo fixes.

**Version**: 1.0.0 | **Ratified**: 2026-10-03 | **Last Amended**: 2026-10-03
