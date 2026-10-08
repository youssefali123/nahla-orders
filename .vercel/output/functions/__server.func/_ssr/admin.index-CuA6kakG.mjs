import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as dashboardCounts } from "./button-B0qzXPB4.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Image, c as Shapes, d as Plus, o as ShoppingBag } from "../_libs/lucide-react.mjs";
import { n as AdminShell, r as PageHeader, t as AdminGuard } from "./AdminShell-JKfXsZUA.mjs";
import { r as ErrorState } from "./DataTable-DIKUwHNX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-CuA6kakG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHomePage() {
	const [counts, setCounts] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		setError(false);
		try {
			setCounts(await dashboardCounts());
		} catch {
			setError(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const cards = counts ? [
		{
			label: "تصنيفات مفعلة",
			value: counts.categories,
			to: "/admin/categories",
			icon: Shapes
		},
		{
			label: "منتجات مفعلة",
			value: counts.products,
			to: "/admin/products",
			icon: ShoppingBag
		},
		{
			label: "بنرات مفعلة",
			value: counts.banners,
			to: "/admin/banners",
			icon: Image
		},
		{
			label: "منتجات قابلة للتخصيص",
			value: counts.configurable,
			to: "/admin/products",
			icon: ShoppingBag
		}
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "الرئيسية",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "نظرة عامة",
				description: "أرقام حقيقية من الكتالوج الحالي."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: load }) : !counts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				"aria-busy": "true",
				"aria-label": "جاري التحميل",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: card.to,
					className: "rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, {
							className: "h-6 w-6 text-primary",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-3xl font-extrabold text-primary-dark",
							children: card.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-bold text-muted-foreground",
							children: card.label
						})
					]
				}, card.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-extrabold text-primary-dark",
					children: "إجراءات سريعة"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2 sm:grid-cols-3",
					children: [
						{
							to: "/admin/products",
							label: "إضافة منتج"
						},
						{
							to: "/admin/categories",
							label: "إضافة تصنيف"
						},
						{
							to: "/admin/banners",
							label: "إضافة بنر"
						}
					].map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: action.to,
						className: "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-4 w-4",
							"aria-hidden": true
						}), action.label]
					}, action.label))
				})]
			})
		]
	}) });
}
//#endregion
export { AdminHomePage as component };
