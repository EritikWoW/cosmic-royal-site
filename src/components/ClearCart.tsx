"use client";
import { useEffect } from "react";
import { useCart } from "./Cart";
export default function ClearCart() {
  const { clear, items } = useCart();
  useEffect(() => { if (items.length) clear(); }, [items.length, clear]);
  return null;
}
