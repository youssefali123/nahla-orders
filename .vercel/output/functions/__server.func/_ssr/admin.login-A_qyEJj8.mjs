import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as signInManager, t as Button, u as getManagerSession } from "./button-B0qzXPB4.mjs";
import { S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Field } from "./forms-DZ9oyO3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-A_qyEJj8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [sending, setSending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getManagerSession().then((session) => {
			if (session) navigate({
				to: "/admin",
				replace: true
			});
		});
	}, [navigate]);
	async function submit(e) {
		e.preventDefault();
		const next = {};
		if (!email.trim()) next.email = "البريد الإلكتروني مطلوب";
		if (!password) next.password = "كلمة المرور مطلوبة";
		setErrors(next);
		if (Object.keys(next).length > 0) return;
		setSending(true);
		try {
			await signInManager(email.trim(), password);
			n.success("تم تسجيل الدخول بنجاح");
			navigate({
				to: "/admin",
				replace: true
			});
		} catch (error) {
			n.error(error?.message ?? "بيانات الدخول غير صحيحة.");
		} finally {
			setSending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-4",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl bg-card p-6 shadow-card md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/favicon.png",
						alt: "نحلة",
						className: "h-12 w-12 rounded-2xl object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-extrabold text-primary-dark",
						children: "إدارة نحلة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "تسجيل دخول المديرين فقط"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4",
					noValidate: false,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "login-email",
							label: "البريد الإلكتروني",
							required: true,
							error: errors.email,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "login-email",
								type: "email",
								autoComplete: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "admin@example.com",
								className: "h-12 rounded-xl",
								dir: "ltr"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "login-password",
							label: "كلمة المرور",
							required: true,
							error: errors.password,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "login-password",
									type: showPassword ? "text" : "password",
									autoComplete: "current-password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••",
									className: "h-12 rounded-xl pl-16",
									dir: "ltr"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPassword((v) => !v),
									className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-dark hover:underline",
									children: showPassword ? "إخفاء" : "عرض"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: sending,
							className: "h-13 w-full rounded-xl py-3.5 text-base font-extrabold",
							children: sending ? "جاري الدخول..." : "تسجيل الدخول"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 block text-center text-sm font-bold text-primary-dark hover:underline",
					children: "العودة للمتجر"
				})
			]
		})
	});
}
//#endregion
export { AdminLoginPage as component };
