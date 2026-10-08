import { supabase } from "./supabase";

export type CategoryType = "normal" | "custom_order";

export type Category = {
  id: string;
  name: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  type: CategoryType;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  requires_preorder: boolean;
};

export type Product = {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  price: number;
  icon: string | null;
  image_url: string | null;
  description: string | null;
  unit: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
};

export type BannerLinkType = "category" | "subcategory" | "product" | "custom" | "none";
export type Banner = {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  link_type: BannerLinkType | null;
  link_id: string | null;
  link_url: string | null;
};

export type CatalogError = {
  message: string;
  cause?: unknown;
};

function toCatalogError(action: string, cause: unknown): CatalogError {
  return {
    message: `تعذر ${action}. حصل خطأ، حاول تاني.`,
    cause,
  };
}

function toProduct(row: Record<string, unknown>): Product {
  return {
    ...(row as unknown as Product),
    price: Number((row as { price: string | number }).price),
  };
}

const ACTIVE_ORDER_COLUMN = "sort_order";

/** Active categories ordered for display. */
export async function getActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw toCatalogError("تحميل الأقسام", error);
  return (data ?? []) as Category[];
}

/** Active subcategories of a category; empty array means show products directly. */
export async function getActiveSubcategories(categoryId: string): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw toCatalogError("تحميل الأقسام الفرعية", error);
  return (data ?? []) as Subcategory[];
}

/** A category regardless of active flag (routing distinguishes missing vs inactive). */
export async function getCategory(categoryId: string): Promise<Category | null> {
  const { data, error } = await supabase.from("categories").select("*").eq("id", categoryId).maybeSingle();
  if (error) throw toCatalogError("تحميل القسم", error);
  return (data ?? null) as Category | null;
}

/** A subcategory when it belongs to the given category, else null. */
export async function getSubcategory(categoryId: string, subId: string): Promise<Subcategory | null> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("id", subId)
    .eq("category_id", categoryId)
    .maybeSingle();
  if (error) throw toCatalogError("تحميل القسم الفرعي", error);
  return (data ?? null) as Subcategory | null;
}

function baseProductQuery() {
  return supabase.from("products").select("*").eq("is_active", true).order(ACTIVE_ORDER_COLUMN, { ascending: true });
}

/** Active products of a category, optionally narrowed to one subcategory. */
export async function getActiveProducts(categoryId: string, subcategoryId?: string): Promise<Product[]> {
  let query = baseProductQuery().eq("category_id", categoryId);
  if (subcategoryId) query = query.eq("subcategory_id", subcategoryId);
  const { data, error } = await query;
  if (error) throw toCatalogError("تحميل المنتجات", error);
  return ((data ?? []) as Record<string, unknown>[]).map(toProduct);
}

/** Active featured products for the homepage most-ordered section. */
export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const { data, error } = await baseProductQuery().eq("is_featured", true).limit(limit);
  if (error) throw toCatalogError("تحميل المنتجات المميزة", error);
  return ((data ?? []) as Record<string, unknown>[]).map(toProduct);
}

/** Active products for a batch of ids (single query — used to reconcile the local cart). */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("is_active", true);
  if (error) throw toCatalogError("تحميل المنتجات", error);
  return ((data ?? []) as Record<string, unknown>[]).map(toProduct);
}

/** A subcategory by id regardless of parent (banner target resolution). */
export async function getSubcategoryById(subId: string): Promise<Subcategory | null> {
  const { data, error } = await supabase.from("subcategories").select("*").eq("id", subId).maybeSingle();
  if (error) throw toCatalogError("تحميل القسم الفرعي", error);
  return (data ?? null) as Subcategory | null;
}

/** A product regardless of active flag (detail page decides unavailable vs not-found).
 * Now embeds the ordered active option tree (`option_groups`, [] when none). */
export async function getProduct(productId: string): Promise<ConfiguredProduct | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();
  if (error) throw toCatalogError("تحميل المنتج", error);
  if (!data) return null;
  const product = toProduct(data as Record<string, unknown>);
  return { ...product, option_groups: await getActiveOptionGroups(product.id) };
}

