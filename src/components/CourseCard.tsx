"use client";
import Link from "next/link";
import { useCart } from "./Cart";
import { formatUAH } from "@/lib/site";

export type CourseLite = { id: string; slug: string; title: string; short: string; price: number; cover: string; directionTitle: string; kind: string; lessons: number | null; featured: boolean };

export default function CourseCard({ c, i = 0 }: { c: CourseLite; i?: number }) {
  const cart = useCart();
  const inCart = cart.has(c.id);
  return (
    <article className="card card-glow course-card reveal" style={{ ["--d" as string]: `${(i % 3) * 0.08}s` }}>
      <Link href={`/courses/${c.slug}`} className="course-cover" tabIndex={-1} aria-hidden>
        <img src={c.cover} alt="" loading="lazy" />
        <span className={`badge ${c.kind === "level" ? "badge-gold" : ""}`}>{c.kind === "level" ? "Рівень" : c.directionTitle}</span>
        {c.featured && <span className="badge badge-gold hot">★ Популярне</span>}
      </Link>
      <div className="course-body">
        <h3><Link href={`/courses/${c.slug}`}>{c.title}</Link></h3>
        <p className="muted">{c.short}</p>
        {c.lessons ? <p className="meta"><img src="/assets/svg/system/play.svg" alt="" /> {c.lessons} уроків</p> : null}
        <div className="course-foot">
          <b className="price gold-text">{formatUAH(c.price)}</b>
          <button className={`btn btn-sm ${inCart ? "btn-secondary" : "btn-primary"}`} onClick={() => (inCart ? cart.remove(c.id) : cart.add({ id: c.id, slug: c.slug, title: c.title, price: c.price, cover: c.cover }))}>
            {inCart ? "У кошику ✓" : "До кошика"}
          </button>
        </div>
      </div>
    </article>
  );
}
