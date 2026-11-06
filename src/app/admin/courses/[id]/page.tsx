import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DIRECTIONS } from "@/lib/directions";
import { deleteCourse, saveCourse } from "../../actions";

export default async function EditCourse({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = id === "new" ? null : await db.course.findUnique({ where: { id } });
  if (id !== "new" && !c) notFound();
  return (
    <>
      <h1>{c ? "Редагування" : "Новий курс"}</h1>
      <form action={saveCourse} className="card admin-card form-grid">
        <input type="hidden" name="id" value={c?.id || ""} />
        <div className="field full"><label>Назва</label><input name="title" className="input" required defaultValue={c?.title} /></div>
        <div className="field"><label>Slug (адреса сторінки, латиницею)</label><input name="slug" className="input" required defaultValue={c?.slug} pattern="[a-z0-9-]+" /></div>
        <div className="field"><label>Тип</label><select name="kind" className="select" defaultValue={c?.kind || "course"}><option value="course">Курс</option><option value="level">Рівень платформи</option></select></div>
        <div className="field"><label>Напрям</label><select name="direction" className="select" defaultValue={c?.direction || "smm"}>{DIRECTIONS.map((d) => <option key={d.key} value={d.key}>{d.title}</option>)}</select></div>
        <div className="field"><label>Ціна, грн</label><input name="price" type="number" min={0} className="input" required defaultValue={c?.price} /></div>
        <div className="field"><label>Стара ціна (необов&apos;язково)</label><input name="oldPrice" type="number" min={0} className="input" defaultValue={c?.oldPrice ?? ""} /></div>
        <div className="field"><label>Кількість уроків</label><input name="lessons" type="number" min={0} className="input" defaultValue={c?.lessons ?? ""} /></div>
        <div className="field"><label>Порядок сортування</label><input name="sortOrder" type="number" className="input" defaultValue={c?.sortOrder ?? 100} /></div>
        <div className="field full"><label>Короткий опис (картка)</label><input name="short" className="input" required defaultValue={c?.short} /></div>
        <div className="field full"><label>Опис</label><textarea name="description" className="textarea" defaultValue={c?.description} /></div>
        <div className="field full"><label>Програма (кожен пункт з нового рядка)</label><textarea name="program" className="textarea" style={{ minHeight: 180 }} defaultValue={c?.program} /></div>
        <div className="field full"><label>Формат</label><input name="format" className="input" defaultValue={c?.format || "Відеоуроки та записи ефірів у закритому Telegram-каналі"} /></div>
        <div className="field full"><label>Інструкція доступу після оплати (видно лише покупцю)</label><textarea name="accessInfo" className="textarea" placeholder="Напр.: Подай заявку в канал https://t.me/+... і напиши мені в Telegram" defaultValue={c?.accessInfo} /></div>
        <label className="check"><input type="checkbox" name="published" defaultChecked={c?.published ?? true} /> Показувати на сайті</label>
        <label className="check"><input type="checkbox" name="featured" defaultChecked={c?.featured ?? false} /> Популярне (на головній)</label>
        <div className="row-actions full"><button className="btn btn-primary">Зберегти</button></div>
      </form>
      {c && (
        <form action={deleteCourse} className="card admin-card">
          <input type="hidden" name="id" value={c.id} />
          <p className="muted" style={{ marginBottom: 10 }}>Курс з продажами не видаляється, а лише приховується.</p>
          <button className="btn btn-secondary btn-sm">Видалити / приховати курс</button>
        </form>
      )}
    </>
  );
}
