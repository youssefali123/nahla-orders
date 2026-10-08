import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getFeaturedProducts, f as getSubcategoryById, l as getProduct, n as getActiveBanners, s as getCategory, u as getProductsWithOptions } from "./cart-uvRnG2bT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B2TLXRDf.js
var import_jsx_runtime = require_jsx_runtime();
var home_default = "/assets/home-WeflVxLf.jpeg";
/** Branded loading screen shown only while the homepage data loads. */
function HomeLoadingScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[99999999] grid place-items-center bg-background",
		"aria-busy": "true",
		"aria-label": "جاري تحميل الصفحة الرئيسية",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 px-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: home_default,
					alt: "نحلة",
					className: "anim-float h-44 w-44 rounded-[2rem] object-cover shadow-card sm:h-56 sm:w-56"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-extrabold text-primary-dark",
					children: "جاري التحميل... 🐝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1.5",
					"aria-hidden": true,
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "anim-dot h-2.5 w-2.5 rounded-full bg-primary",
						style: { animationDelay: `${i * .2}s` }
					}, i))
				})
			]
		})
	});
}
var $$splitComponentImporter = () => import("./routes-CNN7lA9B.mjs");
async function resolveTarget(banner) {
	const none = {
		banner,
		target: { kind: "none" }
	};
	try {
		if (banner.link_type === "category" && banner.link_id) {
			const category = await getCategory(banner.link_id);
			return category ? {
				banner,
				target: {
					kind: "category",
					categoryId: category.id
				}
			} : none;
		}
		if (banner.link_type === "subcategory" && banner.link_id) {
			const sub = await getSubcategoryById(banner.link_id);
			return sub ? {
				banner,
				target: {
					kind: "subcategory",
					categoryId: sub.category_id,
					subId: sub.id
				}
			} : none;
		}
		if (banner.link_type === "product" && banner.link_id) {
			const product = await getProduct(banner.link_id);
			return product ? {
				banner,
				target: {
					kind: "product",
					productId: product.id
				}
			} : none;
		}
		if (banner.link_type === "custom" && banner.link_url) return {
			banner,
			target: {
				kind: "url",
				url: banner.link_url
			}
		};
	} catch (error) {
		console.error(error);
	}
	return none;
}
var Route = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "نحلة | اطلب واستلم بسرعة النحلة" },
		{
			name: "description",
			content: "تصفح أقسام نحلة: ماركت، مطاعم، خضار وفاكهة، عيش ومعجنات، أو اكتب طلبك المخصص واستلمه بسرعة."
		},
		{
			property: "og:title",
			content: "نحلة | اطلب واستلم بسرعة النحلة"
		},
		{
			property: "og:description",
			content: "أقسام متنوعة وطلب سهل عبر واتساب في خطوات قليلة."
		}
	] }),
	loader: async () => {
		try {
			const [banners, featured] = await Promise.all([getActiveBanners(), getFeaturedProducts()]);
			const [resolved, optionFlags] = await Promise.all([Promise.all(banners.map(resolveTarget)), getProductsWithOptions(featured.map((p) => p.id))]);
			return {
				banners: resolved,
				featured,
				optionFlags,
				error: null
			};
		} catch (error) {
			console.error(error);
			return {
				banners: [],
				featured: [],
				optionFlags: {},
				error: "حصل خطأ، حاول تاني."
			};
		}
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	pendingComponent: HomeLoadingScreen
});
//#endregion
export { Route as n, HomeLoadingScreen as t };
