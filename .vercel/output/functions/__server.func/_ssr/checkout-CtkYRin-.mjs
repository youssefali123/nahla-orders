import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { c as getProduct, m as useLiveProducts, p as useCart } from "./cart-By_kz0DL.mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
import { t as BackButton } from "./BackButton-Ba57ObJ6.mjs";
import { t as buildOrderMessage } from "./whatsapp-DMocFZPX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CtkYRin-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHAT_ID = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_zG8MNLkbp_2ScSDvpxPpiA_UCa80DXE",
	"VITE_SUPABASE_URL": "https://gcrcfsuydfmsaclwubzj.supabase.co",
	"VITE_TELEGRAM_BOT_TOKEN": "8653896427:AAHuJ9c_j0YqZ_LUMkoNhz9yvWfrwAiq6UM",
	"VITE_TELEGRAM_CHAT_ID": "1170515116"
}["VITE_TELEGRAM_CHAT_ID"];
var BOT_TOKEN = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_zG8MNLkbp_2ScSDvpxPpiA_UCa80DXE",
	"VITE_SUPABASE_URL": "https://gcrcfsuydfmsaclwubzj.supabase.co",
	"VITE_TELEGRAM_BOT_TOKEN": "8653896427:AAHuJ9c_j0YqZ_LUMkoNhz9yvWfrwAiq6UM",
	"VITE_TELEGRAM_CHAT_ID": "1170515116"
}["VITE_TELEGRAM_BOT_TOKEN"];
/**
* Sends the order message to the store's Telegram chat via the Bot API.
* Plain text (no parse mode) so Arabic copy and user input can never break
* message formatting. Throws when configuration is missing; returns a
* result object for API-level failures so callers never clear the cart
* on an unsent order.
*/
var sendOrderMessage = async (message) => {
	if (!BOT_TOKEN || !CHAT_ID) throw new Error("خدمة إرسال الطلبات غير مفعلة. أضف بيانات تيليجرام إلى ملف .env.local.");
	const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: CHAT_ID,
				text: message
			})
		});
		const data = await response.json();
		if (!response.ok || data.ok !== true) return {
			ok: false,
			error: data.description ?? `Telegram API error ${response.status}`
		};
		return { ok: true };
	} catch (error) {
		console.error("error sending message:", error);
		return {
			ok: false,
			error: error instanceof Error ? error.message : "تعذر إرسال الطلب."
		};
	}
};
function CheckoutPage() {
	const { items, clear } = useCart();
	const { live } = useLiveProducts();
	const navigate = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		address: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [sending, setSending] = (0, import_react.useState)(false);
	const orderable = live === null ? items : items.filter((i) => i.note || live.has(i.id));
	const baseOf = (item) => item.note ? item.price : live?.get(item.id)?.price ?? item.price;
	const unitOf = (item, selections = item.selectedOptions ?? []) => baseOf(item) + selections.reduce((n, s) => n + s.priceDelta, 0);
	const total = orderable.reduce((n, i) => i.note ? n : n + unitOf(i) * i.qty, 0);
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-3 pt-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-5xl",
				children: "🐝"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-xl font-extrabold",
				children: "السلة فاضية"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "أضف منتجات الأول وبعدين أكمل الطلب."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground",
				children: "ابدأ التسوق"
			})
		]
	});
	if (live !== null && orderable.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-3 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-extrabold",
				children: "بيانات التوصيل"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-2xl bg-card p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-5xl",
					children: "🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-bold",
					children: "المنتجات في السلة غير متاحة حالياً."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground",
					children: "العودة للرئيسية"
				})
			]
		})]
	});
	function validate() {
		const next = {};
		if (!form.name.trim()) next.name = "الاسم مطلوب";
		const phone = form.phone.trim();
		if (!phone) next.phone = "رقم الهاتف مطلوب";
		else if (!/^(\+?20)?0?1[0125][0-9]{8}$/.test(phone.replace(/[\s-]/g, ""))) next.phone = "اكتب رقم هاتف صحيح (مثال: 01012345678)";
		if (!form.address.trim()) next.address = "العنوان مطلوب";
		setErrors(next);
		return Object.keys(next).length === 0;
	}
	async function submit(e) {
		e.preventDefault();
		if (orderable.length === 0) {
			n.error("مفيش منتجات متاحة للطلب حالياً");
			return;
		}
		if (!validate()) {
			n.error("فضلاً راجع البيانات الناقصة");
			return;
		}
		setSending(true);
		try {
			const needsLive = orderable.filter((i) => !i.note && (i.selectedOptions ?? []).length > 0);
			const trees = /* @__PURE__ */ new Map();
			await Promise.all([...new Set(needsLive.map((i) => i.id))].map(async (id) => {
				const tree = await getProduct(id);
				if (tree) trees.set(id, tree);
			}));
			const priced = orderable.flatMap((item) => {
				if (item.note) return [item];
				const base = baseOf(item);
				if ((item.selectedOptions ?? []).length === 0) return [{
					...item,
					price: base
				}];
				const tree = trees.get(item.id);
				if (!tree || !tree.is_active) return [];
				const selections = (item.selectedOptions ?? []).flatMap((s) => {
					const group = tree.option_groups.find((g) => g.id === s.groupId && g.is_active);
					const option = group?.options.find((o) => o.id === s.optionId && o.is_active);
					if (!group || !option) return [];
					return [{
						groupId: group.id,
						groupName: group.name,
						optionId: option.id,
						optionName: option.name,
						priceDelta: Number(option.price_delta)
					}];
				});
				return [{
					...item,
					name: tree.name,
					price: tree.price,
					selectedOptions: selections
				}];
			});
			if (priced.filter((i) => !i.note).length === 0 && priced.length > 0 && orderable.some((i) => !i.note)) {
				n.error("الاختيارات المحفوظة لم تعد متاحة، راجع السلة");
				setSending(false);
				return;
			}
			const liveTotal = priced.reduce((n, i) => i.note ? n : n + (i.price + (i.selectedOptions ?? []).reduce((m, s) => m + s.priceDelta, 0)) * i.qty, 0);
			const result = await sendOrderMessage(buildOrderMessage(priced, form, liveTotal));
			if (!result.ok) {
				n.error(result.error || "تعذر إرسال الطلب، حاول تاني");
				setSending(false);
				return;
			}
			clear();
			navigate({ to: "/order-success" });
		} catch (error) {
			console.error(error);
			n.error("تعذر تأكيد الأسعار الحالية، حاول تاني");
			setSending(false);
		}
	}
	const field = "h-12 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-4 px-3 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-extrabold",
				children: "بيانات التوصيل"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-2xl bg-card p-4 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "name",
								className: "mb-1 block text-sm font-bold",
								children: "الاسم"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "name",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								placeholder: "اكتب اسمك",
								className: field
							}),
							errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs font-semibold text-destructive",
								children: errors.name
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "phone",
								className: "mb-1 block text-sm font-bold",
								children: "رقم الهاتف"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "phone",
								inputMode: "tel",
								value: form.phone,
								onChange: (e) => setForm({
									...form,
									phone: e.target.value
								}),
								placeholder: "01012345678",
								className: field
							}),
							errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs font-semibold text-destructive",
								children: errors.phone
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "address",
								className: "mb-1 block text-sm font-bold",
								children: "العنوان"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "address",
								rows: 3,
								value: form.address,
								onChange: (e) => setForm({
									...form,
									address: e.target.value
								}),
								placeholder: "اكتب عنوانك بالتفصيل",
								className: "w-full resize-none rounded-xl border border-border bg-muted p-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card"
							}),
							errors.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs font-semibold text-destructive",
								children: errors.address
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-2xl bg-card p-4 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-extrabold",
							children: "ملخص الطلب"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: orderable.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: item.name
									}), item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: item.note
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-xs text-muted-foreground",
										children: ["× ", item.qty]
									}), (item.selectedOptions ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: (item.selectedOptions ?? []).map((s) => `${s.groupName}: ${s.optionName}`).join("، ")
									})] })]
								}), !item.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 font-bold",
									children: [
										unitOf(item) * item.qty,
										" ",
										site.currency
									]
								})]
							}, item.key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border pt-3 text-base font-extrabold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الإجمالي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-primary-dark",
								children: [
									total,
									" ",
									site.currency
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: sending,
					className: "h-14 w-full rounded-xl bg-primary py-4 text-lg font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
					children: sending ? "جاري إرسال الطلب..." : "تأكيد الطلب"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "مفيش دفع أونلاين — الطلب هيتم إرساله مباشرة لفريق نحلة وهنأكده معاك."
				})
			]
		})]
	});
}
//#endregion
export { CheckoutPage as component };
