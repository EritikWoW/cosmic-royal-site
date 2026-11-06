"use client";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "./Cart";

export default function AddToCart({ item }: { item: CartItem }) {
  const cart = useCart();
  const router = useRouter();
  const inCart = cart.has(item.id);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <button className="btn btn-primary btn-block" onClick={() => { cart.add(item); router.push("/cart"); }}>
        {inCart ? "Перейти до кошика →" : "Купити зараз →"}
      </button>
      {!inCart && <button className="btn btn-secondary btn-block" onClick={() => cart.add(item)}>Додати до кошика</button>}
    </div>
  );
}
