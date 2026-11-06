import Link from "next/link";
import { db } from "@/lib/db";
import { formatUAH } from "@/lib/site";
import { markFulfilled } from "../actions";
import type { OrderStatus } from "@prisma/client";

const ST: Record<string, string> = { PAID: "Оплачено", PENDING: "Очікує", DECLINED: "Відхилено", EXPIRED: "Прострочено", REFUNDED: "Повернено" };

export default async function Orders({ searchParams }: { searchParams: Promise<{ s?: string; q?: string }> }) {
  const { s, q } = await searchParams;
  const orders = await db.order.findMany({
    where: {
      ...(s && s in ST ? { status: s as OrderStatus } : {}),
      ...(q ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { reference: { contains: q } }] } : {}),
    },
    include: { items: true }, orderBy: { createdAt: "desc" }, take: 200,
  });
  return (
    <>
      <h1>Замовлення</h1>
      <nav className="filters">
        <Link href="/admin/orders" className={!s ? "on" : ""}>Усі</Link>
        {Object.entries(ST).map(([k, v]) => <Link key={k} href={`/admin/orders?s=${k}`} className={s === k ? "on" : ""}>{v}</Link>)}
      </nav>
      <form className="toolbar">{s && <input type="hidden" name="s" value={s} />}<input name="q" defaultValue={q} className="input" placeholder="Email, ім'я, телефон, номер" /><button className="btn btn-violet">Знайти</button></form>
      <div className="card table-wrap">
        <table className="table">
          <thead><tr><th>Дата</th><th>Клієнт</th><th>Курси</th><th>Сума</th><th>Статус</th><th>Доступ</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.createdAt.toLocaleString("uk-UA")}<br /><code className="muted" style={{ fontSize: 11 }}>{o.reference}</code></td>
                <td><b>{o.name}</b><br /><span className="muted">{o.email}<br />{o.phone}</span></td>
                <td>{o.items.map((i) => i.title).join(", ")}</td>
                <td>{formatUAH(o.amount)}</td>
                <td><span className={`status status-${o.status}`}>{ST[o.status]}</span></td>
                <td>{o.status === "PAID" ? (o.fulfilled ? "✅ видано" : <form action={markFulfilled}><input type="hidden" name="id" value={o.id} /><button className="btn btn-primary btn-sm">Видано</button></form>) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && <p className="muted" style={{ padding: 20 }}>Нічого не знайдено.</p>}
      </div>
    </>
  );
}
