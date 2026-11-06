import { getUser } from "@/lib/auth";
import CartView from "@/components/CartView";

export const metadata = { title: "Кошик" };

export default async function CartPage() {
  const u = await getUser();
  return (
    <div className="container page-top">
      <div className="page-title reveal">
        <span className="eyebrow">Оформлення</span>
        <h1>Твій <span className="gold-text">кошик</span></h1>
      </div>
      <CartView user={u ? { name: u.name, email: u.email, phone: u.phone || "" } : null} />
    </div>
  );
}
