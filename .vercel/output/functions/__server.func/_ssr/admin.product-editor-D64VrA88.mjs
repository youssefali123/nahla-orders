import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.product-editor-D64VrA88.js
var $$splitComponentImporter = () => import("./admin.product-editor-BfJTkCHo.mjs");
var Route = createFileRoute("/admin/product-editor")({
	validateSearch: (search) => ({ id: typeof search["id"] === "string" ? search["id"] : null }),
	head: () => ({ meta: [{ title: "محرر المنتج | إدارة نحلة" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
