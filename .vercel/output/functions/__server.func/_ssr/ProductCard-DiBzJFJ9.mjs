import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShoppingCart, d as Plus, p as Minus } from "../_libs/lucide-react.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { p as useCart } from "./cart-By_kz0DL.mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-DiBzJFJ9.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, hasOptions = false }) {
	const { qtyOf, add, increase, decrease } = useCart();
	const qty = qtyOf(product.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-shadow hover:shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/product/$productId",
			params: { productId: product.id },
			className: "relative block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid aspect-square place-items-center overflow-hidden bg-muted text-5xl sm:text-6xl",
				children: product.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image_url,
					alt: "",
					className: "h-full w-full object-cover",
					loading: "lazy"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					children: product.icon ?? "🐝"
				})
			}), hasOptions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-2 right-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-soft",
				children: "قابل للتخصيص ✨"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-1 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$productId",
					params: { productId: product.id },
					className: "line-clamp-2 text-sm font-bold leading-snug",
					children: product.name
				}),
				product.unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: product.unit
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-auto pt-1 text-base font-extrabold text-primary-dark",
					children: [
						product.price,
						" ",
						site.currency
					]
				}),
				hasOptions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$productId",
					params: { productId: product.id },
					className: "mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]",
					children: "خصص وأضف ✨"
				}) : qty === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						add({
							id: product.id,
							name: product.name,
							price: product.price,
							icon: product.icon ?? "🐝",
							image: product.image_url
						});
						n.success(`تمت إضافة ${product.name}  للسلة 🐝`);
					},
					className: "mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }), "أضف للسلة"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex h-11 items-center justify-between rounded-xl bg-primary px-1 text-primary-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "زيادة",
							onClick: () => increase(product.id),
							className: "grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-white/15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-extrabold",
							children: qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "تقليل",
							onClick: () => decrease(product.id),
							className: "grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-white/15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
						})
					]
				})
			]
		})]
	});
}
function ProductGrid({ products, optionFlags = {} }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4",
		children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
			product: p,
			hasOptions: optionFlags[p.id] ?? false
		}, p.id))
	});
}
//#endregion
export { ProductGrid as t };
