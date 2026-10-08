import { X as notFound, _ as lazyRouteComponent, q as redirect, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getActiveSubcategories, i as getActiveProducts, l as getProductsWithOptions, o as getCategory } from "./cart-By_kz0DL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._categoryId.index-BCwYPVPs.js
var $$splitComponentImporter = () => import("./category._categoryId.index-DKKL8mf4.mjs");
var Route = createFileRoute("/category/$categoryId/")({
	loader: async ({ params }) => {
		let category;
		try {
			category = await getCategory(params.categoryId);
		} catch (error) {
			console.error(error);
			return {
				category: null,
				subcategories: [],
				products: [],
				optionFlags: {},
				error: "حصل خطأ، حاول تاني."
			};
		}
		if (!category) throw notFound();
		if (category.type === "custom_order") throw redirect({ to: "/custom-order" });
		try {
			const subcategories = await getActiveSubcategories(category.id);
			const products = subcategories.length === 0 ? await getActiveProducts(category.id) : [];
			const optionFlags = await getProductsWithOptions(products.map((p) => p.id));
			return {
				category,
				subcategories,
				products,
				optionFlags,
				error: null
			};
		} catch (error) {
			console.error(error);
			return {
				category: null,
				subcategories: [],
				products: [],
				optionFlags: {},
				error: "حصل خطأ، حاول تاني."
			};
		}
	},
	head: ({ loaderData }) => {
		const category = loaderData?.category;
		const title = category ? `${category.name} | نحلة` : "الأقسام | نحلة";
		const description = category ? `تصفح ${category.name} في نحلة واطلب بسرعة مع توصيل لحد باب البيت.` : "تصفح أقسام نحلة واطلب بسرعة.";
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
