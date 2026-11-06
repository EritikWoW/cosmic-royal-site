"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = { id: string; slug: string; title: string; price: number; cover: string };
type Ctx = { items: CartItem[]; add: (i: CartItem) => void; remove: (id: string) => void; clear: () => void; has: (id: string) => boolean; total: number };

const CartCtx = createContext<Ctx | null>(null);
const KEY = "cr_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v) setItems(JSON.parse(v)); } catch {}
  }, []);
  const save = (next: CartItem[]) => { setItems(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} };
  const value: Ctx = {
    items,
    add: (i) => { if (!items.some((x) => x.id === i.id)) save([...items, i]); },
    remove: (id) => save(items.filter((x) => x.id !== id)),
    clear: () => save([]),
    has: (id) => items.some((x) => x.id === id),
    total: items.reduce((s, x) => s + x.price, 0),
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};
