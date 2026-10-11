import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductsByIds, type Product } from "./catalog";

export type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
};

export type CartItem = {
  /** Stable line key: product id alone, or id + sorted selection ids. */
  key: string;
  id: string;
  name: string;
  /** Base product price at add time (live base preferred at display). */
  price: number;
  icon: string;
  image?: string | null;
  qty: number;
  note?: string;
  selectedOptions?: SelectedOption[];
  /** Custom-order context: the subcategory this request belongs to. */
  subcategoryId?: string;
  subcategoryName?: string;
};

/** Deterministic line key so identical configurations merge into one line. */
export function lineKeyFor(id: string, selections: SelectedOption[] = []): string {
  if (selections.length === 0) return id;
  const sig = [...selections]
    .map((s) => s.optionId)
    .sort()
    .join(".");
  return `${id}::${sig}`;
}

/** Unit price = base + selected deltas (legacy items carry full price, zero deltas). */
export function unitPriceOf(item: Pick<CartItem, "price" | "selectedOptions">): number {
  const deltas = (item.selectedOptions ?? []).reduce((n, s) => n + s.priceDelta, 0);
  return item.price + deltas;
}

function normalizeItem(raw: Omit<CartItem, "qty" | "key"> & { key?: string; qty?: number }): CartItem {
  const selections = raw.selectedOptions ?? [];
  return {
    ...raw,
    qty: raw.qty ?? 1,
    selectedOptions: selections,
    key: raw.key || lineKeyFor(raw.id, selections),
  };
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  add: (item: Omit<CartItem, "qty" | "key">, qty?: number) => void;
  increase: (key: string) => void;
  decrease: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "nahla-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems((JSON.parse(raw) as CartItem[]).map((i) => normalizeItem(i)));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "qty" | "key">, qty = 1) => {
    const line = normalizeItem(item);
    setItems((prev) => {
      const found = prev.find((i) => i.key === line.key);
      if (found) return prev.map((i) => (i.key === line.key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...line, qty }];
    });
  }, []);

  const increase = useCallback((key: string) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)));
  }, []);

  const decrease = useCallback((key: string) => {
    setItems((prev) =>
      prev.flatMap((i) => (i.key === key ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * unitPriceOf(i), 0),
      qtyOf: (id: string) => items.filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0),
      add,
      increase,
      decrease,
      remove,
      clear,
    }),
    [items, add, increase, decrease, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
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
export function useLiveProducts() {
  const { items } = useCart();
  const [live, setLive] = useState<Map<string, Product> | null>(null);
  const idsKey = items
    .filter((i) => !i.note)
    .map((i) => i.id)
    .sort()
    .join(",");

  useEffect(() => {
    const ids = idsKey === "" ? [] : idsKey.split(",");
    if (ids.length === 0) {
      setLive(new Map());
      return;
    }
    let cancelled = false;
    setLive(null);
    getProductsByIds(ids).then(
      (products) => {
        if (!cancelled) setLive(new Map(products.map((p) => [p.id, p])));
      },
      () => {
        if (!cancelled) setLive(new Map());
      },
    );
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  return { live };
}
