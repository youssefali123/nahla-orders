import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ChevronLeft, i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as BackButton } from "./BackButton-Ba57ObJ6.mjs";
import { t as Route } from "./category._categoryId._subId-DooL0cV0.mjs";
import { t as ProductGrid } from "./ProductCard-C3gilX9N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._categoryId._subId-CNRTx4EB.js
var import_jsx_runtime = require_jsx_runtime();
function Notice({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-2 rounded-2xl bg-accent/25 p-3 text-sm font-semibold text-accent-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary-dark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text })]
	});
}
function SubcategoryPage() {
	const { category, sub, products, optionFlags, error } = Route.useLoaderData();
	const router = useRouter();
	if (error || !category || !sub) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-3 pt-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-5xl",
				children: "🐝"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-bold",
				children: error ?? "حصل خطأ، حاول تاني."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => router.invalidate(),
				className: "mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground",
				children: "حاول تاني"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-4 px-3 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 text-xs font-semibold text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$categoryId",
							params: { categoryId: category.id },
							className: "hover:text-foreground",
							children: category.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: sub.name
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-xl font-extrabold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2",
					"aria-hidden": true,
					children: sub.icon ?? "🐝"
				}), sub.name]
			}),
			sub.requires_preorder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { text: "طلبات الأكل البيتي يجب طلبها قبلها بيوم." }),
			products.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
				products,
				optionFlags
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-card p-8 text-center shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-4xl",
					children: "🐝"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-bold",
					children: "مفيش منتجات في القسم ده حالياً."
				})]
			})
		]
	});
}
//#endregion
export { SubcategoryPage as component };
