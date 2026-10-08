import { X as notFound, _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getSubcategory, i as getActiveProducts, s as getCategory, u as getProductsWithOptions } from "./cart-uvRnG2bT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._categoryId._subId-DooL0cV0.js
var $$splitComponentImporter = () => import("./category._categoryId._subId-CNRTx4EB.mjs");
var Route = createFileRoute("/category/$categoryId/$subId")({
	loader: async ({ params }) => {
		let category;
		let sub;
		try {
			category = await getCategory(params.categoryId);
			sub = await getSubcategory(params.categoryId, params.subId);
		} catch (error) {
			console.error(error);
			return {
				category: null,
				sub: null,
				products: [],
				optionFlags: {},
				error: "حصل خطأ، حاول تاني."
			};
		}
		if (!category || !sub) throw notFound();
		try {
			const products = await getActiveProducts(category.id, sub.id);
			const optionFlags = await getProductsWithOptions(products.map((p) => p.id));
			return {
				category,
				sub,
				products,
				optionFlags,
				error: null
			};
		} catch (error) {
			console.error(error);
			return {
				category: null,
				sub: null,
				products: [],
				optionFlags: {},
				error: "حصل خطأ، حاول تاني."
			};
		}
	},
	head: ({ loaderData }) => {
		const sub = loaderData?.sub;
		const title = sub ? `${sub.name} | نحلة` : "المنتجات | نحلة";
		const description = sub ? `اطلب ${sub.name} من نحلة بأسعار مناسبة وتوصيل سريع.` : "اطلب منتجاتك من نحلة بسرعة.";
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
