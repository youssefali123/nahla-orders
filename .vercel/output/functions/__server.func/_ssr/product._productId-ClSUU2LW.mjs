import { X as notFound, _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as getProduct } from "./cart-uvRnG2bT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._productId-ClSUU2LW.js
var $$splitComponentImporter = () => import("./product._productId-C2mX4D7n.mjs");
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
