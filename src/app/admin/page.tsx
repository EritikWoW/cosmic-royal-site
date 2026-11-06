import Link from "next/link";
import { db } from "@/lib/db";
import { formatUAH } from "@/lib/site";
import { markFulfilled } from "./actions";
import TgSetup from "@/components/TgSetup";

export default async function AdminHome() {
  const since = new Date(Date.now() - 30 * 864e5);
  const [rev30, revAll, users, open, waiting] = await Promise.all([
    db.order.aggregate({ where: { status: "PAID", paidAt: { gte: since } }, _sum: { amount: true }, _count: true }),
    db.order.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: true }),
    db.user.count(),
    db.supportThread.count({ where: { open: true } }),
    db.order.findMany({ where: { status: "PAID", fulfilled: false }, include: { items: true }, orderBy: { paidAt: "asc" } }),
  ]);
  const env = {
    "WayForPay": Boolean(process.env.WAYFORPAY_MERCHANT_ACCOUNT && process.env.WAYFORPAY_SECRET_KEY),
    "Telegram-бот": Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_IDS),
    "AI-помічник": Boolean(process.env.ANTHROPIC_API_KEY),
  };
  return (
    <>
      <h1>Огляд</h1>
      <div className="stats">
        <div className="card stat"><b className="gold-text">{formatUAH(rev30._sum.amount || 0)}</b><span>Оплати за 30 днів ({rev30._count})</span></div>
        <div className="card stat"><b>{formatUAH(revAll._sum.amount || 0)}</b><span>Усього ({revAll._count})</span></div>
        <div className="card stat"><b>{users}</b><span>Користувачів</span></div>
        <div className="card stat"><b>{open}</b><span><Link href="/admin/support">Відкритих звернень →</Link></span></div>
      </div>
      <div className="card admin-card">
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>🔑 Чекають на доступ ({waiting.length})</h2>
        {waiting.length ? (
          <div className="table-wrap"><table className="table"><tbody>
            {waiting.map((o) => (
              <tr key={o.id}>
                <td><b>{o.name}</b><br /><span className="muted">{o.email} · {o.phone}</span></td>
                <td>{o.items.map((i) => i.title).join(", ")}</td>
                <td>{formatUAH(o.amount)}</td>
                <td><form action={markFulfilled}><input type="hidden" name="id" value={o.id} /><button className="btn btn-primary btn-sm">Доступ видано</button></form></td>
              </tr>
            ))}
          </tbody></table></div>
        ) : <p className="muted">Усім покупцям доступ видано ✨</p>}
      </div>
      <div className="card admin-card">
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Підключення</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "grid", gap: 6 }}>
          {Object.entries(env).map(([k, v]) => <li key={k}>{v ? "🟢" : "⚪️"} {k} {v ? "підключено" : "не налаштовано (див. README)"}</li>)}
        </ul>
        <TgSetup />
      </div>
    </>
  );
}
