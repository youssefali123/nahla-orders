import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as BackButton } from "./BackButton-Ba57ObJ6.mjs";
import { t as ProductGrid } from "./ProductCard-DiBzJFJ9.mjs";
import { t as Route } from "./category._categoryId.index-BCwYPVPs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._categoryId.index-DKKL8mf4.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { category, subcategories, products, optionFlags, error } = Route.useLoaderData();
	const router = useRouter();
	if (error || !category) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
		className: "mx-auto max-w-5xl space-y-5 px-3 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/12 text-2xl",
					"aria-hidden": true,
					children: category.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: category.image_url,
						alt: "",
						className: "h-full w-full object-cover"
					}) : category.icon ?? "🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "truncate text-xl font-extrabold",
					children: category.name
				})
			]
		}), subcategories.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4",
			children: subcategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/category/$categoryId/$subId",
				params: {
					categoryId: category.id,
					subId: sub.id
				},
				className: "flex flex-col items-center gap-2 rounded-2xl bg-card p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-accent/25 text-3xl",
					"aria-hidden": true,
					children: sub.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: sub.image_url,
						alt: "",
						className: "h-full w-full object-cover",
						loading: "lazy"
					}) : sub.icon ?? "🐝"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-bold leading-tight",
					children: sub.name
				})]
			}, sub.id))
		}) : products.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
			products,
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
					children: "مفيش منتجات في القسم ده حالياً."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 inline-flex text-sm font-bold text-primary-dark",
					children: "العودة للرئيسية"
				})
			]
		})]
	});
}
//#endregion
export { CategoryPage as component };
