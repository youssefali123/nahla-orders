import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as useRouter, S as useNavigate, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as Link, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShoppingCart, h as Menu, l as Search, m as MessageCircle, t as X } from "../_libs/lucide-react.mjs";
import { t as Fe } from "../_libs/react-hot-toast.mjs";
import { t as Route$12 } from "./admin.product-editor-CESVWf2t.mjs";
import { p as useCart, r as getActiveCategories, t as CartProvider } from "./cart-By_kz0DL.mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
import { t as Route$13 } from "./category._categoryId._subId-BDDEaoLM.mjs";
import { t as Route$14 } from "./category._categoryId.index-BCwYPVPs.mjs";
import { n as whatsappContactUrl } from "./whatsapp-DMocFZPX.mjs";
import { t as Route$15 } from "./product._productId-BbseULJC.mjs";
import { t as Route$16 } from "./routes-Dgh3mujT.mjs";
import { t as Route$17 } from "./search-DOVwMnF7.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C5Kdj3Mz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-4MwPYKWf.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function Navbar({ categories }) {
	const { count } = useCart();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	function submit(e) {
		e.preventDefault();
		const q = query.trim();
		if (!q) return;
		setMenuOpen(false);
		navigate({
			to: "/search",
			search: { q }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center gap-3 px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMenuOpen((v) => !v),
						"aria-label": "القائمة",
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted md:hidden",
						children: menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.png",
							alt: site.name,
							className: "h-10 w-10 rounded-xl object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-lg font-extrabold text-primary-dark sm:inline",
							children: site.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "ابحث عن منتج...",
							"aria-label": "ابحث عن منتج",
							className: "h-11 w-full rounded-full border border-border bg-muted pr-10 pl-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cart",
						"aria-label": "السلة",
						className: "relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-5 w-5" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground",
							children: count
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-auto hidden max-w-5xl items-center gap-1 px-3 pb-2 md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted",
					children: "الرئيسية"
				}), categories.map((c) => c.type === "custom_order" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/custom-order",
					className: "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted",
					children: c.name
				}, c.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/category/$categoryId",
					params: { categoryId: c.id },
					className: "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted",
					children: c.name
				}, c.id))]
			}),
			menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "border-t border-border bg-card px-3 py-2 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					onClick: () => setMenuOpen(false),
					className: "block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted",
					children: "الرئيسية"
				}), categories.map((c) => c.type === "custom_order" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/custom-order",
					onClick: () => setMenuOpen(false),
					className: "block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2",
						children: c.icon
					}), c.name]
				}, c.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/category/$categoryId",
					params: { categoryId: c.id },
					onClick: () => setMenuOpen(false),
					className: "block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2",
						children: c.icon
					}), c.name]
				}, c.id))]
			})
		]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-10 bg-primary-dark text-primary-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/favicon.png",
					alt: site.name,
					className: "h-14 w-14 rounded-2xl object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl font-extrabold",
						children: site.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm opacity-90",
						children: [site.slogan, " 🐝"]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 text-sm font-semibold sm:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "opacity-90 transition-opacity hover:opacity-100",
						children: "الرئيسية"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/category/$categoryId",
						params: { categoryId: "market" },
						className: "opacity-90 transition-opacity hover:opacity-100",
						children: "الأقسام"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cart",
						className: "opacity-90 transition-opacity hover:opacity-100",
						children: "السلة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappContactUrl(),
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-accent-foreground transition-opacity hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), "تواصل معنا على واتساب"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-primary-foreground/15 py-3 text-center text-xs opacity-80",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" ",
				site.name,
				". جميع الحقوق محفوظة."
			]
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-6xl",
					children: "🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-2xl font-extrabold text-foreground",
					children: "الصفحة مش موجودة"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "يمكن الرابط قديم أو اتغير."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90",
						children: "العودة للرئيسية"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-extrabold tracking-tight text-foreground",
					children: "حدثت مشكلة غير متوقعة"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "جرّب تحديث الصفحة أو العودة للرئيسية."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90",
						children: "حاول مرة أخرى"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-bold text-foreground transition-colors hover:bg-muted",
						children: "العودة للرئيسية"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "نحلة | هنوصلك بسرعة النحلة" },
			{
				name: "description",
				content: "نحلة منصة طلبات وتوصيل سريعة: ماركت، مطاعم، خضار وفاكهة، عيش ومعجنات وطلبات مخصصة."
			},
			{
				property: "og:title",
				content: "نحلة | هنوصلك بسرعة النحلة"
			},
			{
				property: "og:description",
				content: "اطلب كل احتياجاتك من مكان واحد ووصّلها لحد باب البيت بسرعة النحلة."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	loader: async () => {
		try {
			return await getActiveCategories();
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	const categories = Route$11.useLoaderData();
	const isAdmin = useRouterState({ select: (s) => s.location.pathname }).startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col",
			children: [
				!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, { categories }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 pb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fe, { position: "top-center" })] })
	});
}
var $$splitComponentImporter$10 = () => import("./cart-CwyVi9aW.mjs");
var Route$10 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "السلة | نحلة" },
		{
			name: "description",
			content: "راجع منتجات سلتك، عدّل الكميات وأكمل طلبك من نحلة في خطوات بسيطة."
		},
		{
			property: "og:title",
			content: "السلة | نحلة"
		},
		{
			property: "og:description",
			content: "عدّل كميات طلبك وأكمل الطلب بسرعة."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./checkout-CtkYRin-.mjs");
var Route$9 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "إتمام الطلب | نحلة" },
		{
			name: "description",
			content: "أدخل بياناتك وأكد طلبك ليتم إرساله لفريق نحلة فورًا."
		},
		{
			property: "og:title",
			content: "إتمام الطلب | نحلة"
		},
		{
			property: "og:description",
			content: "بيانات التوصيل وتأكيد الطلب في خطوة واحدة."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./custom-order-CWKh_0Ta.mjs");
var Route$8 = createFileRoute("/custom-order")({
	head: () => ({ meta: [
		{ title: "طلب مخصص | نحلة" },
		{
			name: "description",
			content: "اكتب طلبك بنفسك وإحنا نحاول نوفرهولك ونوصلّه لحد باب البيت."
		},
		{
			property: "og:title",
			content: "طلب مخصص | نحلة"
		},
		{
			property: "og:description",
			content: "مش لاقي اللي بتدور عليه؟ اكتب طلبك في نحلة."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./order-success-Ae4_i7T7.mjs");
var Route$7 = createFileRoute("/order-success")({
	head: () => ({ meta: [
		{ title: "تم إرسال طلبك | نحلة" },
		{
			name: "description",
			content: "طلبك وصل لفريق نحلة وهنتواصل معاك لتأكيد التوصيل."
		},
		{
			property: "og:title",
			content: "تم إرسال طلبك | نحلة"
		},
		{
			property: "og:description",
			content: "هنوصلك بسرعة النحلة."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.index-C4SHGUb6.mjs");
var Route$6 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "الرئيسية | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.account-CdVBqmCa.mjs");
var Route$5 = createFileRoute("/admin/account")({
	head: () => ({ meta: [{ title: "الحساب الشخصي | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.banners-wukFRgS4.mjs");
var Route$4 = createFileRoute("/admin/banners")({
	head: () => ({ meta: [{ title: "البنرات | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.categories-CSdVW1nd.mjs");
var Route$3 = createFileRoute("/admin/categories")({
	head: () => ({ meta: [{ title: "التصنيفات | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.login-DTiYNAtv.mjs");
var Route$2 = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "تسجيل الدخول | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.products-VsRrx_JZ.mjs");
var Route$1 = createFileRoute("/admin/products")({
	head: () => ({ meta: [{ title: "المنتجات | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.subcategories-BGuPIezU.mjs");
var Route = createFileRoute("/admin/subcategories")({
	head: () => ({ meta: [{ title: "التصنيفات الفرعية | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var CartRoute = Route$10.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$11
});
var CheckoutRoute = Route$9.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$11
});
var CustomOrderRoute = Route$8.update({
	id: "/custom-order",
	path: "/custom-order",
	getParentRoute: () => Route$11
});
var OrderSuccessRoute = Route$7.update({
	id: "/order-success",
	path: "/order-success",
	getParentRoute: () => Route$11
});
var SearchRoute = Route$17.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$11
});
var AdminIndexRoute = Route$6.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$11
});
var AdminAccountRoute = Route$5.update({
	id: "/admin/account",
	path: "/admin/account",
	getParentRoute: () => Route$11
});
var AdminBannersRoute = Route$4.update({
	id: "/admin/banners",
	path: "/admin/banners",
	getParentRoute: () => Route$11
});
var AdminCategoriesRoute = Route$3.update({
	id: "/admin/categories",
	path: "/admin/categories",
	getParentRoute: () => Route$11
});
var AdminLoginRoute = Route$2.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$11
});
var AdminProductEditorRoute = Route$12.update({
	id: "/admin/product-editor",
	path: "/admin/product-editor",
	getParentRoute: () => Route$11
});
var AdminProductsRoute = Route$1.update({
	id: "/admin/products",
	path: "/admin/products",
	getParentRoute: () => Route$11
});
var AdminSubcategoriesRoute = Route.update({
	id: "/admin/subcategories",
	path: "/admin/subcategories",
	getParentRoute: () => Route$11
});
var ProductProductIdRoute = Route$15.update({
	id: "/product/$productId",
	path: "/product/$productId",
	getParentRoute: () => Route$11
});
var CategoryCategoryIdIndexRoute = Route$14.update({
	id: "/category/$categoryId/",
	path: "/category/$categoryId/",
	getParentRoute: () => Route$11
});
var rootRouteChildren = {
	IndexRoute,
	CartRoute,
	CheckoutRoute,
	CustomOrderRoute,
	OrderSuccessRoute,
	SearchRoute,
	AdminAccountRoute,
	AdminBannersRoute,
	AdminCategoriesRoute,
	AdminLoginRoute,
	AdminProductEditorRoute,
	AdminProductsRoute,
	AdminSubcategoriesRoute,
	ProductProductIdRoute,
	AdminIndexRoute,
	CategoryCategoryIdSubIdRoute: Route$13.update({
		id: "/category/$categoryId/$subId",
		path: "/category/$categoryId/$subId",
		getParentRoute: () => Route$11
	}),
	CategoryCategoryIdIndexRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultStaleTime: 6e4,
		defaultPreloadStaleTime: 6e4
	});
};
//#endregion
export { getRouter };
