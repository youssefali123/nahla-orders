import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-success-Ae4_i7T7.js
var import_jsx_runtime = require_jsx_runtime();
function OrderSuccessPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-3 pt-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/favicon.png",
				alt: site.name,
				className: "mx-auto h-36 w-36 rounded-3xl object-cover shadow-card"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 text-2xl font-extrabold",
				children: "طلبك وصل للنحلة! 🐝"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: site.slogan
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "استلمنا طلبك بنجاح وهنكلمك قريب لتأكيد التوصيل."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-7 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90",
				children: "العودة للرئيسية"
			})
		]
	});
}
//#endregion
export { OrderSuccessPage as component };
