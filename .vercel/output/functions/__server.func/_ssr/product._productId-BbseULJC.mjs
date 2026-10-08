import { X as notFound, _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getProduct } from "./cart-By_kz0DL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._productId-BbseULJC.js
var $$splitComponentImporter = () => import("./product._productId-9OUpjPjx.mjs");
var Route = createFileRoute("/product/$productId")({
	loader: async ({ params }) => {
		let product;
		try {
			product = await getProduct(params.productId);
		} catch (error) {
			console.error(error);
			return {
				product: null,
				error: "حصل خطأ، حاول تاني."
			};
		}
		if (!product) throw notFound();
		return {
			product,
			error: null
		};
	},
	head: ({ loaderData }) => {
		const product = loaderData?.product;
		const title = product ? `${product.name} | نحلة` : "منتج | نحلة";
		const description = product?.description ?? "تفاصيل المنتج في نحلة.";
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
