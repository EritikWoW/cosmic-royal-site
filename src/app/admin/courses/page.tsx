import Link from "next/link";
import { db } from "@/lib/db";
import { formatUAH } from "@/lib/site";
import { directionByKey } from "@/lib/directions";

export default async function AdminCourses() {
  const list = await db.course.findMany({ orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { price: "asc" }], include: { _count: { select: { orderItems: true } } } });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1>Курси</h1>
        <Link href="/admin/courses/new" className="btn btn-primary btn-sm">+ Новий курс</Link>
      </div>
      <div className="card table-wrap">
        <table className="table">
          <thead><tr><th>Назва</th><th>Напрям</th><th>Ціна</th><th>Продажі</th><th>Статус</th><th /></tr></thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td><b>{c.title}</b>{c.featured && " ★"}<br /><code className="muted" style={{ fontSize: 12 }}>{c.slug}</code></td>
                <td>{c.kind === "level" ? "Рівень" : directionByKey(c.direction).title}</td>
                <td>{formatUAH(c.price)}</td>
                <td>{c._count.orderItems}</td>
                <td>{c.published ? "🟢 на сайті" : "⚪️ приховано"}</td>
                <td><Link href={`/admin/courses/${c.id}`} className="btn btn-secondary btn-sm">Редагувати</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
