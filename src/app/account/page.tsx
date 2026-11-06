import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatUAH, SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Особистий кабінет" };

const STATUS: Record<string, string> = { PAID: "Оплачено", PENDING: "Очікує оплати", DECLINED: "Відхилено", EXPIRED: "Прострочено", REFUNDED: "Повернено" };

export default async function Account() {
  const u = await getUser();
  if (!u) redirect("/login?next=/account");
  const orders = await db.order.findMany({ where: { userId: u.id }, include: { items: { include: { course: true } } }, orderBy: { createdAt: "desc" } });
  const paid = orders.filter((o) => o.status === "PAID");

  return (
    <div className="container page-top">
      <div className="page-title reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <span className="eyebrow">Особистий кабінет</span>
          <h1>Привіт, <span className="gold-text">{u.name}</span></h1>
        </div>
        <div className="row-actions">
          {u.role === "ADMIN" && <Link href="/admin" className="btn btn-violet btn-sm">Адмінка</Link>}
          <form action="/api/auth/logout" method="post"><button className="btn btn-secondary btn-sm">Вийти</button></form>
        </div>
      </div>

      <section className="reveal" style={{ display: "grid", gap: 16, marginBottom: 40 }}>
        <h2 style={{ fontSize: 32 }}>Мої курси</h2>
        {paid.length ? (
          <div className="grid grid-2">
            {paid.flatMap((o) => o.items.map((i) => (
              <div key={i.id} className="card order-card">
                <b style={{ fontSize: 18 }}>{i.title}</b>
                <span className={`status status-${o.fulfilled ? "PAID" : "PENDING"}`} style={{ width: "fit-content" }}>{o.fulfilled ? "Доступ відкрито" : "Відкриваємо доступ (до 24 год)"}</span>
                {i.course.accessInfo ? <p className="muted" style={{ whiteSpace: "pre-wrap" }}>{i.course.accessInfo}</p> : <p className="muted">Наставниця надішле посилання на закритий Telegram-канал.</p>}
              </div>
            )))}
          </div>
        ) : (
          <div className="card empty"><p className="muted">Поки що немає оплачених курсів.</p><Link href="/courses" className="btn btn-primary">До каталогу</Link></div>
        )}
      </section>

      <section className="reveal" style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: 32 }}>Історія замовлень</h2>
        {orders.length ? (
          <div className="card table-wrap">
            <table className="table">
              <thead><tr><th>Дата</th><th>Замовлення</th><th>Сума</th><th>Статус</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.createdAt.toLocaleDateString("uk-UA")}</td>
                    <td>{o.items.map((i) => i.title).join(", ")}</td>
                    <td>{formatUAH(o.amount)}</td>
                    <td><span className={`status status-${o.status}`}>{STATUS[o.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="muted">Замовлень ще немає.</p>}
      </section>
      <p className="muted" style={{ marginTop: 32 }}>Є питання? <Link href="/support" className="gold-text">Напиши {SITE.mentorName}</Link>.</p>
    </div>
  );
}
