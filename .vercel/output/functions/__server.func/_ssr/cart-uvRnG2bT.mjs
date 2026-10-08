import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-uvRnG2bT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var url = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_zG8MNLkbp_2ScSDvpxPpiA_UCa80DXE",
	"VITE_SUPABASE_URL": "https://gcrcfsuydfmsaclwubzj.supabase.co",
	"VITE_TELEGRAM_BOT_TOKEN": "8653896427:AAHuJ9c_j0YqZ_LUMkoNhz9yvWfrwAiq6UM",
	"VITE_TELEGRAM_CHAT_ID": "1170515116"
}["VITE_SUPABASE_URL"];
var anonKey = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_zG8MNLkbp_2ScSDvpxPpiA_UCa80DXE",
	"VITE_SUPABASE_URL": "https://gcrcfsuydfmsaclwubzj.supabase.co",
	"VITE_TELEGRAM_BOT_TOKEN": "8653896427:AAHuJ9c_j0YqZ_LUMkoNhz9yvWfrwAiq6UM",
	"VITE_TELEGRAM_CHAT_ID": "1170515116"
}["VITE_SUPABASE_ANON_KEY"];
if (!url || !anonKey) throw new Error("إعدادات Supabase ناقصة. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY إلى ملف .env.local.");
/**
* Shared Supabase client for the public catalog (anonymous reads only).
* Single module-level instance — do not create additional clients.
* Auth flows are out of scope; the secret/service-role key must never
* be used here or anywhere in frontend code.
*/
var supabase = createClient(url, anonKey);
function toCatalogError(action, cause) {
	return {
		message: `تعذر ${action}. حصل خطأ، حاول تاني.`,
		cause
	};
}
function toProduct(row) {
	return {
		...row,
		price: Number(row.price)
	};
}
var ACTIVE_ORDER_COLUMN = "sort_order";
/** Active categories ordered for display. */
async function getActiveCategories() {
	const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true });
	if (error) throw toCatalogError("تحميل الأقسام", error);
	return data ?? [];
}
/** Active subcategories of a category; empty array means show products directly. */
async function getActiveSubcategories(categoryId) {
	const { data, error } = await supabase.from("subcategories").select("*").eq("category_id", categoryId).eq("is_active", true).order("sort_order", { ascending: true });
	if (error) throw toCatalogError("تحميل الأقسام الفرعية", error);
	return data ?? [];
}
/** A category regardless of active flag (routing distinguishes missing vs inactive). */
async function getCategory(categoryId) {
	const { data, error } = await supabase.from("categories").select("*").eq("id", categoryId).maybeSingle();
	if (error) throw toCatalogError("تحميل القسم", error);
	return data ?? null;
}
/** A subcategory when it belongs to the given category, else null. */
async function getSubcategory(categoryId, subId) {
	const { data, error } = await supabase.from("subcategories").select("*").eq("id", subId).eq("category_id", categoryId).maybeSingle();
	if (error) throw toCatalogError("تحميل القسم الفرعي", error);
	return data ?? null;
}
function baseProductQuery() {
	return supabase.from("products").select("*").eq("is_active", true).order(ACTIVE_ORDER_COLUMN, { ascending: true });
}
/** Active products of a category, optionally narrowed to one subcategory. */
async function getActiveProducts(categoryId, subcategoryId) {
	let query = baseProductQuery().eq("category_id", categoryId);
	if (subcategoryId) query = query.eq("subcategory_id", subcategoryId);
	const { data, error } = await query;
	if (error) throw toCatalogError("تحميل المنتجات", error);
	return (data ?? []).map(toProduct);
}
/** Active featured products for the homepage most-ordered section. */
async function getFeaturedProducts(limit = 12) {
	const { data, error } = await baseProductQuery().eq("is_featured", true).limit(limit);
	if (error) throw toCatalogError("تحميل المنتجات المميزة", error);
	return (data ?? []).map(toProduct);
}
/** Active products for a batch of ids (single query — used to reconcile the local cart). */
async function getProductsByIds(ids) {
	if (ids.length === 0) return [];
	const { data, error } = await supabase.from("products").select("*").in("id", ids).eq("is_active", true);
	if (error) throw toCatalogError("تحميل المنتجات", error);
	return (data ?? []).map(toProduct);
}
/** A subcategory by id regardless of parent (banner target resolution). */
async function getSubcategoryById(subId) {
	const { data, error } = await supabase.from("subcategories").select("*").eq("id", subId).maybeSingle();
	if (error) throw toCatalogError("تحميل القسم الفرعي", error);
	return data ?? null;
}
/** A product regardless of active flag (detail page decides unavailable vs not-found).
* Now embeds the ordered active option tree (`option_groups`, [] when none). */
async function getProduct(productId) {
	const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();
	if (error) throw toCatalogError("تحميل المنتج", error);
	if (!data) return null;
	const product = toProduct(data);
	return {
		...product,
		option_groups: await getActiveOptionGroups(product.id)
	};
}
/** Active banners ordered for display. */
async function getActiveBanners() {
	const { data, error } = await supabase.from("banners").select("*").eq("is_active", true).order("sort_order", { ascending: true });
	if (error) throw toCatalogError("تحميل البنرات", error);
	return data ?? [];
}
/** Active delivery zones ordered for display (empty array is valid). */
async function getActiveZones() {
	const { data, error } = await supabase.from("delivery_zones").select("*").eq("is_active", true).order("sort_order", { ascending: true });
	if (error) throw toCatalogError("تحميل مناطق التوصيل", error);
	return (data ?? []).map((row) => ({
		...row,
		fee: Number(row.fee)
	}));
}
/** Case-insensitive substring search over active product names (blank → []). */
async function searchProducts(query) {
	const q = query.trim();
	if (!q) return [];
	const escaped = q.replace(/[%_\\]/g, (m) => `\\${m}`);
	const { data, error } = await supabase.from("products").select("*").eq("is_active", true).ilike("name", `%${escaped}%`).order("sort_order", { ascending: true }).limit(50);
	if (error) throw toCatalogError("البحث", error);
	return (data ?? []).map(toProduct);
}
function toProductOption(row) {
	return {
		...row,
		price_delta: Number(row.price_delta)
	};
}
/** Active option groups of a product (ordered), each with its active options (ordered). */
async function getActiveOptionGroups(productId) {
	const { data: groups, error: groupsError } = await supabase.from("product_option_groups").select("*").eq("product_id", productId).eq("is_active", true).order("sort_order", { ascending: true });
	if (groupsError) throw toCatalogError("تحميل اختيارات المنتج", groupsError);
	if (!groups || groups.length === 0) return [];
	const groupIds = groups.map((g) => g.id);
	const { data: options, error: optionsError } = await supabase.from("product_options").select("*").in("option_group_id", groupIds).eq("is_active", true).order("sort_order", { ascending: true });
	if (optionsError) throw toCatalogError("تحميل اختيارات المنتج", optionsError);
	const byGroup = /* @__PURE__ */ new Map();
	for (const row of options ?? []) {
		const option = toProductOption(row);
		const list = byGroup.get(option.option_group_id) ?? [];
		list.push(option);
		byGroup.set(option.option_group_id, list);
	}
	return groups.map((group) => ({
		...group,
		options: byGroup.get(group.id) ?? []
	})).filter((group) => group.options.length > 0);
}
/** Maps each product id to whether it has any active option group with an active option. */
async function getProductsWithOptions(ids) {
	if (ids.length === 0) return {};
	const { data, error } = await supabase.from("product_option_groups").select("product_id, product_options!inner(id)").in("product_id", ids).eq("is_active", true).eq("product_options.is_active", true);
	if (error) throw toCatalogError("تحميل اختيارات المنتجات", error);
	const result = {};
	for (const id of ids) result[id] = false;
	for (const row of data ?? []) result[row.product_id] = true;
	return result;
}
/** Deterministic line key so identical configurations merge into one line. */
function lineKeyFor(id, selections = []) {
	if (selections.length === 0) return id;
	return `${id}::${[...selections].map((s) => s.optionId).sort().join(".")}`;
}
/** Unit price = base + selected deltas (legacy items carry full price, zero deltas). */
function unitPriceOf(item) {
	const deltas = (item.selectedOptions ?? []).reduce((n, s) => n + s.priceDelta, 0);
	return item.price + deltas;
}
function normalizeItem(raw) {
	const selections = raw.selectedOptions ?? [];
	return {
		...raw,
		qty: raw.qty ?? 1,
		selectedOptions: selections,
		key: raw.key || lineKeyFor(raw.id, selections)
	};
}
var STORAGE_KEY = "nahla-cart-v1";
var CartContext = (0, import_react.createContext)(null);
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setItems(JSON.parse(raw).map((i) => normalizeItem(i)));
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}, [items, hydrated]);
	const add = (0, import_react.useCallback)((item, qty = 1) => {
		const line = normalizeItem(item);
		setItems((prev) => {
			if (prev.find((i) => i.key === line.key)) return prev.map((i) => i.key === line.key ? {
				...i,
				qty: i.qty + qty
			} : i);
			return [...prev, {
				...line,
				qty
			}];
		});
	}, []);
	const increase = (0, import_react.useCallback)((key) => {
		setItems((prev) => prev.map((i) => i.key === key ? {
			...i,
			qty: i.qty + 1
		} : i));
	}, []);
	const decrease = (0, import_react.useCallback)((key) => {
		setItems((prev) => prev.flatMap((i) => i.key === key ? i.qty > 1 ? [{
			...i,
			qty: i.qty - 1
		}] : [] : [i]));
	}, []);
	const remove = (0, import_react.useCallback)((key) => {
		setItems((prev) => prev.filter((i) => i.key !== key));
	}, []);
	const clear = (0, import_react.useCallback)(() => setItems([]), []);
	const value = (0, import_react.useMemo)(() => ({
		items,
		count: items.reduce((n, i) => n + i.qty, 0),
		total: items.reduce((n, i) => n + i.qty * unitPriceOf(i), 0),
		qtyOf: (id) => items.filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0),
		add,
		increase,
		decrease,
		remove,
		clear
	}), [
		items,
		add,
		increase,
		decrease,
		remove,
		clear
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
function useCart() {
	const ctx = (0, import_react.useContext)(CartContext);
	if (!ctx) throw new Error("useCart must be used inside CartProvider");
	return ctx;
}
/**
* Reconciles local cart items with the live catalog in one query.
* Returns a map of item id → live product for items that still exist and
* are active. Items missing from the map are deleted, inactive, or legacy
* (pre-migration) ids and must be treated as unavailable. While `live` is
* null the lookup is still in flight and callers should fall back to the
* stored snapshot values.
*/
function useLiveProducts() {
	const { items } = useCart();
	const [live, setLive] = (0, import_react.useState)(null);
	const idsKey = items.filter((i) => !i.note).map((i) => i.id).sort().join(",");
	(0, import_react.useEffect)(() => {
		const ids = idsKey === "" ? [] : idsKey.split(",");
		if (ids.length === 0) {
			setLive(/* @__PURE__ */ new Map());
			return;
		}
		let cancelled = false;
		setLive(null);
		getProductsByIds(ids).then((products) => {
			if (!cancelled) setLive(new Map(products.map((p) => [p.id, p])));
		}, () => {
			if (!cancelled) setLive(/* @__PURE__ */ new Map());
		});
		return () => {
			cancelled = true;
		};
	}, [idsKey]);
	return { live };
}
//#endregion
export { getActiveSubcategories as a, getFeaturedProducts as c, getSubcategory as d, getSubcategoryById as f, useLiveProducts as h, getActiveProducts as i, getProduct as l, useCart as m, getActiveBanners as n, getActiveZones as o, searchProducts as p, getActiveCategories as r, getCategory as s, CartProvider as t, getProductsWithOptions as u };
