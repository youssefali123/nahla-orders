import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as useRouter, X as notFound, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShoppingCart, d as Plus, p as Minus } from "../_libs/lucide-react.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { p as useCart } from "./cart-By_kz0DL.mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
import { t as BackButton } from "./BackButton-Ba57ObJ6.mjs";
import { t as Route } from "./product._productId-BbseULJC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._productId-9OUpjPjx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { product, error } = Route.useLoaderData();
	const router = useRouter();
	const { add } = useCart();
	const [qty, setQty] = (0, import_react.useState)(1);
	const [picked, setPicked] = (0, import_react.useState)({});
	const [triedSubmit, setTriedSubmit] = (0, import_react.useState)(false);
	const groups = product?.option_groups ?? [];
	function toggleOption(group, optionId) {
		setPicked((prev) => {
			const current = prev[group.id] ?? [];
			if (group.type === "single") return {
				...prev,
				[group.id]: current.includes(optionId) ? [] : [optionId]
			};
			if (current.includes(optionId)) return {
				...prev,
				[group.id]: current.filter((id) => id !== optionId)
			};
			if (group.max_selections !== null && current.length >= group.max_selections) {
				n.error(`اختار بحد أقصى ${group.max_selections} من ${group.name}`);
				return prev;
			}
			return {
				...prev,
				[group.id]: [...current, optionId]
			};
		});
	}
	function groupError(group) {
		if (!triedSubmit || group.min_selections <= 0) return null;
		return (picked[group.id] ?? []).length >= group.min_selections ? null : `اختار ${group.min_selections === 1 ? "اختيار واحد" : `بحد أدنى ${group.min_selections}`} من ${group.name}`;
	}
	const selectionValid = groups.every((g) => (picked[g.id] ?? []).length >= g.min_selections);
	const selectedOptions = groups.flatMap((g) => g.options.filter((o) => (picked[g.id] ?? []).includes(o.id)).map((o) => ({
		groupId: g.id,
		groupName: g.name,
		optionId: o.id,
		optionName: o.name,
		priceDelta: Number(o.price_delta)
	})));
	const unitPrice = (product?.price ?? 0) + selectedOptions.reduce((n, s) => n + s.priceDelta, 0);
	if (error || !product) {
		if (!error) throw notFound();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-3 pt-10 text-center",
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
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => router.invalidate(),
					className: "mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground",
					children: "حاول تاني"
				})
			]
		});
	}
	if (!product.is_active) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-3 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl bg-card p-8 text-center shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-5xl",
					children: "🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-xl font-extrabold",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "المنتج غير متاح حالياً."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground",
					children: "العودة للرئيسية"
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-3 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-3xl bg-card shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid aspect-square w-full place-items-center overflow-hidden bg-muted text-[7rem] sm:aspect-[16/9]",
				"aria-hidden": true,
				children: product.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image_url,
					alt: "",
					className: "h-full w-full object-cover"
				}) : product.icon ?? "🐝"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-extrabold",
						children: product.name
					}),
					product.unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: product.unit
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-2xl font-extrabold text-primary-dark",
						children: [
							product.price,
							" ",
							site.currency
						]
					}),
					product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: product.description
					}),
					groups.map((group) => {
						const err = groupError(group);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-muted p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-extrabold",
										children: [group.name, group.min_selections > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: " *"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: group.type === "single" ? group.min_selections > 0 ? "اختار واحد" : "اختياري" : group.max_selections !== null ? `اختار حتى ${group.max_selections}` : "اختار اللي يعجبك"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: group.options.map((option) => {
										const active = (picked[group.id] ?? []).includes(option.id);
										const delta = Number(option.price_delta);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toggleOption(group, option.id),
											"aria-pressed": active,
											className: `inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-bold transition-all active:scale-95 ${active ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-foreground shadow-soft hover:bg-card"}`,
											children: [option.name, delta !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs opacity-80",
												children: delta > 0 ? `+${delta}` : delta
											})]
										}, option.id);
									})
								}),
								err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-xs font-semibold text-destructive",
									children: err
								})
							]
						}, group.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold",
							children: "الكمية"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-12 items-center gap-1 rounded-xl bg-muted px-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "زيادة",
									onClick: () => setQty((q) => q + 1),
									className: "grid h-10 w-10 place-items-center rounded-lg bg-card shadow-soft",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-10 text-center text-base font-extrabold",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "تقليل",
									onClick: () => setQty((q) => Math.max(1, q - 1)),
									className: "grid h-10 w-10 place-items-center rounded-lg bg-card shadow-soft",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-1 text-base font-extrabold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الإجمالي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-primary-dark",
							children: [
								unitPrice * qty,
								" ",
								site.currency
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 pt-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (!selectionValid) {
									setTriedSubmit(true);
									n.error("فضلاً أكمل الاختيارات المطلوبة");
									return;
								}
								add({
									id: product.id,
									name: product.name,
									price: product.price,
									icon: product.icon ?? "🐝",
									image: product.image_url,
									selectedOptions
								}, qty);
								n.success("تمت إضافة المنتج للسلة 🐝");
							},
							className: "inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-5 w-5" }), "أضف للسلة"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cart",
							className: "inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-base font-bold text-accent-foreground transition-opacity hover:opacity-90",
							children: "السلة"
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProductPage as component };
