import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { directionByKey } from "@/lib/directions";
import { SITE, formatUAH } from "@/lib/site";
import AddToCart from "@/components/AddToCart";
import OpenAiButton from "@/components/OpenAiButton";
import CourseCard from "@/components/CourseCard";
import { toLite } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = await db.course.findUnique({ where: { slug: (await params).slug } });
  return c ? { title: c.title, description: c.short } : {};
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = await db.course.findUnique({ where: { slug: (await params).slug } });
  if (!c || !c.published) notFound();
  const d = directionByKey(c.direction);
  const program = c.program.split("\n").map((s) => s.trim()).filter(Boolean);
  const related = await db.course.findMany({ where: { published: true, direction: c.direction, NOT: { id: c.id } }, take: 3, orderBy: { sortOrder: "asc" } });

  return (
    <div className="container page-top">
      <nav className="crumbs reveal" aria-label="Навігація">
        <Link href="/courses">Каталог</Link> <span>/</span>
        <Link href={`/courses?d=${d.key}`}>{d.title}</Link> <span>/</span>
        <span>{c.title}</span>
      </nav>
      <div className="course-hero" style={{ marginTop: 20 }}>
        <div style={{ display: "grid", gap: 22 }}>
          <img src={d.cover} alt="" className="course-hero-img reveal" />
          <div className="reveal" style={{ display: "grid", gap: 12 }}>
            <span className={`badge ${c.kind === "level" ? "badge-gold" : ""}`} style={{ width: "fit-content" }}>{c.kind === "level" ? "Рівень платформи" : d.title}</span>
            <h1 style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)" }}>{c.title}</h1>
            <p style={{ fontSize: 18, color: "var(--champagne)" }}>{c.short}</p>
            <p className="muted">{c.description}</p>
          </div>
          {program.length > 0 && (
            <section className="reveal" style={{ display: "grid", gap: 14 }}>
              <h2 style={{ fontSize: 32 }}>{c.kind === "level" ? "Що входить" : "Програма"}</h2>
              <ul className="program">{program.map((p) => <li key={p}>{p}</li>)}</ul>
            </section>
          )}
        </div>
        <aside className="card buy-box reveal">
          <b className="price gold-text">{formatUAH(c.price)}</b>
          {c.oldPrice ? <s className="muted">{formatUAH(c.oldPrice)}</s> : null}
          <AddToCart item={{ id: c.id, slug: c.slug, title: c.title, price: c.price, cover: d.cover }} />
          <div className="info-list">
            <div><img src="/assets/svg/system/play.svg" alt="" /><span>{c.format}</span></div>
            {c.lessons ? <div><img src="/assets/svg/system/book.svg" alt="" /><span>{c.lessons} уроків</span></div> : null}
            <div><img src="/assets/svg/system/lock.svg" alt="" /><span>Доступ назавжди після одноразової оплати</span></div>
            <div><img src="/assets/svg/system/support.svg" alt="" /><span>Супровід наставниці {SITE.mentorName}</span></div>
            <div><img src="/assets/svg/system/shield.svg" alt="" /><span>Безпечна оплата через WayForPay</span></div>
          </div>
          <OpenAiButton className="btn btn-ghost" prompt={`Розкажи, чи підійде мені «${c.title}»`}>✦ Запитати AI про цей курс</OpenAiButton>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <h2 className="reveal" style={{ marginBottom: 24 }}>Схожі <span className="gold-text">програми</span></h2>
          <div className="grid grid-3">{related.map((r, i) => <CourseCard key={r.id} c={toLite(r)} i={i} />)}</div>
        </section>
      )}
    </div>
  );
}
