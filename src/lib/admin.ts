import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type {
  Banner,
  Category,
  ConfiguredProduct,
  DeliveryZone,
  OptionGroup,
  Product,
  ProductOption,
  Subcategory,
} from "./catalog";

export type AdminError = { message: string; cause?: unknown };

function toAdminError(fallback: string, cause: unknown): AdminError {
  const code = (cause as { code?: string } | null)?.code;
  if (code === "23505") {
    const detail = String((cause as { details?: string }).details ?? "");
    if (detail.includes("product_options")) return { message: "اسم الخيار مستخدم بالفعل داخل هذه المجموعة.", cause };
    return { message: "هذا الاسم مستخدم بالفعل.", cause };
  }
  if (code === "23514") return { message: "القيم المدخلة غير صالحة لهذه المجموعة.", cause };
  if (code === "42501") return { message: "غير مصرح لك بتنفيذ هذه العملية.", cause };
  return { message: fallback, cause };
}

let sessionClient: SupabaseClient | null = null;

/** Session-persisted client for manager operations (separate storage key). */
export function getSessionClient(): SupabaseClient {
  if (sessionClient) return sessionClient;
  const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;
  if (!url || !anonKey) {
    throw new Error("إعدادات Supabase ناقصة. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY إلى ملف .env.local.");
  }
  sessionClient = createClient(url, anonKey, {
    auth: { storageKey: "nahla-admin-auth", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return sessionClient;
}

export async function signInManager(email: string, password: string): Promise<void> {
  const { error } = await getSessionClient().auth.signInWithPassword({ email, password });
  if (error) throw toAdminError("بيانات الدخول غير صحيحة.", error);
  const session = await getManagerSession();
  if (!session) {
    await getSessionClient().auth.signOut();
    throw toAdminError("هذا الحساب ليس لديه صلاحية الإدارة.", null);
  }
}

/** Manager session only when the user holds an admin_profiles row (DB-side truth). */
export async function getManagerSession(): Promise<{ user: User } | null> {
  const client = getSessionClient();
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.user) return null;
  const { data: profile, error: profileError } = await client
    .from("admin_profiles")
    .select("id")
    .eq("id", data.session.user.id)
    .maybeSingle();
  if (profileError || !profile) return null;
  return { user: data.session.user };
}

export async function signOutManager(): Promise<void> {
  await getSessionClient().auth.signOut();
}

export async function onManagerAuthChange(callback: (session: { user: User } | null) => void) {
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

const ORDER = { ascending: true };

// ---------- Unfiltered reads (inactive included) ----------

export async function listCategoriesAdmin(): Promise<Category[]> {
  const { data, error } = await getSessionClient().from("categories").select("*").order("sort_order", ORDER);
  if (error) throw toAdminError("تعذر تحميل التصنيفات.", error);
  return (data ?? []) as Category[];
}

export async function listSubcategoriesAdmin(categoryId?: string): Promise<Subcategory[]> {
  let query = getSessionClient().from("subcategories").select("*").order("sort_order", ORDER);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) throw toAdminError("تعذر تحميل التصنيفات الفرعية.", error);
  return (data ?? []) as Subcategory[];
}

export type ProductFilters = { categoryId?: string; subcategoryId?: string; isActive?: boolean; query?: string };

export async function listProductsAdmin(filters: ProductFilters = {}): Promise<Product[]> {
  let query = getSessionClient().from("products").select("*").order("sort_order", ORDER);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.subcategoryId) query = query.eq("subcategory_id", filters.subcategoryId);
  if (filters.isActive !== undefined) query = query.eq("is_active", filters.isActive);
  if (filters.query?.trim()) {
    const q = filters.query.trim().replace(/[%_\\]/g, (m) => `\\${m}`);
    query = query.ilike("name", `%${q}%`);
  }
  const { data, error } = await query;
  if (error) throw toAdminError("تعذر تحميل المنتجات.", error);
  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    ...(row as unknown as Product),
    price: Number((row as { price: string | number }).price),
  }));
}