/** Active banners ordered for display. */
export async function getActiveBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw toCatalogError("تحميل البنرات", error);
  return (data ?? []) as Banner[];
}

export type DeliveryZone = {
  id: string;
  name: string;
  fee: number;
  sort_order: number;
  is_active: boolean;
};

/** Active delivery zones ordered for display (empty array is valid). */
export async function getActiveZones(): Promise<DeliveryZone[]> {
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw toCatalogError("تحميل مناطق التوصيل", error);
  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    ...(row as unknown as DeliveryZone),
    fee: Number((row as { fee: string | number }).fee),
  }));
}

/** Service fee percent (key `service_fee_percent`); 0 when unset/invalid. */
export async function getServiceFeePercent(): Promise<number> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "service_fee_percent")
    .maybeSingle();
  if (error) throw toCatalogError("تحميل نسبة الخدمة", error);
  const parsed = Number((data as { value?: string } | null)?.value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(parsed, 100);
}

/** Case-insensitive substring search over active product names (blank → []). */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  const escaped = q.replace(/[%_\\]/g, (m) => `\\${m}`);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .ilike("name", `%${escaped}%`)
    .order("sort_order", { ascending: true })
    .limit(50);
  if (error) throw toCatalogError("البحث", error);
  return ((data ?? []) as Record<string, unknown>[]).map(toProduct);
}

export type OptionGroupType = "single" | "multiple";

export type OptionGroup = {
  id: string;
  product_id: string;
  name: string;
  type: OptionGroupType;
  min_selections: number;
  max_selections: number | null;
  sort_order: number;
  is_active: boolean;
};

export type ProductOption = {
  id: string;
  option_group_id: string;
  name: string;
  price_delta: number;
  sort_order: number;
  is_active: boolean;
};

export type ConfiguredGroup = OptionGroup & { options: ProductOption[] };

export type ConfiguredProduct = Product & { option_groups: ConfiguredGroup[] };

function toProductOption(row: Record<string, unknown>): ProductOption {
  return {
    ...(row as unknown as ProductOption),
    price_delta: Number((row as { price_delta: string | number }).price_delta),
  };
}

/** Active option groups of a product (ordered), each with its active options (ordered). */
export async function getActiveOptionGroups(productId: string): Promise<ConfiguredGroup[]> {
  const { data: groups, error: groupsError } = await supabase
    .from("product_option_groups")
    .select("*")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (groupsError) throw toCatalogError("تحميل اختيارات المنتج", groupsError);
  if (!groups || groups.length === 0) return [];
  const groupIds = (groups as OptionGroup[]).map((g) => g.id);
  const { data: options, error: optionsError } = await supabase
    .from("product_options")
    .select("*")
    .in("option_group_id", groupIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (optionsError) throw toCatalogError("تحميل اختيارات المنتج", optionsError);
  const byGroup = new Map<string, ProductOption[]>();
  for (const row of (options ?? []) as Record<string, unknown>[]) {
    const option = toProductOption(row);
    const list = byGroup.get(option.option_group_id) ?? [];
    list.push(option);
    byGroup.set(option.option_group_id, list);
  }
  return (groups as OptionGroup[])
    .map((group) => ({ ...group, options: byGroup.get(group.id) ?? [] }))
    .filter((group) => group.options.length > 0);
}

/** Maps each product id to whether it has any active option group with an active option. */
export async function getProductsWithOptions(ids: string[]): Promise<Record<string, boolean>> {
  if (ids.length === 0) return {};
  const { data, error } = await supabase
    .from("product_option_groups")
    .select("product_id, product_options!inner(id)")
    .in("product_id", ids)
    .eq("is_active", true)
    .eq("product_options.is_active", true);
  if (error) throw toCatalogError("تحميل اختيارات المنتجات", error);
  const result: Record<string, boolean> = {};
  for (const id of ids) result[id] = false;
  for (const row of (data ?? []) as { product_id: string }[]) result[row.product_id] = true;
  return result;
}
