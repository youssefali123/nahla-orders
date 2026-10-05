# Nahla Admin Dashboard — UI/UX Pro Max Design & Implementation Prompt

## Role

You are designing and implementing the Admin Dashboard for the existing **Nahla / نحلة** website.

The dashboard is an internal admin interface for authorized administrators.

The customer-facing Nahla website already exists and must NOT be redesigned or broken as part of this task.

Use the existing project, existing Supabase schema, and the approved SpecKit specification as hard constraints.

---

# 1. Design objective

Create a professional, modern, clean Admin Dashboard that feels like a real production commerce/content management system.

The visual language should be consistent with the Nahla brand but should feel more professional and productivity-oriented than the customer website.

The dashboard should communicate:

* trust
* clarity
* speed
* organization
* control
* simplicity

Avoid making it look like a generic admin template.

---

# 2. Brand

Nahla / نحلة

Arabic-first interface.

Brand direction:

* friendly
* modern
* clean
* green-focused
* approachable
* professional

Existing brand colors:

```text
Primary Green: #4CAF50
Accent Yellow: #FFC107
Dark Green: #087F3E
Dark Teal: #0F3B3B
White: #FFFFFF
Light Background: #F4FAF6
```

Use the existing brand system intelligently.

Do not flood the entire dashboard with saturated green.

Use the primary green for:

* primary actions
* active states
* important highlights
* success states

Use yellow sparingly for:

* attention
* secondary highlights
* important status indicators

Use dark teal/green for:

* navigation
* headings
* strong contrast areas

---

# 3. Typography

The dashboard is Arabic-first.

Use an Arabic-friendly font such as:

```text
Cairo
```

or:

```text
Tajawal
```

Choose the most appropriate option based on the existing project.

Typography must remain highly readable at:

* desktop
* tablet
* mobile

Do not use excessively decorative typography.

---

# 4. RTL

The entire admin dashboard must support RTL correctly.

This includes:

* sidebar
* navigation
* tables
* forms
* dropdowns
* dialogs
* breadcrumbs
* pagination
* icons
* spacing
* alignment
* numbers
* price fields

Do not fake RTL by simply applying `text-align: right`.

The layout itself must be RTL-aware.

---

# 5. Dashboard shell

Design a strong dashboard shell containing:

```text
Sidebar
Top Header
Main Content
```

Desktop:

```text
┌───────────────────────────────────────────────┐
│ Header / Account / Actions                    │
├───────────────┬───────────────────────────────┤
│               │                               │
│ Sidebar       │ Main Content                  │
│               │                               │
│ Navigation    │                               │
│               │                               │
└───────────────┴───────────────────────────────┘
```

RTL-aware placement should feel natural for Arabic users.

Mobile should use an appropriate:

* drawer
* sheet
* compact navigation

Do not simply shrink the desktop sidebar.

---

# 6. Navigation

Use a clear hierarchy.

Suggested navigation:

```text
الرئيسية

الكتالوج
  التصنيفات
  التصنيفات الفرعية
  المنتجات

المحتوى
  البنرات

الحساب
  الحساب الشخصي
  تسجيل الخروج
```

Product Options should be accessible naturally through the product management experience.

Do not necessarily create a completely separate top-level "Options" page if a nested product editor provides a better UX.

The final information architecture should prioritize usability.

---

# 7. Dashboard home

Create a useful dashboard home without inventing backend data.

It may include:

* number of active categories
* number of active products
* number of active banners
* number of configurable products

Only use real Supabase data.

Do NOT create:

* fake revenue
* fake orders
* fake customers
* fake charts
* fake activity

The dashboard home should prioritize useful catalog management shortcuts.

For example:

```text
إضافة منتج
إضافة تصنيف
إضافة بنر
```

---

# 8. Categories page

Create a polished catalog management experience.

Use:

* searchable table/list
* active/inactive status
* image preview
* category type
* sort order
* actions

Actions:

```text
تعديل
تفعيل / تعطيل
حذف
```

Create/edit should use a clean form.

Avoid overly dense tables.

---

# 9. Subcategories

Support:

* category filtering
* search
* active status
* preorder status
* ordering
* image

Make the relationship with the parent category visually obvious.

For example:

```text
المطاعم
  └── أكل بيتي
```

