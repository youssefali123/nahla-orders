import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime, d as DialogContent, f as DialogDescription, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { T as signOutManager, _ as onManagerAuthChange, d as getManagerSession, r as cn, t as Button } from "./button-DumUo7Sd.mjs";
import { S as useNavigate, p as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Image, c as Shapes, g as LogOut, h as Menu, n as User, o as ShoppingBag, s as ShieldAlert, t as X, v as ListTree, y as LayoutDashboard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-lkUnX65X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Display-only gate: renders children solely for verified managers.
* Real enforcement stays in RLS; this only controls what is shown.
*/
function AdminGuard({ children }) {
	const [state, setState] = (0, import_react.useState)({
		checked: false,
		user: null,
		error: null
	});
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getManagerSession().then((session) => {
			if (!cancelled) setState({
				checked: true,
				user: session?.user ?? null,
				error: null
			});
		}).catch((error) => {
			if (!cancelled) setState({
				checked: true,
				user: null,
				error: {
					message: "حصل خطأ، حاول تاني.",
					cause: error
				}
			});
		});
		let unsubscribe;
		onManagerAuthChange((session) => {
			if (!cancelled) setState({
				checked: true,
				user: session?.user ?? null,
				error: null
			});
		}).then((unsub) => {
			unsubscribe = unsub;
		});
		return () => {
			cancelled = true;
			unsubscribe?.();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (state.checked && !state.user && !state.error) navigate({
			to: "/admin/login",
			replace: true
		});
	}, [state, navigate]);
	if (!state.checked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background",
		"aria-busy": "true",
		"aria-label": "جاري التحميل",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" })
	});
	if (state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid min-h-screen max-w-md place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-2xl bg-card p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-4xl",
					children: "🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-bold",
					children: state.error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.location.reload(),
					className: "mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground",
					children: "حاول تاني"
				})
			]
		})
	});
	if (!state.user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid min-h-screen max-w-md place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-2xl bg-card p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					className: "mx-auto h-10 w-10 text-destructive",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-xl font-extrabold",
					children: "غير مصرح لك بالدخول"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "هذه المنطقة مخصصة لمديري نحلة فقط."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/login",
						className: "inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground",
						children: "تسجيل الدخول"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 text-sm font-bold",
						children: "العودة للمتجر"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var NAV = [
	{
		title: "",
		items: [{
			to: "/admin",
			label: "الرئيسية",
			icon: LayoutDashboard
		}]
	},
	{
		title: "الكتالوج",
		items: [
			{
				to: "/admin/categories",
				label: "التصنيفات",
				icon: Shapes,
				matchPrefix: true
			},
			{
				to: "/admin/subcategories",
				label: "التصنيفات الفرعية",
				icon: ListTree,
				matchPrefix: true
			},
			{
				to: "/admin/products",
				label: "المنتجات",
				icon: ShoppingBag,
				matchPrefix: true
			}
		]
	},
	{
		title: "المحتوى",
		items: [{
			to: "/admin/banners",
			label: "البنرات",
			icon: Image,
			matchPrefix: true
		}]
	},
	{
		title: "الحساب",
		items: [{
			to: "/admin/account",
			label: "الحساب الشخصي",
			icon: User
		}]
	}
];
function NavList({ onNavigate }) {
	const { location } = useRouterState();
	const path = location.pathname;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "التنقل الرئيسي",
		className: "space-y-4",
		children: NAV.map((group, gi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [group.title !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1 px-3 text-xs font-bold text-white/60",
			children: group.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1",
			children: group.items.map((item) => {
				const active = item.matchPrefix ? path.startsWith(item.to) : path === item.to;
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					onClick: onNavigate,
					"aria-current": active ? "page" : void 0,
					className: `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${active ? "bg-primary font-extrabold text-primary-foreground" : "text-white hover:bg-white/10"}`,
					children: [
						active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-y-2 right-0 w-1 rounded-full bg-accent",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-5 w-5 shrink-0",
							"aria-hidden": true
						}),
						item.label
					]
				}) }, item.to);
			})
		})] }, gi))
	});
}
function AdminShell({ title, actions, children }) {
	const [drawerOpen, setDrawerOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	async function logout() {
		await signOutManager();
		navigate({
			to: "/admin/login",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#0F3B3B] p-4 text-white lg:flex",
				"aria-label": "الشريط الجانبي",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "mb-6 flex items-center gap-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.png",
							alt: "نحلة",
							className: "h-10 w-10 rounded-xl object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-extrabold",
							children: "نحلة · الإدارة"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "ghost",
						onClick: logout,
						className: "mt-4 w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
							className: "h-5 w-5",
							"aria-hidden": true
						}), "تسجيل الخروج"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDrawerOpen(true),
							"aria-label": "فتح القائمة",
							className: "grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-muted lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								className: "h-5 w-5",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "min-w-0 flex-1 truncate text-lg font-extrabold text-primary-dark",
							children: title
						}),
						actions
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-6xl flex-1 space-y-4 p-3 md:p-6",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: drawerOpen,
				onOpenChange: setDrawerOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "right",
					className: "flex w-72 flex-col bg-[#0F3B3B] text-white",
					"aria-label": "قائمة التنقل",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
							className: "sr-only",
							children: "قائمة التنقل"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 text-lg font-extrabold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/favicon.png",
									alt: "نحلة",
									className: "h-9 w-9 rounded-xl object-cover"
								}), "نحلة · الإدارة"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDrawerOpen(false),
								"aria-label": "إغلاق القائمة",
								className: "grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
									className: "h-5 w-5",
									"aria-hidden": true
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, { onNavigate: () => setDrawerOpen(false) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							onClick: logout,
							className: "mt-4 w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
								className: "h-5 w-5",
								"aria-hidden": true
							}), "تسجيل الخروج"]
						})
					]
				})
			})
		]
	});
}
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-extrabold text-primary-dark",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
//#endregion
export { Skeleton as i, AdminShell as n, PageHeader as r, AdminGuard as t };
