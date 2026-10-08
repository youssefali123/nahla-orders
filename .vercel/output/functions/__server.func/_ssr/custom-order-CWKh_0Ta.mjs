import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { p as useCart } from "./cart-By_kz0DL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/custom-order-CWKh_0Ta.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomOrderPage() {
	const [text, setText] = (0, import_react.useState)("");
	const { add } = useCart();
	const navigate = useNavigate();
	function submit(e) {
		e.preventDefault();
		const note = text.trim();
		if (!note) {
			n.error("اكتب طلبك الأول 🐝");
			return;
		}
		add({
			id: `custom-${Date.now()}`,
			name: "طلب مخصص",
			price: 0,
			icon: "✍️",
			note
		});
		n.success("تمت إضافة طلبك المخصص للسلة 🐝");
		setText("");
		navigate({ to: "/cart" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl px-3 pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-4 rounded-3xl bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold",
					children: "اطلب اللي على مزاجك"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "مش لاقي اللي بتدور عليه؟ اكتب طلبك وإحنا نحاول نوفرهولك."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					rows: 7,
					placeholder: "اكتب طلبك هنا...",
					className: "w-full resize-none rounded-2xl border border-border bg-muted p-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-13 w-full rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90",
					children: "أضف للسلة"
				})
			]
		})
	});
}
//#endregion
export { CustomOrderPage as component };