export async function getProductAdmin(id: string): Promise<ConfiguredProduct | null> {
  const client = getSessionClient();
  const { data: product, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw toAdminError("تعذر تحميل المنتج.", error);
  if (!product) return null;
  const base = {
    ...(product as unknown as Product),
    price: Number((product as { price: string | number }).price),
  };
  const { data: groups, error: groupsError } = await client
    .from("product_option_groups")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", ORDER);
  if (groupsError) throw toAdminError("تعذر تحميل مجموعات الخيارات.", groupsError);
  const groupIds = ((groups ?? []) as { id: string }[]).map((g) => g.id);
  let options: ProductOption[] = [];
  if (groupIds.length > 0) {
    const { data: opts, error: optsError } = await client
      .from("product_options")
      .select("*")
      .in("option_group_id", groupIds)
      .order("sort_order", ORDER);
    if (optsError) throw toAdminError("تعذر تحميل الاختيارات.", optsError);
    options = ((opts ?? []) as Record<string, unknown>[]).map((row) => ({
      ...(row as unknown as ProductOption),
      price_delta: Number((row as { price_delta: string | number }).price_delta),
    }));
  }
  return {
    ...base,
    option_groups: ((groups ?? []) as OptionGroup[]).map((group) => ({
      ...group,
      options: options.filter((o) => o.option_group_id === group.id),
    })),
  };
}

export async function listBannersAdmin(): Promise<Banner[]> {
  const { data, error } = await getSessionClient().from("banners").select("*").order("sort_order", ORDER);
  if (error) throw toAdminError("تعذر تحميل البنرات.", error);
  return (data ?? []) as Banner[];
}

export async function dashboardCounts(): Promise<{ categories: number; products: number; banners: number; configurable: number }> {
  const client = getSessionClient();
  const [cats, prods, banners, groups] = await Promise.all([
    client.from("categories").select("id", { count: "exact", head: true }).eq("is_active", true),
    client.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    client.from("banners").select("id", { count: "exact", head: true }).eq("is_active", true),
    client.from("product_option_groups").select("product_id").eq("is_active", true),
  ]);
  const err = cats.error ?? prods.error ?? banners.error ?? groups.error;
  if (err) throw toAdminError("تعذر تحميل الإحصائيات.", err);
  const configurable = new Set(((groups.data ?? []) as { product_id: string }[]).map((g) => g.product_id)).size;
  return {
    categories: cats.count ?? 0,
    products: prods.count ?? 0,
    banners: banners.count ?? 0,
    configurable,
  };
}

// ---------- Writes ----------

export type CategoryInput = {
  name: string;
  icon?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  type: "normal" | "custom_order";
};

export async function saveCategory(id: string | null, input: CategoryInput): Promise<void> {
  const client = getSessionClient();
  const payload = { ...input };
  const { error } =
    id === null
      ? await client.from("categories").insert(payload)
      : await client.from("categories").update(payload).eq("id", id);
  if (error) throw toAdminError("تعذر حفظ التصنيف.", error);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await getSessionClient().from("categories").delete().eq("id", id);
  if (error) throw toAdminError("تعذر حذف التصنيف.", error);
}

export type SubcategoryInput = {
  category_id: string;
  name: string;
  icon?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  requires_preorder: boolean;
};

export async function saveSubcategory(id: string | null, input: SubcategoryInput): Promise<void> {
  const client = getSessionClient();
  const { error } =
    id === null
      ? await client.from("subcategories").insert(input)
      : await client.from("subcategories").update(input).eq("id", id);
  if (error) throw toAdminError("تعذر حفظ التصنيف الفرعي.", error);
}

export async function deleteSubcategory(id: string): Promise<void> {
  const { error } = await getSessionClient().from("subcategories").delete().eq("id", id);
  if (error) throw toAdminError("تعذر حذف التصنيف الفرعي.", error);
}

export type ProductInput = {
  category_id: string;
  subcategory_id: string | null;
  name: string;
  price: number;
  icon?: string | null;
  image_url?: string | null;
  description?: string | null;
  unit?: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
};

export async function saveProduct(id: string | null, input: ProductInput): Promise<string> {
  const client = getSessionClient();
  if (id === null) {
    const { data, error } = await client.from("products").insert(input).select("id").single();
    if (error) throw toAdminError("تعذر حفظ المنتج.", error);
    return (data as { id: string }).id;
  }
  const { error } = await client.from("products").update(input).eq("id", id);
  if (error) throw toAdminError("تعذر حفظ المنتج.", error);
  return id;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await getSessionClient().from("products").delete().eq("id", id);
  if (error) throw toAdminError("تعذر حذف المنتج.", error);
}

export type OptionGroupInput = {
  name: string;
  type: "single" | "multiple";
  min_selections: number;
  max_selections: number | null;
  sort_order: number;
  is_active: boolean;
};

export async function saveOptionGroup(productId: string, id: string | null, input: OptionGroupInput): Promise<string> {
  const client = getSessionClient();
  if (id === null) {
    const { data, error } = await client
      .from("product_option_groups")
      .insert({ ...input, product_id: productId })
      .select("id")
      .single();
    if (error) throw toAdminError("تعذر حفظ المجموعة.", error);
    return (data as { id: string }).id;
  }
  const { error } = await client.from("product_option_groups").update(input).eq("id", id);
  if (error) throw toAdminError("تعذر حفظ المجموعة.", error);
  return id;
}

export async function deleteOptionGroup(id: string): Promise<void> {
  const { error } = await getSessionClient().from("product_option_groups").delete().eq("id", id);
  if (error) throw toAdminError("تعذر حذف المجموعة.", error);
}

export type ProductOptionInput = {
  name: string;
  price_delta: number;
  sort_order: number;
  is_active: boolean;
};

export async function saveOption(groupId: string, id: string | null, input: ProductOptionInput): Promise<string> {
  const client = getSessionClient();
  if (id === null) {
    const { data, error } = await client
      .from("product_options")
      .insert({ ...input, option_group_id: groupId })
      .select("id")
      .single();
    if (error) throw toAdminError("تعذر حفظ الاختيار.", error);
    return (data as { id: string }).id;
  }
  const { error } = await client.from("product_options").update(input).eq("id", id);
  if (error) throw toAdminError("تعذر حفظ الاختيار.", error);
  return id;
}

export async function deleteOption(id: string): Promise<void> {
  const { error } = await getSessionClient().from("product_options").delete().eq("id", id);
  if (error) throw toAdminError("تعذر حذف الاختيار.", error);
}

export type BannerInput = {
  title?: string | null;
  image_url: string;
  link_type?: "category" | "subcategory" | "product" | "custom" | "none" | null;
  link_id?: string | null;
  link_url?: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function saveBanner(id: string | null, input: BannerInput): Promise<void> {
  const client = getSessionClient();
  const { error } =
    id === null ? await client.from("banners").insert(input) : await client.from("banners").update(input).eq("id", id);
  if (error) throw toAdminError("تعذر حفظ البنر.", error);
}

export async function deleteBanner(id: string): Promise<void> {
  const { error } = await getSessionClient().from("banners").delete().eq("id", id);
  if (error) throw toAdminError("تعذر حذف البنر.", error);
}

export async function listZonesAdmin(): Promise<DeliveryZone[]> {
  const { data, error } = await getSessionClient()
    .from("delivery_zones")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw toAdminError("تعذر تحميل مناطق التوصيل.", error);
  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    ...(row as unknown as DeliveryZone),
    fee: Number((row as { fee: string | number }).fee),
  }));
}

export type ZoneInput = {
  name: string;
  fee: number;
  sort_order: number;
  is_active: boolean;
};

export async function saveZone(id: string | null, input: ZoneInput): Promise<void> {
  const client = getSessionClient();
  const { error } =
    id === null
      ? await client.from("delivery_zones").insert(input)
      : await client.from("delivery_zones").update(input).eq("id", id);
  if (error) throw toAdminError("تعذر حفظ منطقة التوصيل.", error);
}

export async function deleteZone(id: string): Promise<void> {
  const { error } = await getSessionClient().from("delivery_zones").delete().eq("id", id);
  if (error) throw toAdminError("تعذر حذف منطقة التوصيل.", error);
}

/** Upload-then-save: returns the public URL; throws on failure (caller must not save without it). */
export async function uploadImage(prefix: "categories" | "subcategories" | "products" | "banners", file: File): Promise<string> {
  const client = getSessionClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await client.storage.from("nahla-images").upload(path, file, { contentType: file.type || "image/jpeg" });
  if (error) throw toAdminError("تعذر رفع الصورة.", error);
  const { data } = client.storage.from("nahla-images").getPublicUrl(path);
  return data.publicUrl;
}
