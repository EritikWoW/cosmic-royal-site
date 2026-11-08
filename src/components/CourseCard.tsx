"use client";
import Link from "next/link";
import Icon from "./Icon";
import { useCart } from "./Cart";
import { formatUAH } from "@/lib/site";

export type CourseLite = { id: string; slug: string; title: string; short: string; price: number; cover: string; directionTitle: string; kind: string; lessons: number | null; featured: boolean };

export default function CourseCard({ c, i = 0 }: { c: CourseLite; i?: number }) {
  const cart = useCart();
  const inCart = cart.has(c.id);
  const toggle = () => (inCart ? cart.remove(c.id) : cart.add({ id: c.id, slug: c.slug, title: c.title, price: c.price, cover: c.cover }));
  return (
    <article className="glass card-glow course-card reveal" style={{ ["--d" as string]: `${(i % 3) * 0.08}s` }}>
      <div className="course-cover">
        <Link href={`/courses/${c.slug}`} tabIndex={-1} aria-hidden><img src={c.cover} alt="" loading="lazy" /></Link>
        <span className="badge">{c.kind === "level" ? "Рівень" : "Курс"}</span>
        <button className={`cart-heart ${inCart ? "on" : ""}`} onClick={toggle} aria-label={inCart ? "Прибрати з кошика" : "Додати до кошика"} title={inCart ? "У кошику" : "До кошика"}>
          <img src="/assets/svg/system/cart.svg" alt="" />
        </button>
      </div>
      <div className="course-body">
        <h3><Link href={`/courses/${c.slug}`}>{c.title}</Link></h3>
        <p>{c.short}</p>
        <div className="meta">
          <span><img src="/assets/svg/system/play.svg" alt="" /> {c.lessons ? `${c.lessons} уроків` : c.directionTitle}</span>
        </div>
        <div className="course-foot">
          <b className="price">{formatUAH(c.price)}</b>
          <Link href={`/courses/${c.slug}`} className="btn btn-primary btn-sm">Детальніше <Icon name="arrow" size={16} /></Link>
        </div>
      </div>
    </article>
  );
}
