Design the complete UX/UI direction for the Nahla Admin Dashboard before implementation.

IMPORTANT:

* This is a DESIGN DIRECTION phase only.
* Do not implement the dashboard yet.
* Do not modify the database.
* Do not change the existing customer-facing website.
* Do not invent backend entities or features.

Use the approved SpecKit specification and tasks as the functional source of truth.

Project:

* React + TypeScript + Vite
* Supabase
* Arabic-first
* RTL
* Mobile-first
* Existing customer website must remain visually and functionally unchanged.

Brand:

* Primary Green: #4CAF50
* Accent Yellow: #FFC107
* Dark Green: #087F3E
* Dark Teal: #0F3B3B
* Background: #F4FAF6
* White: #FFFFFF
* Typography: Cairo or Tajawal

Admin Dashboard scope:

* Admin Login
* Dashboard Home
* Categories
* Subcategories
* Products
* Product Editor
* Product Option Groups
* Product Options
* Banners
* Admin Profile / Logout

Define the complete visual and UX system:

1. Admin dashboard layout

   * Desktop sidebar
   * Header
   * Main content area
   * Mobile navigation drawer
   * RTL behavior
   * Responsive breakpoints

2. Navigation

   * Information architecture
   * Sidebar hierarchy
   * Active states
   * Icons
   * Mobile navigation behavior

3. Dashboard Home

   * Only real statistics from the existing database
   * Active categories
   * Active products
   * Active banners
   * Configurable products
   * No fake orders/revenue/statistics

4. CRUD pages
   Define the UX for:

   * Categories
   * Subcategories
   * Products
   * Banners

5. Product Editor
   Design a clear editor for:

   * Product name
   * Category
   * Subcategory
   * Price
   * Description
   * Image
   * Active/inactive
   * Sort order

6. Product Options UX
   Product options must be managed INSIDE the Product Editor.

   Design:

   * Option groups
   * Single vs multiple selection
   * Required/minimum selections
   * Maximum selections
   * Options
   * Price delta
   * Active/inactive
   * Add/remove/reorder interactions

   Clearly distinguish:

   * Base price
   * Option price delta
   * Final price preview

7. Forms
   Define:

   * Input styles
   * Labels
   * Validation errors
   * Required indicators
   * Help text
   * Selects
   * Switches
   * Image upload
   * Save/cancel behavior

8. Tables and lists
   Define:

   * Desktop table layout
   * Mobile card/list layout
   * Search
   * Filtering
   * Sorting
   * Pagination if needed
   * Row actions
   * Empty states

9. Destructive actions
   Design confirmation dialogs for:

   * Delete category
   * Delete subcategory
   * Delete product
   * Delete option group
   * Delete option
   * Delete banner

10. States
    Define polished:

* Loading
* Empty
* Error
* Success
* Saving
* Disabled
* Unauthorized

11. Responsive design
    Explicitly design/test behavior for:

* 320px
* 375px
* 390px
* 414px
* 768px
* 1024px
* 1440px

12. Accessibility
    Include:

* Keyboard navigation
* Visible focus states
* Proper labels
* Accessible dialogs
* Touch-friendly controls
* Sufficient contrast

13. Motion
    Use subtle professional animation only:

* Page transitions
* Sidebar/drawer
* Dialogs
* Toasts
* Loading states
* Save feedback

14. Reusable design system
    Define reusable components and patterns instead of page-specific duplicated UI.

OUTPUT:
Provide a complete Admin Dashboard Design Direction that another implementation agent can follow exactly.

Include:

* Design system
* Layout specification
* Navigation specification
* Page-by-page UX specification
* Component inventory
* Responsive behavior
* Interaction patterns
* Form patterns
* Table/list patterns
* Product options editor UX
* Loading/error/empty states
* Accessibility rules
* Motion rules
* Visual hierarchy
* Implementation guidance

Do not implement anything in this phase.
