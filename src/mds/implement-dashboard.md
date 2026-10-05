Continue with the implementation of the Nahla Admin Dashboard.

Use `/speckit-implement` to execute the approved SpecKit tasks.

IMPORTANT:
The UI/UX design phase is already complete.

The approved design direction is located at:

specs/003-admin-dashboard/design-direction.md

You MUST read and follow this file before implementing any UI.

SOURCE OF TRUTH PRIORITY:

1. SpecKit specification, plan, and tasks
   → Functional requirements and implementation scope.

2. Existing Supabase schema and existing data-access contracts
   → Database structure and backend behavior.

3. specs/003-admin-dashboard/design-direction.md
   → Visual design, UX, layout, responsive behavior, RTL behavior,
   components, interactions, accessibility, and motion.

4. Existing customer-facing Nahla website
   → Protected dependency that must remain unchanged.

IMPLEMENTATION RULES:

* Execute the existing SpecKit tasks incrementally.
* Do not redesign the customer website.
* Do not modify customer-facing routes unless explicitly required by the approved specification.
* Do not modify cart behavior.
* Do not modify checkout behavior.
* Do not modify WhatsApp order generation.
* Do not replace Supabase.
* Do not recreate existing database tables.
* Do not weaken or bypass RLS.
* Never expose a Supabase service-role key in frontend code.
* Reuse existing `ui/` components when appropriate.
* Create new reusable Admin-specific components under the approved `admin/` structure.
* Follow the exact route structure defined by the specification and design direction.
* Keep the dashboard Arabic-first and RTL.
* Use the approved Nahla design tokens and visual hierarchy.
* Use Lucide icons only where specified by the design direction.
* Follow the responsive behavior for 320px through 1440px.
* Implement loading, empty, error, success, saving, and unauthorized states.
* Implement proper destructive-action confirmations.
* Implement accessible keyboard/focus behavior.
* Follow the upload-then-save rule for images.
* Use the existing `admin.ts` contract where specified.

PRODUCT OPTIONS:

Product Options MUST remain nested inside the Product Editor.

Do not create a separate top-level Product Options page unless the existing specification explicitly requires it.

Support the existing model:

product
→ option groups
→ options

Respect:

* single/multiple selection
* required/minimum selections
* maximum selections
* active/inactive
* sort order
* price delta
* base price vs option delta distinction
* live price preview

SECURITY:

Admin access must be protected using the existing Supabase authentication and admin authorization model.

Do not assume that every authenticated user is an admin.

Do not use client-side UI checks as the only security mechanism.

The database RLS policies remain authoritative.

IMPLEMENTATION PROCESS:

1. Read:

   * SpecKit specification
   * plan
   * tasks
   * design-direction.md
   * relevant existing source files
   * existing Supabase/data-access contracts

2. Audit the current codebase before changing files.

3. Implement tasks in dependency order.

4. After each logical feature:

   * run TypeScript checks
   * verify routes
   * verify Supabase interactions
   * verify authorization
   * verify loading/error/empty states

5. Do not make unrelated refactors.

6. Do not modify working customer functionality merely to simplify Admin implementation.

7. Before declaring completion, run the full verification checklist from:
   specs/003-admin-dashboard/design-direction.md

8. Also verify:

   * customer homepage
   * category pages
   * product pages
   * product options
   * cart
   * checkout
   * WhatsApp flow

FINAL REQUIREMENT:

Do not stop after creating only the visual shell.

Implement the actual functional Admin Dashboard according to ALL approved SpecKit tasks, including:

* authentication
* protected admin routes
* dashboard home
* categories CRUD
* subcategories CRUD
* products CRUD
* product editor
* product option groups
* product options
* banners CRUD
* image upload/storage
* validation
* loading/error/empty states
* authorization
* responsive behavior
* accessibility
* final regression verification

If an implementation decision is already defined by the SpecKit files or `design-direction.md`, do not invent an alternative.

If something genuinely conflicts between the specification and the design direction, preserve the functional requirement and choose the UI implementation that satisfies it without changing the underlying behavior.

Start by reading the approved SpecKit artifacts and `design-direction.md`, then begin implementation.
