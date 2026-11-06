import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { replySupport, toggleThread } from "../../actions";

export default async function Thread({ params }: { params: Promise<{ id: string }> }) {
  const t = await db.supportThread.findUnique({ where: { id: (await params).id }, include: { messages: { where: { NOT: { text: "" } }, orderBy: { createdAt: "asc" } }, user: true } });
  if (!t) notFound();
  return (
    <>
      <h1>{t.name}</h1>
      <p className="muted" style={{ marginTop: -14, marginBottom: 20 }}>{t.contact}{t.user ? ` · акаунт ${t.user.email}` : " · гість"}</p>
      <div className="card admin-card">
        <div className="thread-msgs">
          {t.messages.map((m) => (
            <div key={m.id} className={`msg ${m.author === "ADMIN" ? "me" : "bot"}`}>
              {m.text}
              <div style={{ fontSize: 11, opacity: .6, marginTop: 4 }}>{m.createdAt.toLocaleString("uk-UA")}</div>
            </div>
          ))}
        </div>
        <form action={replySupport} className="form" style={{ marginTop: 16 }}>
          <input type="hidden" name="id" value={t.id} />
          <textarea name="text" className="textarea" placeholder="Відповідь клієнту…" required />
          <button className="btn btn-primary" style={{ width: "fit-content" }}>Надіслати</button>
        </form>
      </div>
      <form action={toggleThread}><input type="hidden" name="id" value={t.id} /><button className="btn btn-secondary btn-sm">{t.open ? "Закрити звернення" : "Відкрити знову"}</button></form>
    </>
  );
}
