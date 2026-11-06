import Link from "next/link";
import { db } from "@/lib/db";

export default async function SupportList({ searchParams }: { searchParams: Promise<{ all?: string }> }) {
  const { all } = await searchParams;
  const list = await db.supportThread.findMany({
    where: all ? {} : { open: true }, orderBy: { updatedAt: "desc" }, take: 200,
    include: { messages: { where: { NOT: { text: "" } }, orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return (
    <>
      <h1>Звернення</h1>
      <nav className="filters"><Link href="/admin/support" className={!all ? "on" : ""}>Відкриті</Link><Link href="/admin/support?all=1" className={all ? "on" : ""}>Усі</Link></nav>
      <div className="grid" style={{ gap: 10 }}>
        {list.map((t) => (
          <Link key={t.id} href={`/admin/support/${t.id}`} className="card card-glow" style={{ padding: 18, display: "grid", gap: 4 }}>
            <b>{t.open ? "🟣" : "⚪️"} {t.name} <span className="muted" style={{ fontWeight: 400 }}>· {t.contact}</span></b>
            <span className="muted" style={{ fontSize: 14 }}>{t.messages[0] ? `${t.messages[0].author === "ADMIN" ? "Ви: " : ""}${t.messages[0].text.slice(0, 140)}` : ""}</span>
            <span className="muted" style={{ fontSize: 12 }}>{t.updatedAt.toLocaleString("uk-UA")}</span>
          </Link>
        ))}
        {!list.length && <p className="muted">Немає звернень.</p>}
      </div>
    </>
  );
}
