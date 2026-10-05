import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime, k as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DumUo7Sd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toAdminError(fallback, cause) {
	const code = cause?.code;
	if (code === "23505") {
		if (String(cause.details ?? "").includes("product_options")) return {
			message: "اسم الخيار مستخدم بالفعل داخل هذه المجموعة.",
			cause
		};
		return {
			message: "هذا الاسم مستخدم بالفعل.",
			cause
		};
	}
	if (code === "23514") return {
		message: "القيم المدخلة غير صالحة لهذه المجموعة.",
		cause
	};
	if (code === "42501") return {
		message: "غير مصرح لك بتنفيذ هذه العملية.",
		cause
	};
	return {
		message: fallback,
		cause
	};
}
var sessionClient = null;
/** Session-persisted client for manager operations (separate storage key). */
function getSessionClient() {
	if (sessionClient) return sessionClient;
	const url = {
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
	const anonKey = {
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
	sessionClient = createClient(url, anonKey, { auth: {
		storageKey: "nahla-admin-auth",
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: false
	} });
	return sessionClient;
}
async function signInManager(email, password) {
	const { error } = await getSessionClient().auth.signInWithPassword({
		email,
		password
	});
	if (error) throw toAdminError("بيانات الدخول غير صحيحة.", error);
	if (!await getManagerSession()) {
		await getSessionClient().auth.signOut();
		throw toAdminError("هذا الحساب ليس لديه صلاحية الإدارة.", null);
	}
}
/** Manager session only when the user holds an admin_profiles row (DB-side truth). */
async function getManagerSession() {
	const client = getSessionClient();
	const { data, error } = await client.auth.getSession();
	if (error || !data.session?.user) return null;
	const { data: profile, error: profileError } = await client.from("admin_profiles").select("id").eq("id", data.session.user.id).maybeSingle();
	if (profileError || !profile) return null;
	return { user: data.session.user };
}
async function signOutManager() {
	await getSessionClient().auth.signOut();
}
async function onManagerAuthChange(callback) {
	const client = getSessionClient();
	const { data } = client.auth.onAuthStateChange(async (_event, session) => {
		if (!session?.user) {
			callback(null);
			return;
		}
		const { data: profile } = await client.from("admin_profiles").select("id").eq("id", session.user.id).maybeSingle();
		callback(profile ? { user: session.user } : null);
	});
	return () => data.subscription.unsubscribe();
}
var ORDER = { ascending: true };
async function listCategoriesAdmin() {
	const { data, error } = await getSessionClient().from("categories").select("*").order("sort_order", ORDER);
	if (error) throw toAdminError("تعذر تحميل التصنيفات.", error);
	return data ?? [];
}
async function listSubcategoriesAdmin(categoryId) {
	let query = getSessionClient().from("subcategories").select("*").order("sort_order", ORDER);
	if (categoryId) query = query.eq("category_id", categoryId);
	const { data, error } = await query;
	if (error) throw toAdminError("تعذر تحميل التصنيفات الفرعية.", error);
	return data ?? [];
}
async function listProductsAdmin(filters = {}) {
	let query = getSessionClient().from("products").select("*").order("sort_order", ORDER);
	if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
	if (filters.subcategoryId) query = query.eq("subcategory_id", filters.subcategoryId);
	if (filters.isActive !== void 0) query = query.eq("is_active", filters.isActive);
	if (filters.query?.trim()) {
		const q = filters.query.trim().replace(/[%_\\]/g, (m) => `\\${m}`);
		query = query.ilike("name", `%${q}%`);
	}
	const { data, error } = await query;
	if (error) throw toAdminError("تعذر تحميل المنتجات.", error);
	return (data ?? []).map((row) => ({
		...row,
		price: Number(row.price)
	}));
}
async function getProductAdmin(id) {
	const client = getSessionClient();
	const { data: product, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
	if (error) throw toAdminError("تعذر تحميل المنتج.", error);
	if (!product) return null;
	const base = {
		...product,
		price: Number(product.price)
	};
	const { data: groups, error: groupsError } = await client.from("product_option_groups").select("*").eq("product_id", id).order("sort_order", ORDER);
	if (groupsError) throw toAdminError("تعذر تحميل مجموعات الخيارات.", groupsError);
	const groupIds = (groups ?? []).map((g) => g.id);
	let options = [];
	if (groupIds.length > 0) {
		const { data: opts, error: optsError } = await client.from("product_options").select("*").in("option_group_id", groupIds).order("sort_order", ORDER);
		if (optsError) throw toAdminError("تعذر تحميل الاختيارات.", optsError);
		options = (opts ?? []).map((row) => ({
			...row,
			price_delta: Number(row.price_delta)
		}));
	}
	return {
		...base,
		option_groups: (groups ?? []).map((group) => ({
			...group,
			options: options.filter((o) => o.option_group_id === group.id)
		}))
	};
}
async function listBannersAdmin() {
	const { data, error } = await getSessionClient().from("banners").select("*").order("sort_order", ORDER);
	if (error) throw toAdminError("تعذر تحميل البنرات.", error);
	return data ?? [];
}
async function dashboardCounts() {
	const client = getSessionClient();
	const [cats, prods, banners, groups] = await Promise.all([
		client.from("categories").select("id", {
			count: "exact",
			head: true
		}).eq("is_active", true),
		client.from("products").select("id", {
			count: "exact",
			head: true
		}).eq("is_active", true),
		client.from("banners").select("id", {
			count: "exact",
			head: true
		}).eq("is_active", true),
		client.from("product_option_groups").select("product_id").eq("is_active", true)
	]);
	const err = cats.error ?? prods.error ?? banners.error ?? groups.error;
	if (err) throw toAdminError("تعذر تحميل الإحصائيات.", err);
	const configurable = new Set((groups.data ?? []).map((g) => g.product_id)).size;
	return {
		categories: cats.count ?? 0,
		products: prods.count ?? 0,
		banners: banners.count ?? 0,
		configurable
	};
}
async function saveCategory(id, input) {
	const client = getSessionClient();
	const payload = { ...input };
	const { error } = id === null ? await client.from("categories").insert(payload) : await client.from("categories").update(payload).eq("id", id);
	if (error) throw toAdminError("تعذر حفظ التصنيف.", error);
}
async function deleteCategory(id) {
	const { error } = await getSessionClient().from("categories").delete().eq("id", id);
	if (error) throw toAdminError("تعذر حذف التصنيف.", error);
}
async function saveSubcategory(id, input) {
	const client = getSessionClient();
	const { error } = id === null ? await client.from("subcategories").insert(input) : await client.from("subcategories").update(input).eq("id", id);
	if (error) throw toAdminError("تعذر حفظ التصنيف الفرعي.", error);
}
async function deleteSubcategory(id) {
	const { error } = await getSessionClient().from("subcategories").delete().eq("id", id);
	if (error) throw toAdminError("تعذر حذف التصنيف الفرعي.", error);
}
async function saveProduct(id, input) {
	const client = getSessionClient();
	if (id === null) {
		const { data, error } = await client.from("products").insert(input).select("id").single();
		if (error) throw toAdminError("تعذر حفظ المنتج.", error);
		return data.id;
	}
	const { error } = await client.from("products").update(input).eq("id", id);
	if (error) throw toAdminError("تعذر حفظ المنتج.", error);
	return id;
}
async function deleteProduct(id) {
	const { error } = await getSessionClient().from("products").delete().eq("id", id);
	if (error) throw toAdminError("تعذر حذف المنتج.", error);
}
async function saveOptionGroup(productId, id, input) {
	const client = getSessionClient();
	if (id === null) {
		const { data, error } = await client.from("product_option_groups").insert({
			...input,
			product_id: productId
		}).select("id").single();
		if (error) throw toAdminError("تعذر حفظ المجموعة.", error);
		return data.id;
	}
	const { error } = await client.from("product_option_groups").update(input).eq("id", id);
	if (error) throw toAdminError("تعذر حفظ المجموعة.", error);
	return id;
}
async function deleteOptionGroup(id) {
	const { error } = await getSessionClient().from("product_option_groups").delete().eq("id", id);
	if (error) throw toAdminError("تعذر حذف المجموعة.", error);
}
async function saveOption(groupId, id, input) {
	const client = getSessionClient();
	if (id === null) {
		const { data, error } = await client.from("product_options").insert({
			...input,
			option_group_id: groupId
		}).select("id").single();
		if (error) throw toAdminError("تعذر حفظ الاختيار.", error);
		return data.id;
	}
	const { error } = await client.from("product_options").update(input).eq("id", id);
	if (error) throw toAdminError("تعذر حفظ الاختيار.", error);
	return id;
}
async function deleteOption(id) {
	const { error } = await getSessionClient().from("product_options").delete().eq("id", id);
	if (error) throw toAdminError("تعذر حذف الاختيار.", error);
}
async function saveBanner(id, input) {
	const client = getSessionClient();
	const { error } = id === null ? await client.from("banners").insert(input) : await client.from("banners").update(input).eq("id", id);
	if (error) throw toAdminError("تعذر حفظ البنر.", error);
}
async function deleteBanner(id) {
	const { error } = await getSessionClient().from("banners").delete().eq("id", id);
	if (error) throw toAdminError("تعذر حذف البنر.", error);
}
/** Upload-then-save: returns the public URL; throws on failure (caller must not save without it). */
async function uploadImage(prefix, file) {
	const client = getSessionClient();
	const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
	const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
	const { error } = await client.storage.from("nahla-images").upload(path, file, { contentType: file.type || "image/jpeg" });
	if (error) throw toAdminError("تعذر رفع الصورة.", error);
	const { data } = client.storage.from("nahla-images").getPublicUrl(path);
	return data.publicUrl;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { saveSubcategory as C, uploadImage as E, saveProduct as S, signOutManager as T, onManagerAuthChange as _, deleteBanner as a, saveOption as b, deleteOptionGroup as c, getManagerSession as d, getProductAdmin as f, listSubcategoriesAdmin as g, listProductsAdmin as h, dashboardCounts as i, deleteProduct as l, listCategoriesAdmin as m, buttonVariants as n, deleteCategory as o, listBannersAdmin as p, cn as r, deleteOption as s, Button as t, deleteSubcategory as u, saveBanner as v, signInManager as w, saveOptionGroup as x, saveCategory as y };
