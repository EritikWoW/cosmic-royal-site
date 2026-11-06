import Link from "next/link";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";
import OpenAiButton from "@/components/OpenAiButton";
import Ornament from "@/components/Ornament";
import Reviews from "@/components/Reviews";
import Icon from "@/components/Icon";
import Parallax from "@/components/Parallax";

export const dynamic = "force-dynamic";

const HERO_FEATURES = [
  { icon: "layers", title: "Актуальні", text: "знання" },
  { icon: "headset", title: "Підтримка", text: "на всіх етапах" },
  { icon: "bolt", title: "Практика", text: "та реальні навички" },
  { icon: "diamond", title: "Ком'юніті", text: "однодумців" },
];

const WHY = [
  { icon: "sparkle", title: "Практичні навички", text: "Знання, які одразу можна застосувати" },
  { icon: "heart", title: "Підтримка наставниці", text: "Супровід, поради та зворотний зв'язок" },
  { icon: "layers", title: "Сучасні формати", text: "Онлайн-курси, менторство, інтенсиви" },
  { icon: "infinity", title: "Реальний результат", text: "Нові навички та професійний ріст" },
];

const DIRECTIONS = [
  { key: "ai", title: "AI та нейромережі", text: "Працюй з AI, автоматизуй рутину та заробляй більше", icon: "icon-ai" },
  { key: "smm", title: "SMM і маркетинг", text: "Розвивай бренд, створюй контент і залучай клієнтів", icon: "icon-smm" },
  { key: "design", title: "Дизайн та контент", text: "Створюй візуал, який продає та виділяє", icon: "icon-design" },
  { key: "business", title: "Онлайн-бізнес", text: "Запусти власний проєкт і монетизуй знання", icon: "icon-business" },
];

export default async function Home() {
  const reviews = await db.review.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <div className="home">
      <Parallax />

      {/* HERO: nebula + moon ring + portrait cutout + gold arch + cloud band */}
      <section className="hero" data-parallax>
        <div className="hero-stage" aria-hidden>
          <div className="layer l-ring"><img src="/assets/v3/moon-ring.webp" alt="" className="ring-img" /></div>
          <div className="layer l-portrait"><img src="/assets/v3/portrait-cutout.webp" alt="" fetchPriority="high" /></div>
          <div className="layer l-arch"><img src="/assets/v3/gold-arch.webp" alt="" className="arch-img" /></div>
          <div className="layer l-crystal"><img src="/assets/png/decor/amethyst-cluster.png" alt="" className="float" /></div>
          <span className="spark s1" /><span className="spark s2" /><span className="spark s3" /><span className="spark s4" />
        </div>

        <img src="/assets/v3/cloud-band.webp" alt="" aria-hidden className="hero-clouds" />
        <div className="container hero-content">
          <span className="eyebrow hero-in" style={{ ["--d" as string]: ".1s" }}>
            <img src="/assets/svg/system/graduation.svg" alt="" width={16} height={16} /> Онлайн-навчання та менторство
          </span>
          <h1 className="hero-in hero-title" style={{ ["--d" as string]: ".25s" }}>
            Твоя нова професія починається{" "}
            <span className="swoosh">
              тут
              <svg viewBox="0 0 200 70" aria-hidden><path d="M6 46 C 50 66, 150 64, 192 26 C 196 14, 170 4, 120 8" /></svg>
            </span>
          </h1>
          <p className="hero-sub hero-in" style={{ ["--d" as string]: ".4s" }}>
            Обери навчання, що розкриває твій потенціал, і&nbsp;отримай підтримку наставниці на кожному етапі
          </p>
          <div className="hero-cta hero-in" style={{ ["--d" as string]: ".55s" }}>
            <Link href="/courses?d=levels" className="btn btn-primary btn-lg">Підібрати професію <Icon name="arrow" size={18} /></Link>
            <Link href="/courses" className="btn btn-secondary btn-lg">Переглянути курси <Icon name="play" size={16} /></Link>
          </div>
          <a href={SITE.trialUrl} target="_blank" rel="noopener" className="trial-link hero-in" style={{ ["--d" as string]: ".65s" }}>✦ Записатися на безкоштовні пробні уроки</a>
          <ul className="hero-features hero-in" style={{ ["--d" as string]: ".75s" }}>
            {HERO_FEATURES.map((f) => (
              <li key={f.title}>
                <Icon name={f.icon} size={24} />
                <span>{f.title}<br />{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DIRECTIONS: light lavender glass sheet */}
      <section className="dir-section">
        <div className="container dir-inner">
          <div className="dir-sheet">
            <div className="dir-main">
              <div className="dir-head reveal">
                <h2><span className="lime-underline">Обери свій</span> напрям навчання</h2>
                <p>Популярні професії та курси, які дають реальний результат</p>
              </div>
              <div className="dir-row">
                {DIRECTIONS.map((d, i) => (
                  <Link key={d.key} href={`/courses?d=${d.key}`} className="dir-card reveal" style={{ ["--d" as string]: `${0.1 + i * 0.08}s` }}>
                    <div className="dir-top">
                      <img src={`/assets/v3/${d.icon}.webp`} alt="" />
                      <h3>{d.title}</h3>
                    </div>
                    <p>{d.text}</p>
                    <span className="dir-arrow" aria-hidden><Icon name="arrow" size={16} /></span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="ai-card reveal" style={{ ["--d" as string]: ".45s" }}>
              <h3>Не знаєш, що обрати?<br /><span className="lime">AI-помічник підкаже ✦</span></h3>
              <p>Розкажи про свої цілі, досвід і побажання, і отримай персональну рекомендацію курсів.</p>
              <OpenAiButton className="btn btn-primary btn-sm">Почати діалог <Icon name="chat" size={17} /></OpenAiButton>
              <img src="/assets/v3/mascot.webp" alt="" className="ai-card-mascot" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY: dark dome with gold arc */}
      <section className="why-section">
        <img src="/assets/png/decor/amethyst-cluster.png" alt="" aria-hidden className="side-crystal left float" />
        <img src="/assets/png/decor/amethyst-single.png" alt="" aria-hidden className="side-crystal right float" />
        <div className="container">
          <Ornament />
          <h2 className="center reveal">Чому обирають навчання тут?</h2>
          <ul className="why">
            {WHY.map((w, i) => (
              <li key={w.title} className="reveal" style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className="why-icon"><Icon name={w.icon} size={26} /></span>
                <span><b>{w.title}</b><small>{w.text}</small></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS (only real ones, added in the admin panel) */}
      {reviews.length > 0 && <Reviews items={reviews.map((r) => ({ id: r.id, name: r.name, text: r.text, rating: r.rating, photo: r.photo }))} />}
    </div>
  );
}
