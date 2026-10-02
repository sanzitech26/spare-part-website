"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = { id: number; sku: string; name: string; price: number; image?: string; qty: number };
type Cart = {
  items: CartItem[];
  count: number;
  add: (i: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const KEY = "cart-v1";
const Ctx = createContext<Cart | null>(null);

// ponytail: cart lives in localStorage; checkout re-prices from the DB so stored prices are display-only
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount (SSR-safe)
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const cart: Cart = {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    add: (i, qty = 1) =>
      setItems((cur) =>
        cur.some((c) => c.id === i.id)
          ? cur.map((c) => (c.id === i.id ? { ...c, qty: c.qty + qty } : c))
          : [...cur, { ...i, qty }],
      ),
    setQty: (id, qty) => setItems((cur) => cur.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c))),
    remove: (id) => setItems((cur) => cur.filter((c) => c.id !== id)),
    clear: () => setItems([]),
  };
  return <Ctx.Provider value={cart}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};

export function CartBadge() {
  const { count } = useCart();
  return count > 0 ? (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand">{count}</span>
  ) : null;
}

export function AddToCart({ product, className = "" }: { product: Omit<CartItem, "qty">; className?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { add(product); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className={`rounded-full bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-brand ${className}`}
    >
      {done ? "Added ✓" : "Add to cart"}
    </button>
  );
}
