import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, f as Plus, m as Minus } from "../_libs/lucide-react.mjs";
import { h as useLiveProducts, m as useCart } from "./cart-uvRnG2bT.mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
import { t as BackButton } from "./BackButton-Ba57ObJ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CO3qzPhG.js
var import_jsx_runtime = require_jsx_runtime();
function isUnavailable(item, live) {
	return !item.note && live !== null && !live.has(item.id);
}
function liveUnitPrice(item, live) {
	if (item.note) return 0;
	return (live?.get(item.id)?.price ?? item.price) + (item.selectedOptions ?? []).reduce((n, s) => n + s.priceDelta, 0);
}
function CartPage() {
	const { items, increase, decrease, remove } = useCart();
	const { live } = useLiveProducts();
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-3 pt-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/favicon.png",
				alt: site.name,
				className: "mx-auto h-32 w-32 rounded-3xl object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-xl font-extrabold",
				children: "السلة لسه فاضية 🐝"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "اختار اللي نفسك فيه وإحنا نوصلّهولك."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90",
				children: "ابدأ التسوق"
			})
		]
	});
	const total = items.reduce((n, i) => isUnavailable(i, live) ? n : n + liveUnitPrice(i, live) * i.qty, 0);
	const orderable = items.some((i) => !isUnavailable(i, live));
	const hasCustomOrder = items.some((i) => !!i.note);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-4 px-3 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-extrabold",
					children: "السلة"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: items.map((item) => {
					const unavailable = isUnavailable(item, live);
					const price = liveUnitPrice(item, live);
					const selections = item.selectedOptions ?? [];
					const visual = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-3xl",
						"aria-hidden": true,
						children: item.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.image,
							alt: "",
							className: "h-full w-full object-cover",
							loading: "lazy"
						}) : item.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-bold group-hover:text-primary-dark group-hover:underline",
								children: item.name
							}),
							item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 line-clamp-3 text-xs text-muted-foreground",
								children: item.note
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									price,
									" ",
									site.currency
								]
							}),
							selections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground",
								children: selections.map((s) => `${s.groupName}: ${s.optionName}`).join("، ")
							}),
							unavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive",
								children: "غير متاح حالياً"
							})
						]
					})] });
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-card p-3 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3",
							children: [item.note || unavailable ? visual : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$productId",
								params: { productId: item.id },
								"aria-label": item.name,
								className: "contents group",
								children: visual
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "حذف",
								onClick: () => remove(item.key),
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" })
							})]
						}), !item.note && !unavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-11 items-center gap-1 rounded-xl bg-muted px-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "زيادة",
										onClick: () => increase(item.key),
										className: "grid h-9 w-9 place-items-center rounded-lg bg-card shadow-soft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-9 text-center font-extrabold",
										children: item.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "تقليل",
										onClick: () => decrease(item.key),
										className: "grid h-9 w-9 place-items-center rounded-lg bg-card shadow-soft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-extrabold text-primary-dark",
								children: [
									item.qty * price,
									" ",
									site.currency
								]
							})]
						})]
					}, item.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-3 space-y-3 rounded-2xl bg-card p-4 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-base font-extrabold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["إجمالي الطلب", hasCustomOrder ? " (بدون الطلب المخصص)" : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-primary-dark",
							children: [
								total,
								" ",
								site.currency
							]
						})]
					}),
					hasCustomOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-accent/20 p-2.5 text-center text-xs font-bold text-foreground",
						children: "✍️ سعر الطلب الخاص يتم تحديده لاحقًا"
					}),
					orderable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout",
						className: "flex h-13 w-full items-center justify-center rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90",
						children: "إتمام الطلب"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-muted p-3 text-center text-sm font-bold text-muted-foreground",
						children: "كل المنتجات في السلة غير متاحة حالياً."
					})
				]
			})
		]
	});
}
//#endregion
export { CartPage as component };
