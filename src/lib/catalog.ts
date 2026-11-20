import { supabase } from "./supabase";
import { SUPABASE_ENABLED } from "@/config/site";

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  { id: "default-zone", name: "توصيل عادي", fee: 0, sort_order: 1, is_active: true },
];

export const FALLBACK_CUSTOM_ORDER_CATEGORY: Category = {
  id: "custom-order",
  name: "طلب مخصص",
  icon: "✍️",
  image_url: null,
  sort_order: 1,
  is_active: true,
  type: "custom_order",
  has_filters: false,
};

export type CategoryType = "normal" | "custom_order";


export type Category = {
  id: string;
  name: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  type: CategoryType;
  has_filters: boolean;
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
  has_filters: boolean;
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
  if (!SUPABASE_ENABLED) {
    return [FALLBACK_CUSTOM_ORDER_CATEGORY];
  }
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw toCatalogError("تحميل الأقسام", error);
    return (data ?? []) as Category[];
  } catch (err) {
    console.error("getActiveCategories fallback:", err);
    return [FALLBACK_CUSTOM_ORDER_CATEGORY];
  }
}

/** Active subcategories of a category; empty array means show products directly. */
export async function getActiveSubcategories(categoryId: string): Promise<Subcategory[]> {
  if (!SUPABASE_ENABLED) return [];
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw toCatalogError("تحميل الأقسام الفرعية", error);
    return (data ?? []) as Subcategory[];
  } catch (err) {
    console.error("getActiveSubcategories fallback:", err);
    return [];
  }
}

/** A category regardless of active flag (routing distinguishes missing vs inactive). */
export async function getCategory(categoryId: string): Promise<Category | null> {
  if (!SUPABASE_ENABLED) {
    if (categoryId === "custom-order") return FALLBACK_CUSTOM_ORDER_CATEGORY;
    return null;
  }
  try {
    const { data, error } = await supabase.from("categories").select("*").eq("id", categoryId).maybeSingle();
    if (error) throw toCatalogError("تحميل القسم", error);
    return (data ?? null) as Category | null;
  } catch (err) {
    console.error("getCategory fallback:", err);
    return categoryId === "custom-order" ? FALLBACK_CUSTOM_ORDER_CATEGORY : null;
  }
}

/** A subcategory when it belongs to the given category, else null. */
export async function getSubcategory(categoryId: string, subId: string): Promise<Subcategory | null> {
  if (!SUPABASE_ENABLED) return null;
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("id", subId)
      .eq("category_id", categoryId)
      .maybeSingle();
    if (error) throw toCatalogError("تحميل القسم الفرعي", error);
    return (data ?? null) as Subcategory | null;
  } catch (err) {
    console.error("getSubcategory fallback:", err);
    return null;
  }
}

function baseProductQuery() {
  return supabase.from("products").select("*").eq("is_active", true).order(ACTIVE_ORDER_COLUMN, { ascending: true });
}

/** Active products of a category, optionally narrowed to one subcategory. */
export async function getActiveProducts(categoryId: string, subcategoryId?: string): Promise<Product[]> {
  if (!SUPABASE_ENABLED) return [];
  try {
    let query = baseProductQuery().eq("category_id", categoryId);
    if (subcategoryId) query = query.eq("subcategory_id", subcategoryId);
    const { data, error } = await query;
    if (error) throw toCatalogError("تحميل المنتجات", error);
    return ((data ?? []) as Record<string, unknown>[]).map(toProduct);
  } catch (err) {
    console.error("getActiveProducts fallback:", err);
    return [];
  }
}

/** Active featured products for the homepage most-ordered section. */
export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  if (!SUPABASE_ENABLED) return [];
  try {
    const { data, error } = await baseProductQuery().eq("is_featured", true).limit(limit);
    if (error) throw toCatalogError("تحميل المنتجات المميزة", error);
    return ((data ?? []) as Record<string, unknown>[]).map(toProduct);
  } catch (err) {
    console.error("getFeaturedProducts fallback:", err);
    return [];
  }
}

/** Active products for a batch of ids (single query — used to reconcile the local cart). */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!SUPABASE_ENABLED || ids.length === 0) return [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids)
      .eq("is_active", true);
    if (error) throw toCatalogError("تحميل المنتجات", error);
    return ((data ?? []) as Record<string, unknown>[]).map(toProduct);
  } catch (err) {
    console.error("getProductsByIds fallback:", err);
    return [];
  }
}

/** A subcategory by id regardless of parent (banner target resolution). */
export async function getSubcategoryById(subId: string): Promise<Subcategory | null> {
  if (!SUPABASE_ENABLED) return null;
  try {
    const { data, error } = await supabase.from("subcategories").select("*").eq("id", subId).maybeSingle();
    if (error) throw toCatalogError("تحميل القسم الفرعي", error);
    return (data ?? null) as Subcategory | null;
  } catch (err) {
    console.error("getSubcategoryById fallback:", err);
    return null;
  }
}

/** A product regardless of active flag (detail page decides unavailable vs not-found).
 * Now embeds the ordered active option tree (`option_groups`, [] when none). */
