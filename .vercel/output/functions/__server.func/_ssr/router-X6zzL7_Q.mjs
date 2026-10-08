import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as useRouter, S as useNavigate, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as Link, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Menu, h as MessageCircle, o as ShoppingCart, t as X, u as Search } from "../_libs/lucide-react.mjs";
import { t as Fe } from "../_libs/react-hot-toast.mjs";
import { t as Route$13 } from "./admin.product-editor-D64VrA88.mjs";
import { m as useCart, r as getActiveCategories, t as CartProvider } from "./cart-uvRnG2bT.mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
import { t as Route$14 } from "./category._categoryId._subId-DooL0cV0.mjs";
import { t as Route$15 } from "./category._categoryId.index-CPXiSbdQ.mjs";
import { n as whatsappContactUrl } from "./whatsapp--tDt8L9p.mjs";
import { t as Route$16 } from "./product._productId-ClSUU2LW.mjs";
import { n as Route$17 } from "./routes-B2TLXRDf.mjs";
import { t as Route$18 } from "./search-2xFKSmU-.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-X6zzL7_Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Dw0TalRq.css";
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
var whatsapp_default = "/assets/whatsapp-Bv3ceAgd.png";
/** Floating WhatsApp contact button, fixed bottom-right on store pages. */
function WhatsAppFloat() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: whatsappContactUrl(),
		target: "_blank",
		rel: "noreferrer",
		"aria-label": "تواصل معنا على واتساب",
		className: "fixed bottom-6 right-4 z-40 grid h-14 w-14 place-items-center overflow-hidden rounded-full shadow-[0_6px_16px_-4px_rgba(0,0,0,0.35),0_8px_28px_-4px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 active:scale-95",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: whatsapp_default,
			alt: "",
			className: "h-full w-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "sr-only",
			children: [site.name, " على واتساب"]
		})]
	});
}
/**
* Fullscreen loading overlay (SSR-safe: pure CSS, no spinner library).
* react-loader-spinner crashes Node SSR at import time, so it must never
* be part of any server-rendered module graph.
*/
var RING_SIZES = [
	120,
	92,
	64
];
function Loader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			backdropFilter: "blur(3px)",
			backgroundColor: "#000000a0",
			width: "100vw",
			height: "100vh",
			position: "fixed",
			top: 0,
			left: 0,
			zIndex: 99999999
		},
		className: "flex items-center justify-center",
		role: "status",
		"aria-label": "جاري التحميل",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative grid place-items-center",
			"aria-hidden": true,
			children: RING_SIZES.map((size, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "anim-puff-ring absolute rounded-full border-4 border-transparent",
				style: {
					width: size,
					height: size,
					borderTopColor: "#0fe45a",
					borderRightColor: i === 0 ? "#0fe45a55" : "transparent",
					animationDelay: `${i * .15}s`
				}
			}, size))
		})
	});
}
var favicon_default = "/assets/favicon-DWqID3tj.ico";
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
							src: favicon_default,
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
function RoutePending() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {});
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
var Route$12 = createRootRouteWithContext()({
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
	pendingComponent: RoutePending,
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
	const { queryClient } = Route$12.useRouteContext();
	const categories = Route$12.useLoaderData();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isAdmin = pathname.startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col",
				children: [
					!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, { categories }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "anim-page flex-1 pb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}, pathname),
					!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
				]
			}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppFloat, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fe, { position: "top-center" })
		] })
	});
}
var $$splitComponentImporter$11 = () => import("./cart-CO3qzPhG.mjs");
var Route$11 = createFileRoute("/cart")({
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
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./checkout-DWEYPbnV.mjs");
var Route$10 = createFileRoute("/checkout")({
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
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./custom-order-Dqm82XY3.mjs");
var Route$9 = createFileRoute("/custom-order")({
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
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./order-success-Ae4_i7T7.mjs");
var Route$8 = createFileRoute("/order-success")({
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
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.index-ssu2bc6u.mjs");
var Route$7 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "الرئيسية | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.account-CHi7xkWg.mjs");
var Route$6 = createFileRoute("/admin/account")({
	head: () => ({ meta: [{ title: "الحساب الشخصي | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.banners-wMHvBux4.mjs");
var Route$5 = createFileRoute("/admin/banners")({
	head: () => ({ meta: [{ title: "البنرات | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.categories-_BByjmPx.mjs");
var Route$4 = createFileRoute("/admin/categories")({
	head: () => ({ meta: [{ title: "التصنيفات | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.login-CO-IAJfw.mjs");
var Route$3 = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "تسجيل الدخول | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.products-DmQ_m1aO.mjs");
var Route$2 = createFileRoute("/admin/products")({
	head: () => ({ meta: [{ title: "المنتجات | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.subcategories-IEhHWZHV.mjs");
var Route$1 = createFileRoute("/admin/subcategories")({
	head: () => ({ meta: [{ title: "التصنيفات الفرعية | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.zones-CjHwXUCa.mjs");
var Route = createFileRoute("/admin/zones")({
	head: () => ({ meta: [{ title: "مناطق التوصيل | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var CartRoute = Route$11.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$12
});
var CheckoutRoute = Route$10.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$12
});
var CustomOrderRoute = Route$9.update({
	id: "/custom-order",
	path: "/custom-order",
	getParentRoute: () => Route$12
});
var OrderSuccessRoute = Route$8.update({
	id: "/order-success",
	path: "/order-success",
	getParentRoute: () => Route$12
});
var SearchRoute = Route$18.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$12
});
var AdminIndexRoute = Route$7.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$12
});
var AdminAccountRoute = Route$6.update({
	id: "/admin/account",
	path: "/admin/account",
	getParentRoute: () => Route$12
});
var AdminBannersRoute = Route$5.update({
	id: "/admin/banners",
	path: "/admin/banners",
	getParentRoute: () => Route$12
});
var AdminCategoriesRoute = Route$4.update({
	id: "/admin/categories",
	path: "/admin/categories",
	getParentRoute: () => Route$12
});
var AdminLoginRoute = Route$3.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$12
});
var AdminProductEditorRoute = Route$13.update({
	id: "/admin/product-editor",
	path: "/admin/product-editor",
	getParentRoute: () => Route$12
});
var AdminProductsRoute = Route$2.update({
	id: "/admin/products",
	path: "/admin/products",
	getParentRoute: () => Route$12
});
var AdminSubcategoriesRoute = Route$1.update({
	id: "/admin/subcategories",
	path: "/admin/subcategories",
	getParentRoute: () => Route$12
});
var AdminZonesRoute = Route.update({
	id: "/admin/zones",
	path: "/admin/zones",
	getParentRoute: () => Route$12
});
var ProductProductIdRoute = Route$16.update({
	id: "/product/$productId",
	path: "/product/$productId",
	getParentRoute: () => Route$12
});
var CategoryCategoryIdIndexRoute = Route$15.update({
	id: "/category/$categoryId/",
	path: "/category/$categoryId/",
	getParentRoute: () => Route$12
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
	AdminZonesRoute,
	ProductProductIdRoute,
	AdminIndexRoute,
	CategoryCategoryIdSubIdRoute: Route$14.update({
		id: "/category/$categoryId/$subId",
		path: "/category/$categoryId/$subId",
		getParentRoute: () => Route$12
	}),
	CategoryCategoryIdIndexRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultStaleTime: 6e4,
		defaultPreloadStaleTime: 6e4,
		defaultPendingMs: 200,
		defaultPendingMinMs: 300
	});
};
//#endregion
export { getRouter };
