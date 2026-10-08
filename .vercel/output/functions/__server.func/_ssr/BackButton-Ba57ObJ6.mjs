import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BackButton-Ba57ObJ6.js
var import_jsx_runtime = require_jsx_runtime();
function BackButton() {
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => router.history.back(),
		"aria-label": "رجوع",
		className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card shadow-soft transition-all active:scale-90",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5" })
	});
}
//#endregion
export { BackButton as t };
