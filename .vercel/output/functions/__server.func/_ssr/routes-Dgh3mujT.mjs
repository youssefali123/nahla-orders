import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getProduct, d as getSubcategoryById, l as getProductsWithOptions, n as getActiveBanners, o as getCategory, s as getFeaturedProducts } from "./cart-By_kz0DL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dgh3mujT.js
var $$splitComponentImporter = () => import("./routes-CLeeu1fw.mjs");
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
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
