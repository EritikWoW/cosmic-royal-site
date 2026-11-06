import Link from "next/link";
import { db } from "@/lib/db";
import { formatUAH, SITE } from "@/lib/site";
import ClearCart from "@/components/ClearCart";
import AutoRefresh from "@/components/AutoRefresh";

export const dynamic = "force-dynamic";
export const metadata = { title: "Результат оплати" };

export default async function Result({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const order = ref ? await db.order.findUnique({ where: { reference: ref }, include: { items: { include: { course: true } } } }) : null;
  if (!order) return <div className="container page-top"><div className="card empty"><h2>Замовлення не знайдено</h2><Link href="/" className="btn btn-primary">На головну</Link></div></div>;

  const paid = order.status === "PAID";
  const pending = order.status === "PENDING";
  return (
    <div className="container page-top" style={{ maxWidth: 760 }}>
      {paid && <ClearCart />}
      {pending && <AutoRefresh seconds={5} />}
      <div className="card" style={{ padding: 32, display: "grid", gap: 18, textAlign: "center", justifyItems: "center" }}>
        <img src={paid ? "/assets/svg/system/check.svg" : "/assets/svg/ui/moon-badge.svg"} alt="" width={72} className="float" />
        <h1 style={{ fontSize: 44 }}>{paid ? <>Оплата <span className="gold-text">успішна</span></> : pending ? "Чекаємо підтвердження оплати…" : "Оплата не пройшла"}</h1>
        <p className="muted">Замовлення <code>{order.reference}</code> на суму {formatUAH(order.amount)}</p>
        {paid && (
          <div style={{ display: "grid", gap: 12, textAlign: "left", width: "100%" }}>
            <p>Дякуємо! {SITE.mentorName} вже отримала сповіщення і відкриє тобі доступ найближчим часом (зазвичай до 24 годин).</p>
            {order.items.map((i) => i.course.accessInfo && (
              <div key={i.id} className="card" style={{ padding: 16 }}><b>{i.title}</b><p className="muted" style={{ whiteSpace: "pre-wrap" }}>{i.course.accessInfo}</p></div>
            ))}
          </div>
        )}
        {!paid && !pending && <p className="muted">Спробуй ще раз або напиши наставниці, і ми допоможемо.</p>}
        <div className="hero-cta" style={{ justifyContent: "center" }}>
          <Link href="/account" className="btn btn-primary">Мій кабінет</Link>
          <Link href="/support" className="btn btn-secondary">Написати наставниці</Link>
        </div>
      </div>
    </div>
  );
}
