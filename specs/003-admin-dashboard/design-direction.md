# Admin Dashboard — Design Direction

**Feature**: `003-admin-dashboard` | **Date**: 2026-10-03 | **Status**: Design only — do not implement
**Sources**: `src/mds/dashboard.md` (product brief), `src/mds/ui-diraction.md` (this direction's charter),
`specs/003-admin-dashboard/spec.md` + `plan.md` + `contracts/admin-access.md` (functional truth),
ui-ux-pro-max skill searches verified 2026-10-03 (design-system, table/search UX, form validation, confirm dialogs, skeletons).

> An implementation agent must be able to build the dashboard from this document plus the
> SpecKit spec/plan without re-deciding visual or UX questions.

## 0. Decisions where dataset guidance was overridden by project rules

The skill dataset suggested a dark glassmorphism system with Fira Sans. That is **rejected**:
the user charter fixes a light green brand theme and Cairo type, and the repo already ships a
light oklch theme + Cairo + lucide-react. Dataset structural guidance (tables, validation,
confirms, skeletons) is adopted; its palette/typography output is not.

---

## 1. Design system

### 1.1 Tokens (extend `src/styles.css`, no new file)

| Token | Value | Role |
|---|---|---|
| `--background` | `#F4FAF6` (existing) | app background |
| `--card` | `#FFFFFF` (existing) | surfaces |
| `--primary` | `#4CAF50` equivalent (existing oklch) | primary actions, active states, success |
| `--accent` / `--secondary` | `#FFC107` equivalent (existing) | sparing: attention, secondary highlights, status dots |
| `--primary-dark` / headings | `#087F3E` equivalent (existing) | headings, strong emphasis |
| `--sidebar` (new) | Dark Teal `#0F3B3B` bg, white text | navigation contrast block |
| `--radius` | `1rem` base (existing scale) | cards `rounded-2xl`, controls `rounded-xl`, pills `rounded-full` |
| `--shadow-soft` / `--shadow-card` | existing | resting / elevated surfaces |
| Control heights | `h-10` rows, `h-11` buttons, `h-12` inputs (existing scale) | touch-friendly ≥44px targets |
| Spacing rhythm | 4px base; section gaps `gap-3/4/6`, page padding `p-3 → p-6` up | consistent density |
| Font | Cairo (already loaded in `__root.tsx`), weights 400/600/700/800 | single family everywhere, incl. numbers/prices |

Green discipline: green = primary actions, active nav, success, in-stock/active states.
Yellow = warnings, "needs attention" badges, secondary highlights only. Destructive red
reserved for delete actions and error text. Never flood surfaces with saturated green.

### 1.2 Type scale (Cairo, RTL)

Page title `text-xl font-extrabold` · section title `text-base/sm font-extrabold` ·
body `text-sm` · meta/hints `text-xs text-muted-foreground` · prices/totals
`font-extrabold text-primary-dark` (tabular figures via `font-variant-numeric`).

### 1.3 Icons

lucide-react exclusively for admin chrome (already the project icon set — do not
introduce Phosphor/Heroicons). Product/category emoji visuals are **content imagery**
rendered inside image slots, never navigation or control icons. Decorative icons
beside visible text get `aria-hidden`; icon-only buttons get `aria-label`.

## 2. Layout specification

```
Desktop (lg+):  ┌──────────────────────────────────────────────┐
                │ Header (account, actions)                    │
                ├──────────────────────────────┬───────────────┤
                │ Main Content                 │ Sidebar (RIGHT│
                │                              │ in RTL)       │
                └──────────────────────────────┴───────────────┘
```

- **Sidebar (desktop)**: fixed RIGHT side (RTL start), Dark Teal `#0F3B3B`, width
  `w-64`, full height, own scroll; contains logo block, nav hierarchy, manager
  email footer + logout. Collapsible to icons at `lg` via toggle (persist in
  localStorage); tooltips on collapsed icons.
- **Header**: sticky top, white/blur, page title + breadcrumb (desktop), search
  shortcut (desktop), hamburger (mobile only), account menu.
- **Main**: max-width `max-w-6xl`, padding `p-3 md:p-6`, vertical rhythm `space-y-4/6`.
- **Mobile (<lg)**: sidebar becomes a right-side drawer (overlay + scrim, focus
  trap, Esc closes, returns focus to hamburger); bottom padding clears sticky
  action bars; NO shrunken sidebar, NO horizontal overflow ever.
- **Breakpoints**: design to 360px baseline; verify 320 / 375 / 390 / 414 / 768 /
  1024 / 1440. Tailwind `sm/md/lg/xl` only — no custom breakpoints.
- **RTL**: `dir="rtl"` inherited; sidebar right, forward chevrons point LEFT,
  back arrows point RIGHT; never fake RTL with `text-align` alone — flex/grid
  order, padding-inline, and icon direction all follow logical properties.

## 3. Navigation specification

```
الرئيسية (/admin)
الكتالوج
  التصنيفات (/admin/categories)
  التصنيفات الفرعية (/admin/subcategories)
  المنتجات (/admin/products)
المحتوى
  البنرات (/admin/banners)
الحساب
  الحساب الشخصي (/admin/account)
  تسجيل الخروج (action)
```

- Options management lives INSIDE the product editor (`/admin/products/$productId`);
  no top-level options page.
- Active states: primary-green pill background + bold label + right-edge indicator
  bar (non-color redundant cue). Collapsible groups (الكتالوج/المحتوى/الحساب) with
  chevron rotation; state persists per session.
- Icons (lucide): الرئيسية `LayoutDashboard`, التصنيفات `Shapes`, الفرعية
  `ListTree`, المنتجات `ShoppingBag`, البنرات `Image`, الحساب `User`, logout
  `LogOut`, add `Plus`, search `Search`, edit `Pencil`, delete `Trash2`,
  activate/deactivate `Power`, reorder `GripVertical`, upload `Upload`.
- Badges: counts (e.g. inactive items) as text badges, never color-only dots.

## 4. Dashboard home

Grid of 4 live-count cards (active categories / products / banners /
configurable products), each: big Cairo numeral, label, icon, link to its list.
Below: "إجراءات سريعة" — three primary buttons (إضافة منتج / تصنيف / بنر).
 forbidden: revenue, orders, customers, charts, activity feeds, placeholders.
Empty-catalog guidance card appears when counts are zero, linking to first steps.

## 5. CRUD pages (categories, subcategories, products, banners)

Shared `DataTable` pattern (desktop) → `MobileDataCard` pattern (<md):

| Concern | Desktop | Mobile |
|---|---|---|
| Layout | table: checkbox-free rows, thumbnail 40px, name+sub line, type/status/order columns, sticky actions column | stacked cards: thumb + name + status badge top, meta rows, full-width action row |
| Search | `SearchInput` in FilterBar, debounced 300ms, server-filtered | same, full width |
| Filters | `FilterBar` chips/selects (parent, status, preorder) | horizontal scroll chip row |
| Ordering | `sort_order` editable number in edit form; optional up/down row buttons | same via edit form (no drag — rejected as unnecessary complexity) |
| Row actions | icon buttons: edit / power / delete, `aria-label`s | same, ≥44px targets |
| States | skeleton rows matching column layout (verified guidance: stable skeleton + `aria-busy`) | skeleton cards |
| Empty | `EmptyState`: illustration dot, title (e.g. «لا توجد منتجات حتى الآن»), guidance line, primary CTA button | same, centered |
| Errors | `ErrorState` card: «حصل خطأ، حاول تاني.» + retry button refetching | same |

Products table columns: الصورة / المنتج / التصنيف / الفرعي / السعر / الخيارات
(flag badge «قابل للتخصيص ✨» or —) / الحالة / الإجراءات. Subcategory rows show
parent breadcrumb chip («المطاعم / أكل بيتي») and a preorder switch with label.

## 6. Product editor (`/admin/products/$productId`, incl. `new`)

Two stacked `FormSection` cards:

1. **معلومات المنتج**: name (required), description textarea, base price
   (numeric input, `inputMode="decimal"`, جنيه suffix), category select →
   subcategory select narrows to chosen parent, image uploader with preview,
   unit text, `is_active` switch, `is_featured` switch, sort_order stepper.
2. **خيارات المنتج**: list of `OptionGroupEditor` cards (see §7) + «+ إضافة
   مجموعة» dashed dropzone button; per-brief empty state suggesting
   («الحجم، الطعم، أو الإضافات»).

Sticky bottom action bar (mobile) / right-aligned actions (desktop): primary
«حفظ المنتج» (loading spinner state, disabled while saving), ghost «إلغاء»
with dirty-form guard («لديك تغييرات غير محفوظة — تجاهل؟»).

## 7. Product options editor UX

Group card anatomy (top→bottom): drag grip + group name (heading) + `⋮` menu
(rename/duplicate/deactivate/delete) · meta line: type pill («اختيار واحد» /
«متعدد الاختيارات») + required pill («مطلوب» when min>0) + limit hint
(«اختار حتى 3») · option rows · «+ إضافة اختيار» ghost button.

- **Option row**: name input, `PriceDeltaInput` (numeric, always-visible suffix
  `+15 جنيه` / `+0 جنيه` / `−10 جنيه`), status dot+label, order steppers,
  delete icon. Never hide the delta in an advanced section.
- **Group dialog** (create/edit): name (required), type radio cards with helper
  text («اختيار واحد — يسمح للعميل باختيار عنصر واحد فقط.»), min stepper,
  max stepper-or-empty (single auto-suggests max=1 with one-tap «تعيين 1»
  chip), status switch. Invalid combos rejected inline before save; DB CHECK
  errors mapped to the same inline slots plus the duplicate message
  «اسم الخيار مستخدم بالفعل داخل هذه المجموعة.»
- **Price preview card** (display-only, labeled «معاينة — للمساعدة فقط»):
  base line + picked-example lines + bold total (100 + 30 + 15 = 145 pattern).

## 8. Forms pattern

Labels above inputs (`text-sm font-bold` + red `*` for required), helper text
below (`text-xs muted`), errors below in destructive semibold with
`aria-describedby` wiring; on failed submit show an error summary card at form
top, move focus to its heading, link each item to its field (verified
guidance); validate on blur, re-validate on change after first error. Selects:
native-styled custom popover; switches for booleans with text labels
(مفعل/معطل); steppers for order/min/max; image uploader: preview tile +
progress bar + retry on failure (failed upload blocks save). Primary action
always visible (sticky bar on mobile).

## 9. Destructive actions

Two-step confirm dialog (title, impact paragraph quoting REAL cascade, e.g.
«سيتم حذف مجموعات الخيارات والاختيارات المرتبطة به أيضًا.» — shown only
where the schema actually cascades; cancel/confirm, confirm in destructive
red, disabled + spinner while deleting, Esc/backdrop = cancel, focus trapped
and returned). No one-click deletes anywhere. Toast confirms result.

## 10. States & feedback

- Loading: layout-shaped skeletons (`aria-busy`), no spinners-as-content, no
  layout flash (verified guidance: stable skeleton, no flicker).
- Success/error: sonner toasts — success («تم حفظ المنتج بنجاح»), error
  («تعذر حفظ المنتج. يرجى المحاولة مرة أخرى.» + retry where applicable).
- Saving/disabled: buttons show spinner + disabled; forms disable during flight.
- Unauthorized: signed-out → login redirect; non-manager → access-denied card
  (no data rendered).
- Auth: login card centered (email/password, password-manager + paste allowed,
  show/hide toggle, Arabic errors); session-expiry returns to login preserving
  drafts where practical.

## 11. Motion rules

150–250ms ease-out transitions (hover, press `active:scale`, drawer slide,
dialog fade/scale, toast slide, reorder fade). No page-level animation, no
bounce, no parallax. `prefers-reduced-motion`: instant state changes, static
skeletons.

## 12. Accessibility rules

Keyboard-complete flows; visible `:focus-visible` ring on all interactives;
semantic landmarks (`nav/main/dialog`), labeled dialogs with trapping;
`aria-pressed` on toggles/pickers, `aria-selected` where applicable; status
never color-only (icon + text); contrast ≥4.5:1 body text on all surfaces;
44px minimum targets; `aria-hidden` decorative icons; form labels/hints/errors
programmatically linked; reduced-motion and 200% text scaling without breakage.

## 13. Component inventory (maps to implementation)

Reuse `src/components/ui/`: button, input, textarea, select, checkbox,
radio-group, switch, dialog, drawer, dropdown-menu, badge, card, table,
pagination, skeleton, sonner, label, form, popover, breadcrumb, avatar.
New in `src/components/admin/`: AdminShell, AdminSidebar, AdminHeader,
PageHeader, DataTable, MobileDataCard, SearchInput, FilterBar, StatusBadge,
EmptyState, ErrorState, ConfirmDialog, FormSection, ImageUploader,
SortableList(simple steppers), OptionGroupEditor, OptionItemEditor,
PriceDeltaInput, PricePreview. No other new shared components without reuse
justification.

## 14. Implementation guidance

- Routes: `src/routes/admin/` — `login.tsx`, `index.tsx` (home), `categories.tsx`,
  `subcategories.tsx`, `products.tsx`, `products_.$productId.tsx` (editor, `new`
  supported), `banners.tsx`, `account.tsx`; all but login behind `AdminGuard`
  (session + `admin_profiles` check; RLS remains the enforcer).
- Data: extend `src/lib/admin.ts` per `contracts/admin-access.md`; no changes
  to `catalog.ts`, customer routes, cart, checkout, or styles foundation.
- Images: upload-then-save; store returned public URL; per-entity prefixes.
- Verification (binds implementer): `tsc` + production build clean; three-actor
  gate proofs; every CRUD reflected on the customer site; uploads/deltas/rules
  proven; advisors re-checked; zero console errors; 320→1440px + keyboard pass;
  customer routes byte-identical in behavior.
