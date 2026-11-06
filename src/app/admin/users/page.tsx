import { db } from "@/lib/db";
import { formatUAH } from "@/lib/site";
import { setRole } from "../actions";
import { requireAdmin } from "@/lib/auth";

export default async function Users({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const me = await requireAdmin();
  const users = await db.user.findMany({
    where: q ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : {},
    include: { orders: { where: { status: "PAID" }, select: { amount: true } } },
    orderBy: { createdAt: "desc" }, take: 300,
  });
  return (
    <>
      <h1>Користувачі</h1>
      <form className="toolbar"><input name="q" defaultValue={q} className="input" placeholder="Email, ім'я, телефон" /><button className="btn btn-violet">Знайти</button></form>
      <div className="card table-wrap">
        <table className="table">
          <thead><tr><th>Користувач</th><th>Реєстрація</th><th>Оплачено</th><th>Роль</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><b>{u.name}</b><br /><span className="muted">{u.email}{u.phone ? ` · ${u.phone}` : ""}</span></td>
                <td>{u.createdAt.toLocaleDateString("uk-UA")}</td>
                <td>{formatUAH(u.orders.reduce((s, o) => s + o.amount, 0))} ({u.orders.length})</td>
                <td>
                  {u.id === me?.id ? "Адмін (ви)" : (
                    <form action={setRole} className="row-actions">
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="role" value={u.role === "ADMIN" ? "USER" : "ADMIN"} />
                      <span>{u.role === "ADMIN" ? "Адмін" : "Клієнт"}</span>
                      <button className="btn btn-ghost btn-sm">{u.role === "ADMIN" ? "Зняти адміна" : "Зробити адміном"}</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