`requires_preorder` should have a clear admin-friendly control.

---

# 10. Products page

This is one of the most important screens.

Design a high-quality product management table.

Display useful information:

```text
الصورة
المنتج
التصنيف
التصنيف الفرعي
السعر
الخيارات
الحالة
الإجراءات
```

Avoid overcrowding.

On mobile, transform rows into cards or stacked layouts.

Provide:

* search
* category filter
* subcategory filter
* active filter
* add product
* edit product

---

# 11. Product editor

Design the product form as a structured experience.

Suggested sections:

```text
معلومات المنتج
────────────────
اسم المنتج
الوصف
السعر
التصنيف
التصنيف الفرعي
الصورة
الحالة
الترتيب
```

Then:

```text
خيارات المنتج
────────────────
مجموعات الخيارات
```

Make the distinction between:

```text
السعر الأساسي
```

and:

```text
الزيادات الناتجة عن الاختيارات
```

very clear.

---

# 12. Product option groups

This area deserves special UX attention.

Design it as a nested editor.

Example:

```text
خيارات المنتج

┌──────────────────────────────────────────┐
│ الحجم                              ⋮     │
│ اختيار واحد                           │
│ مطلوب                                  │
│                                          │
│ ○ صغير                         +0 جنيه   │
│ ○ وسط                         +15 جنيه   │
│ ○ كبير                        +30 جنيه   │
│                                          │
│ [ + إضافة اختيار ]                      │
└──────────────────────────────────────────┘
```

Another group:

```text
┌──────────────────────────────────────────┐
│ الإضافات                          ⋮     │
│ متعدد الاختيارات                       │
│ اختار حتى 3                            │
│                                          │
│ □ كاتشب                         +5 جنيه  │
│ □ جبنة                          +15 جنيه │
│ □ صوص ثوم                       +10 جنيه │
│                                          │
│ [ + إضافة اختيار ]                      │
└──────────────────────────────────────────┘
```

The UI must make these concepts obvious:

* single vs multiple
* required vs optional
* minimum
* maximum
* price delta
* active/inactive
* order

---

# 13. Option group creation/editing

Use a modal, drawer, or inline editor depending on which provides the best UX.

Fields:

```text
اسم المجموعة
نوع الاختيار
الحد الأدنى
الحد الأقصى
الحالة
```

For:

```text
single
```

automatically guide the admin toward:

```text
max = 1
```

For:

```text
multiple
```

allow configurable limits.

Show contextual helper text.

Example:

```text
اختيار واحد
يسمح للعميل باختيار عنصر واحد فقط.
```

---

# 14. Option editor

Each option should be easy to edit.

Fields:

```text
اسم الاختيار
الزيادة على السعر
الحالة
الترتيب
```

Use clear price formatting:

```text
+15 جنيه
+0 جنيه
```

Do not hide the price delta in an advanced section.

The admin should immediately understand how the option affects the product price.

---

# 15. Live price preview

Where useful, show a small example of price composition.

Example:

```text
السعر الأساسي
100 جنيه

+ الحجم: كبير
+30 جنيه

+ الإضافات: جبنة
+15 جنيه

────────────────
145 جنيه
```

This is a UX aid only.

Do not duplicate authoritative pricing logic in a way that can diverge from the backend.

---

# 16. Banners

Create a visual banner-management interface.

Prefer:

* image preview
* title
* link target
* active status
* ordering
* edit/delete

If useful, use drag-and-drop ordering.

Do not implement drag-and-drop if it creates unnecessary complexity.

---

# 17. Forms

All forms must be:

* keyboard accessible
* clearly labeled
* RTL
* responsive
* touch friendly
* easy to scan

Use:

* grouped sections
* helper text
* inline validation
* clear required indicators
* appropriate input types

Primary action should remain visible and obvious.

---

# 18. Destructive actions

Delete actions should never be one-click destructive.

Use a confirmation dialog.

For dangerous operations, explain the impact.

Example:

```text
هل أنت متأكد من حذف المنتج؟

سيتم حذف مجموعات الخيارات والاختيارات المرتبطة به أيضًا.
```

Only show this message when the database behavior actually cascades that way.

---

# 19. Feedback

Every mutation should provide feedback.

Examples:

Success:

```text
تم حفظ المنتج بنجاح
```

Error:

