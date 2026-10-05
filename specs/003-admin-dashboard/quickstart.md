# Quickstart: Admin Dashboard

**Feature**: `003-admin-dashboard` | **Date**: 2026-10-03

Proves the dashboard end-to-end. Details in `data-model.md` and
`contracts/admin-access.md`.

## Prerequisites

- Catalog + options phases live; `nahla-images` bucket with admin writes.
- First manager bootstrapped: auth user created, `INSERT INTO
  admin_profiles (id)` executed (documented manual step).
- Dev server running; a second browser context (or incognito) for
  unauthorized checks.

## 1. Gate holds for all three actors

- Expected: manager signs in at `/admin/login`, reaches `/admin`, persists
  across reload, signs out cleanly. Anonymous route hits redirect to login
  with nothing exposed. Signed-in non-manager sees access-denied; every
  write attempt fails. No self-registration path exists anywhere.

## 2. Full catalog task in one session

- Expected: create category → subcategory (preorder on) → product (required
  single + capped multiple, deltas set) → banner (uploaded image); each
  appears correctly on the customer site per active flags; duplicate names
  rejected with the specified message; price preview matches the customer
  total; deactivations hide content; cascade deletes confirm truthfully.

## 3. Home is honest, uploads work

- Expected: every home number equals a live count query; shortcuts jump to
  creation screens; uploaded images serve publicly; failed uploads block
  saves with retry.

## 4. Universal usability + untouched storefront

```bash
npx tsc --noEmit -p tsconfig.json   # 0 errors
npm run build                        # production build passes
```

- Expected: core flows keyboard-complete at 320px and 1440px; no overflow,
  no blank screens, visible focus, non-color cues; zero console errors;
  all customer routes return successfully with identical behavior.

## 5. Quality gates

- Expected: type check and build pass; RLS posture unchanged (advisors
  re-checked); no secrets in code or bundle; destructive actions all gated
  by confirmations.
