import Link from "next/link";
import { DIRECTIONS } from "@/lib/directions";
import { publishedCourses, toLite } from "@/lib/catalog";
import CourseCard from "@/components/CourseCard";
import OpenAiButton from "@/components/OpenAiButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Курси та рівні" };

export default async function Courses({ searchParams }: { searchParams: Promise<{ d?: string; q?: string; sort?: string }> }) {
  const { d, q, sort } = await searchParams;
  let list = await publishedCourses();
  if (d) list = list.filter((c) => c.direction === d);
  if (q) {
    const s = q.toLowerCase();
    list = list.filter((c) => (c.title + " " + c.short + " " + c.description + " " + c.program).toLowerCase().includes(s));
  }
  if (sort === "price") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "-price") list = [...list].sort((a, b) => b.price - a.price);
  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const m = { d, q, sort, ...o };
    for (const [k, v] of Object.entries(m)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/courses?${s}` : "/courses";
  };

  return (
    <div className="container page-top">
      <div className="page-title reveal">
        <span className="eyebrow">Каталог</span>
        <h1>Курси та <span className="gold-text">рівні</span></h1>
        <p className="muted">Ціни відповідають офіційним цінам GaliantPro. Купуючи тут, ти отримуєш ще й супровід наставниці.</p>
      </div>
      <nav className="filters" aria-label="Напрями">
        <Link href={qs({ d: undefined })} className={!d ? "on" : ""}>Усі</Link>
        {DIRECTIONS.map((x) => <Link key={x.key} href={qs({ d: x.key })} className={d === x.key ? "on" : ""}>{x.title}</Link>)}
      </nav>
      <form className="toolbar" action="/courses">
        {d && <input type="hidden" name="d" value={d} />}
        <label className="sr-only" htmlFor="q">Пошук</label>
        <input id="q" name="q" defaultValue={q} placeholder="Пошук: Reels, таргет, Canva…" className="input" />
        <select name="sort" defaultValue={sort || ""} className="select" style={{ maxWidth: 220 }} aria-label="Сортування">
          <option value="">За замовчуванням</option>
          <option value="price">Спершу дешевші</option>
          <option value="-price">Спершу дорожчі</option>
        </select>
        <button className="btn btn-violet">Знайти</button>
      </form>
      {list.length ? (
        <div className="grid grid-3">{list.map((c, i) => <CourseCard key={c.id} c={toLite(c)} i={i} />)}</div>
      ) : (
        <div className="card empty">
          <img src="/assets/svg/decor/golden-crescent.svg" alt="" width={80} />
          <h3>Нічого не знайдено</h3>
          <p className="muted">Спробуй інший запит або запитай AI-помічника.</p>
          <OpenAiButton className="btn btn-primary" prompt={q ? `Шукаю курс про: ${q}` : undefined}>Запитати AI</OpenAiButton>
        </div>
      )}
    </div>
  );
}
