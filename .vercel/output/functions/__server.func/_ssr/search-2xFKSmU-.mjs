import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as searchProducts, u as getProductsWithOptions } from "./cart-uvRnG2bT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-2xFKSmU-.js
var $$splitComponentImporter = () => import("./search-ByrXW_kl.mjs");
var Route = createFileRoute("/search")({
	validateSearch: (search) => ({ q: typeof search["q"] === "string" ? search["q"] : "" }),
	loaderDeps: ({ search }) => ({ q: search.q }),
	loader: async ({ deps }) => {
		try {
			const results = await searchProducts(deps.q);
			return {
				results,
				optionFlags: await getProductsWithOptions(results.map((p) => p.id)),
				error: null
			};
		} catch (error) {
			console.error(error);
			return {
				results: [],
				optionFlags: {},
				error: "حصل خطأ، حاول تاني."
			};
		}
	},
	head: () => ({ meta: [
		{ title: "نتائج البحث | نحلة" },
		{
			name: "description",
			content: "ابحث عن أي منتج في نحلة واطلبه في ثواني."
		},
		{
			property: "og:title",
			content: "نتائج البحث | نحلة"
		},
		{
			property: "og:description",
			content: "ابحث عن منتجاتك المفضلة واطلبها بسرعة."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
