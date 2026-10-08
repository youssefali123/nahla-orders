import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as useRouter, b as getRouteApi, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as site } from "./site-DJJ-cs6K.mjs";
import { t as ProductGrid } from "./ProductCard-DiBzJFJ9.mjs";
import { t as Route } from "./routes-Dgh3mujT.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CLeeu1fw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BannerLink({ target, title, children }) {
	if (target.kind === "category") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/category/$categoryId",
		params: { categoryId: target.categoryId },
		className: "relative block",
		"aria-label": title,
		children
	});
	if (target.kind === "subcategory") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/category/$categoryId/$subId",
		params: {
			categoryId: target.categoryId,
			subId: target.subId
		},
		className: "relative block",
		"aria-label": title,
		children
	});
	if (target.kind === "product") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/product/$productId",
		params: { productId: target.productId },
		className: "relative block",
		"aria-label": title,
		children
	});
	if (target.kind === "url") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: target.url,
		target: "_blank",
		rel: "noreferrer",
		className: "relative block",
		"aria-label": title,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		className: "relative block",
		"aria-label": title,
		children
	});
}
function BannerCarousel({ items }) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		direction: "rtl"
	});
	const [selected, setSelected] = (0, import_react.useState)(0);
	const onSelect = (0, import_react.useCallback)(() => {
		if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
	}, [emblaApi]);
	(0, import_react.useEffect)(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on("select", onSelect);
		const timer = setInterval(() => emblaApi.scrollNext(), 5e3);
		return () => {
			clearInterval(timer);
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi, onSelect]);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-2xl",
			ref: emblaRef,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex",
				children: items.map(({ banner, target }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-[0_0_100%]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BannerLink, {
						target,
						title: banner.title ?? "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: banner.image_url,
							alt: banner.title ?? "",
							width: 1280,
							height: 720,
							...index === 0 ? {} : { loading: "lazy" },
							className: "aspect-video w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-y-0 left-0 flex w-[45%] flex-col justify-center gap-1 p-4 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-extrabold leading-tight text-primary-dark sm:text-2xl",
								children: banner.title
							})
						})]
					})
				}, banner.id))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex justify-center gap-1.5",
			children: items.map(({ banner }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `الصورة ${i + 1}`,
				onClick: () => emblaApi?.scrollTo(i),
				className: `h-2 rounded-full transition-all ${i === selected ? "w-6 bg-primary" : "w-2 bg-border"}`
			}, banner.id))
		})]
	});
}
var rootApi = getRouteApi("__root__");
function Index() {
	const { banners, featured, optionFlags, error } = Route.useLoaderData();
	const categories = rootApi.useLoaderData();
	const router = useRouter();
	const firstCategory = categories.find((c) => c.type !== "custom_order");
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-3 pt-10 text-center",
		children: [
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-8 px-3 pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannerCarousel, { items: banners }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-lg font-extrabold",
				children: "الأقسام الرئيسية"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5",
				children: categories.map((c, i) => {
					const tile = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-14 w-14 place-items-center overflow-hidden rounded-2xl text-3xl ${i % 2 === 0 ? "bg-primary/12" : "bg-accent/30"}`,
						"aria-hidden": true,
						children: c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image_url,
							alt: "",
							className: "h-full w-full object-cover",
							loading: "lazy"
						}) : c.icon ?? "🐝"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold leading-tight sm:text-sm",
						children: c.name
					})] });
					const className = "flex flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card";
					return c.type === "custom_order" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/custom-order",
						className,
						children: tile
					}, c.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/category/$categoryId",
						params: { categoryId: c.id },
						className,
						children: tile
					}, c.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-extrabold",
					children: "🔥 الأكثر طلبًا"
				}), firstCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/category/$categoryId",
					params: { categoryId: firstCategory.id },
					className: "inline-flex items-center gap-1 text-sm font-bold text-primary-dark",
					children: ["عرض الكل", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })]
				})]
			}), featured.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
				products: featured,
				optionFlags
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-card p-6 text-center text-sm font-bold text-muted-foreground shadow-soft",
				children: "مفيش منتجات متاحة حالياً."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/custom-order",
					className: "rounded-2xl bg-primary p-5 text-primary-foreground shadow-card transition-opacity hover:opacity-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-extrabold",
						children: "اطلب اللي على مزاجك ✍️"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm opacity-90",
						children: "مش لاقي اللي بتدور عليه؟ اكتب طلبك وإحنا نحاول نوفرهولك."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-accent/30 p-5 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg font-extrabold",
						children: [site.slogan, " 🐝"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "توصيل سريع لحد باب السكن، وأسعار مناسبة للطلاب."
					})]
				})]
			})
		]
	});
}
//#endregion
export { Index as component };
