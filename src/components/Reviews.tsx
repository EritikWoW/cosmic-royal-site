"use client";
import { useRef } from "react";
import Icon from "./Icon";

type R = { id: string; name: string; text: string; rating: number; photo: string | null };

export default function Reviews({ items }: { items: R[] }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (dir: number) => track.current?.scrollBy({ left: dir * (track.current.clientWidth * 0.9), behavior: "smooth" });
  return (
    <section className="reviews-section" id="reviews">
      <div className="container">
        <div className="row-head reveal">
          <h2>Відгуки студентів <Icon name="heart" size={26} className="heart" /></h2>
          <div className="row-actions">
            <button className="round-btn" onClick={() => go(-1)} aria-label="Попередні відгуки"><Icon name="arrow" size={18} className="flip" /></button>
            <button className="round-btn on" onClick={() => go(1)} aria-label="Наступні відгуки"><Icon name="arrow" size={18} /></button>
          </div>
        </div>
        <div className="reviews" ref={track}>
          {items.map((r) => (
            <figure key={r.id} className="glass review">
              {r.photo ? <img src={r.photo} alt="" className="review-photo" /> : <span className="review-photo initials">{r.name.slice(0, 1)}</span>}
              <div>
                <div className="stars" aria-label={`Оцінка ${r.rating} з 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <blockquote>«{r.text}»</blockquote>
                <figcaption>{r.name}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
      <img src="/assets/v3/cloud-band.webp" alt="" aria-hidden className="reviews-clouds" />
    </section>
  );
}
