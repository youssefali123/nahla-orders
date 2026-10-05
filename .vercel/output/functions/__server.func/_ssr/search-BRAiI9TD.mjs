import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ProductGrid } from "./ProductCard-DiBzJFJ9.mjs";
import { t as Route } from "./search-DOVwMnF7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-BRAiI9TD.js
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q } = Route.useSearch();
	const { results, optionFlags, error } = Route.useLoaderData();
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-4 px-3 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "text-xl font-extrabold",
			children: ["نتائج البحث عن: ", q]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-card p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-4xl",
					children: "🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-bold",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => router.invalidate(),
					className: "mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground",
					children: "حاول تاني"
				})
			]
		}) : results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
			products: results,
			optionFlags
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-card p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-4xl",
					children: "🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-bold",
					children: "مفيش نتائج مطابقة"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "جرّب اسم تاني، أو اطلبه كطلب مخصص."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/custom-order",
					className: "mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground",
					children: "اطلب طلب مخصص"
				})
			]
		})]
	});
}
//#endregion
export { SearchPage as component };