```text
تعذر حفظ المنتج.
يرجى المحاولة مرة أخرى.
```

Duplicate:

```text
اسم الخيار مستخدم بالفعل داخل هذه المجموعة.
```

Use toast/snackbar for lightweight feedback and inline errors for form-specific problems.

---

# 20. Loading states

Avoid blank screens.

Use:

* skeletons
* loading indicators
* disabled mutation buttons
* optimistic feedback only when safe

Tables should have useful skeleton layouts rather than generic spinners whenever practical.

---

# 21. Empty states

Design intentional empty states.

Examples:

```text
لا توجد منتجات حتى الآن

ابدأ بإضافة أول منتج إلى الكتالوج.

[ + إضافة منتج ]
```

For options:

```text
لا توجد مجموعات خيارات لهذا المنتج.

أضف مجموعة مثل:
الحجم، الطعم، أو الإضافات.

[ + إضافة مجموعة ]
```

---

# 22. Responsive requirements

Optimize for:

```text
320px
375px
390px
414px
768px
1024px
1440px
```

Desktop should be highly productive.

Mobile should remain fully functional.

Do not allow:

* horizontal overflow
* tiny buttons
* inaccessible tables
* clipped dialogs
* hidden primary actions
* broken RTL layouts

---

# 23. Accessibility

Use:

* sufficient contrast
* visible focus states
* keyboard navigation
* semantic controls
* accessible labels
* accessible dialogs
* appropriate touch targets

Do not depend only on color to communicate state.

---

# 24. Visual system

Create reusable dashboard tokens for:

```text
colors
spacing
radius
shadows
typography
borders
control heights
```

Avoid arbitrary one-off values across screens.

Use a coherent design language.

---

# 25. Component strategy

Prefer reusable components such as:

```text
AdminShell
AdminSidebar
AdminHeader
PageHeader
DataTable
MobileDataCard
SearchInput
FilterBar
StatusBadge
EmptyState
ErrorState
ConfirmDialog
FormSection
ImageUploader
SortableList
OptionGroupEditor
OptionItemEditor
PriceDeltaInput
```

Do not create dozens of tiny components with no reuse value.

Reuse the existing UI library where appropriate.

---

# 26. Animation

Use subtle professional motion.

Good examples:

* sidebar transitions
* modal/drawer entrance
* row/card feedback
* toast animation
* reorder feedback
* button loading state

Avoid:

* excessive bouncing
* unnecessary page animations
* distracting effects
* slow transitions

Admin interfaces should feel fast.

---

# 27. Important technical constraint

This prompt is for UI/UX and dashboard implementation.

Do NOT:

* redesign the customer website
* change customer cart behavior
* change checkout behavior
* change WhatsApp logic
* replace Supabase
* recreate database tables
* weaken RLS
* expose service-role keys
* invent backend entities
* create fake analytics
* create fake orders

Use the approved SpecKit specification as the functional source of truth.

Use the existing Supabase database as the data source of truth.

---

# 28. Implementation rule

Before changing code:

1. Inspect the existing project.
2. Inspect the SpecKit specification.
3. Inspect existing UI components.
4. Inspect existing Supabase data-access functions.
5. Inspect current routing.
6. Reuse existing components where appropriate.
7. Preserve existing customer routes.

Then implement the dashboard incrementally.

---

# 29. Quality bar

The final dashboard should feel like a polished production product, not a generated CRUD page.

Prioritize:

1. usability
2. clarity
3. consistency
4. responsive behavior
5. accessibility
6. visual polish
7. performance

Do not sacrifice functionality for visual effects.

---

# 30. Final verification

Before declaring completion:

* TypeScript passes.
* Production build passes.
* Admin login works.
* Unauthorized access is blocked.
* Categories CRUD works.
* Subcategories CRUD works.
* Products CRUD works.
* Product option groups CRUD works.
* Product options CRUD works.
* Price delta editing works.
* Selection rules are represented correctly.
* Banners CRUD works.
* Image uploads work.
* RLS remains intact.
* No secret/service-role key is exposed.
* Customer website still works.
* All existing customer routes return successfully.
* No console errors.
* No horizontal overflow.
* RTL works correctly.
* Mobile layouts work.
* Desktop layouts work.
* Destructive operations require confirmation.

Do not declare success based only on visual inspection.