export async function getProduct(productId: string): Promise<ConfiguredProduct | null> {
  if (!SUPABASE_ENABLED) return null;
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();
    if (error) throw toCatalogError("تحميل المنتج", error);
    if (!data) return null;
    const product = toProduct(data as Record<string, unknown>);
    return { ...product, option_groups: await getActiveOptionGroups(product.id) };
  } catch (err) {
    console.error("getProduct fallback:", err);
    return null;
  }
}

/** Active banners ordered for display. */
export async function getActiveBanners(): Promise<Banner[]> {
  if (!SUPABASE_ENABLED) return [];
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw toCatalogError("تحميل البنرات", error);
    return (data ?? []) as Banner[];
  } catch (err) {
    console.error("getActiveBanners fallback:", err);
    return [];
  }
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
  if (!SUPABASE_ENABLED) return DEFAULT_DELIVERY_ZONES;
  try {
    const { data, error } = await supabase
      .from("delivery_zones")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw toCatalogError("تحميل مناطق التوصيل", error);
    const list = ((data ?? []) as Record<string, unknown>[]).map((row) => ({
      ...(row as unknown as DeliveryZone),
      fee: Number((row as { fee: string | number }).fee),
    }));
    return list.length > 0 ? list : DEFAULT_DELIVERY_ZONES;
  } catch (err) {
    console.error("getActiveZones fallback:", err);
    return DEFAULT_DELIVERY_ZONES;
  }
}

/** Service fee percent (key `service_fee_percent`); 0 when unset/invalid. */
export async function getServiceFeePercent(): Promise<number> {
  if (!SUPABASE_ENABLED) return 0;
  try {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "service_fee_percent")
      .maybeSingle();
    if (error) throw toCatalogError("تحميل نسبة الخدمة", error);
    const parsed = Number((data as { value?: string } | null)?.value);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return Math.min(parsed, 100);
  } catch (err) {
    console.error("getServiceFeePercent fallback:", err);
    return 0;
  }
}

/**
 * Reserves the next sequential order number for today's business day
 * (resets daily at 09:00 Cairo time). Atomic server-side; throws when
 * the counter is unreachable so the order is never sent numberless.
 */
export async function nextOrderNumber(): Promise<number> {
  if (!SUPABASE_ENABLED) {
    return Math.floor(1000 + Math.random() * 9000);
  }
  try {
    const { data, error } = await supabase.rpc("next_order_number");
    if (error) throw toCatalogError("إنشاء رقم الطلب", error);
    const n = Number(data);
    if (!Number.isInteger(n) || n <= 0) throw toCatalogError("إنشاء رقم الطلب", data);
    return n;
  } catch (err) {
    console.error("nextOrderNumber fallback:", err);
    return Math.floor(1000 + Math.random() * 9000);
  }
}

/** Case-insensitive substring search over active product names (blank → []). */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!SUPABASE_ENABLED) return [];
  const q = query.trim();
  if (!q) return [];
  try {
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
  } catch (err) {
    console.error("searchProducts fallback:", err);
    return [];
  }
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
  image_url: string | null;
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
  if (!SUPABASE_ENABLED) return [];
  try {
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
  } catch (err) {
    console.error("getActiveOptionGroups fallback:", err);
    return [];
  }
}

export type DisplayFilter = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export type ProductWithFilter = Product & { filter_id: string | null };

/**
 * Active display-filter values of an enabled section, ordered.
 * Empty array when the section is disabled, missing, or has no values
 * (caller hides the chip bar).
 */
export async function getSectionFilters(
  kind: "subcategory" | "category",
  id: string,
): Promise<DisplayFilter[]> {
  if (!SUPABASE_ENABLED) return [];
  try {
    const column = kind === "subcategory" ? "subcategory_id" : "category_id";
    const { data, error } = await supabase
      .from("subcategory_filters")
      .select("id,name,sort_order,is_active")
      .eq(column, id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw toCatalogError("تحميل فلاتر العرض", error);
    return (data ?? []) as DisplayFilter[];
  } catch (err) {
    console.error("getSectionFilters fallback:", err);
    return [];
  }
}

/**
 * Same rows as getActiveProducts plus each row's filter id (null when
 * unassigned), via one constant-cost mapping query — no N+1.
 */
export async function getProductsWithFilters(
  categoryId: string,
  subcategoryId?: string,
): Promise<ProductWithFilter[]> {
  if (!SUPABASE_ENABLED) return [];
  try {
    const products = await getActiveProducts(categoryId, subcategoryId);
    if (products.length === 0) return [];
    const { data, error } = await supabase
      .from("product_filter_values")
      .select("product_id,filter_id")
      .in(
        "product_id",
        products.map((p) => p.id),
      );
    if (error) throw toCatalogError("تحميل فلاتر المنتجات", error);
    const mapping = new Map(((data ?? []) as { product_id: string; filter_id: string }[]).map((row) => [row.product_id, row.filter_id]));
    return products.map((p) => ({ ...p, filter_id: mapping.get(p.id) ?? null }));
  } catch (err) {
    console.error("getProductsWithFilters fallback:", err);
    return [];
  }
}

/** Maps each product id to whether it has any active option group with an active option. */
export async function getProductsWithOptions(ids: string[]): Promise<Record<string, boolean>> {
  if (!SUPABASE_ENABLED || ids.length === 0) return {};
  try {
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
  } catch (err) {
    console.error("getProductsWithOptions fallback:", err);
    return {};
  }
}

