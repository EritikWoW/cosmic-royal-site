import { db } from "@/lib/db";
import { saveReview, toggleReview } from "../actions";

export default async function AdminReviews() {
  const list = await db.review.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <>
      <h1>Відгуки</h1>
      <p className="muted" style={{ marginTop: -14, marginBottom: 20 }}>Додавайте лише справжні відгуки учнів (з їхньої згоди). Блок на головній з&apos;являється, коли є хоча б один відгук.</p>
      <form action={saveReview} className="card admin-card form-grid">
        <div className="field"><label>Ім&apos;я учня</label><input name="name" className="input" required placeholder="Марина К." /></div>
        <div className="field"><label>Оцінка</label><select name="rating" className="select" defaultValue="5">{[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}</select></div>
        <div className="field full"><label>Текст відгуку</label><textarea name="text" className="textarea" required /></div>
        <div className="field full"><label>Посилання на фото (необов&apos;язково)</label><input name="photo" className="input" placeholder="https://…" /></div>
        <div className="full"><button className="btn btn-primary">Додати відгук</button></div>
      </form>
      <div className="grid" style={{ gap: 10 }}>
        {list.map((r) => (
          <div key={r.id} className="card admin-card" style={{ marginBottom: 0 }}>
            <b>{r.published ? "🟢" : "⚪️"} {r.name} · {"★".repeat(r.rating)}</b>
            <p className="muted" style={{ margin: "6px 0 12px" }}>{r.text}</p>
            <div className="row-actions">
              <form action={toggleReview}><input type="hidden" name="id" value={r.id} /><button className="btn btn-secondary btn-sm">{r.published ? "Приховати" : "Показати"}</button></form>
              <form action={toggleReview}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="delete" value="1" /><button className="btn btn-ghost btn-sm">Видалити</button></form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
