import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button, u as getManagerSession, w as signOutManager } from "./button-B0qzXPB4.mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as LogOut, n as User } from "../_libs/lucide-react.mjs";
import { n as AdminShell, r as PageHeader, t as AdminGuard } from "./AdminShell-JKfXsZUA.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.account-T3v-ASh6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminAccountPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getManagerSession().then((session) => setEmail(session?.user.email ?? null));
	}, []);
	async function logout() {
		await signOutManager();
		n.success("تم تسجيل الخروج");
		navigate({
			to: "/admin/login",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "الحساب الشخصي",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "الحساب الشخصي",
			description: "بيانات حساب المدير الحالي."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-xl rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5",
			children: [email === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
				className: "h-16 rounded-xl",
				"aria-label": "جاري التحميل"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary-dark",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "البريد الإلكتروني"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-extrabold",
						dir: "ltr",
						children: email
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				onClick: logout,
				className: "mt-4 h-12 w-full gap-2 rounded-xl font-bold text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
					className: "h-4 w-4",
					"aria-hidden": true
				}), "تسجيل الخروج"]
			})]
		})]
	}) });
}
//#endregion
export { AdminAccountPage as component };
