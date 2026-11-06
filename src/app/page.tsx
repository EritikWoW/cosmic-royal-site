import Link from "next/link";
import { directionByKey } from "@/lib/directions";
import { SITE, formatUAH } from "@/lib/site";
import { publishedCourses, toLite } from "@/lib/catalog";
import { db } from "@/lib/db";
import CourseCard from "@/components/CourseCard";
import OpenAiButton from "@/components/OpenAiButton";
import Ornament from "@/components/Ornament";
import Reviews from "@/components/Reviews";

export const dynamic = "force-dynamic";

const HERO_FEATURES = [
  { icon: "book", title: "Актуальні", text: "знання" },
  { icon: "support", title: "Підтримка", text: "на всіх етапах" },
  { icon: "sparkles", title: "Практика", text: "та реальні навички" },
  { icon: "heart", title: "Ком'юніті", text: "однодумців" },
];

const WHY = [
  { icon: "/assets/svg/ui/gold-sparkle.svg", title: "Практичні навички", text: "Знання, які одразу можна застосувати" },
  { icon: "/assets/svg/system/heart.svg", title: "Підтримка наставниці", text: "Супровід, поради та зворотний зв'язок" },
  { icon: "/assets/svg/system/graduation.svg", title: "Сучасні формати", text: "Онлайн-курси, менторство, ефіри" },
  { icon: "/assets/svg/system/lock.svg", title: "Доступ назавжди", text: "Одна оплата, без щомісячних платежів" },
];

const STEPS = [
  { n: "I", title: "Обери напрям", text: "Переглянь курси та рівні або розкажи AI-помічнику про свої цілі." },
  { n: "II", title: "Оплати онлайн", text: "Безпечна оплата карткою, Apple Pay чи Google Pay через WayForPay." },
  { n: "III", title: "Отримай доступ", text: "Інструкція і посилання на закритий Telegram-канал з уроками." },
  { n: "IV", title: "Навчайся з наставницею", text: `${SITE.mentorName} супроводжує та допомагає дійти до результату.` },
];

const FAQ = [
  { q: "Чим відрізняється покупка тут від покупки на офіційному сайті?", a: "Ціни такі самі, як на офіційному сайті GaliantPro. Але при купівлі на офіційному сайті ти навчаєшся самостійно, без наставництва. Купуючи через наставницю, ти отримуєш супровід, відповіді на питання та допомогу з вибором напряму." },
  { q: "Як я отримаю доступ до курсів?", a: "Курси розміщені в закритих Telegram-каналах: відеоуроки та записи ефірів. Після оплати в особистому кабінеті з'явиться інструкція, а наставниця підтвердить доступ, зазвичай протягом 24 годин." },
  { q: "На скільки часу дається доступ?", a: "Доступ до курсів після одноразової покупки залишається назавжди, без щомісячних платежів." },
  { q: "Чи можна спочатку спробувати?", a: "Так. Запишись на безкоштовні пробні уроки, щоб познайомитись з форматом перед покупкою." },
  { q: "Не знаю, що обрати. Що робити?", a: "Напиши AI-помічнику: він розпитає про твої цілі, досвід та бюджет і порадить курс або рівень. Або напиши напряму наставниці в чат на сайті." },
  { q: "Чи гарантуєте ви дохід?", a: "Ні. Ми даємо знання, практику та підтримку, а результат залежить від твоїх зусиль і часу, який ти вкладаєш." },
];

const MAIN_DIRECTIONS = [
  { key: "ai", title: "AI та нейромережі", text: "Працюй з AI, автоматизуй рутину та заробляй більше", icon: "ai-neural-networks" },
  { key: "smm", title: "SMM і маркетинг", text: "Розвивай бренд, створюй контент і залучай клієнтів", icon: "smm-marketing" },
  { key: "design", title: "Дизайн та контент", text: "Створюй візуал, який продає та виділяє", icon: "graphic-design" },
  { key: "business", title: "Онлайн-бізнес", text: "Запусти власний проєкт і монетизуй знання", icon: "online-business" },
];
const MORE_DIRECTIONS = ["levels", "video", "web", "career"];

export default async function Home() {
  const [courses, reviews] = await Promise.all([
    publishedCourses(),
    db.review.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);
  const levels = courses.filter((c) => c.kind === "level");
  const featured = courses.filter((c) => c.kind !== "level" && c.featured).slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-art" aria-hidden>
          <picture>
            <source media="(max-width: 767px)" srcSet="/assets/hero/portrait-vertical.webp" />
            <img src="/assets/hero/portrait-landscape.webp" alt="" fetchPriority="high" />
          </picture>
        </div>
        <img src="/assets/png/decor/amethyst-cluster.png" alt="" aria-hidden className="hero-crystal c1 float" />
        <img src="/assets/png/decor/amethyst-single.png" alt="" aria-hidden className="hero-crystal c2 float" />

        <div className="container hero-content">
          <span className="eyebrow hero-in" style={{ ["--d" as string]: ".1s" }}>
            <img src="/assets/svg/system/graduation.svg" alt="" width={18} height={18} /> Онлайн-навчання та менторство
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
            <Link href="/courses" className="btn btn-primary btn-lg">Підібрати професію <span aria-hidden>→</span></Link>
            <Link href="/courses" className="btn btn-secondary btn-lg">Переглянути курси <span aria-hidden className="play-tri">▷</span></Link>
          </div>
          <ul className="hero-features hero-in" style={{ ["--d" as string]: ".75s" }}>
            {HERO_FEATURES.map((f) => (
              <li key={f.title}>
                <img src={`/assets/svg/system/${f.icon}.svg`} alt="" />
                <span>{f.title}<br />{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DIRECTIONS: light lavender panel */}
      <section className="lilac-panel">
        <div className="container">
          <div className="lilac-head reveal">
            <h2><span className="lime-underline">Обери свій</span> напрям навчання</h2>
            <p>Популярні професії та курси, які дають реальний результат</p>
          </div>
          <div className="dir-row">
            {MAIN_DIRECTIONS.map((d, i) => (
              <Link key={d.key} href={`/courses?d=${d.key}`} className="dir-card reveal" style={{ ["--d" as string]: `${i * 0.07}s` }}>
                <div className="dir-top">
                  <img src={`/assets/png/course_icons/${d.icon}.png`} alt="" />
                  <h3>{d.title}</h3>
                </div>
                <p>{d.text}</p>
                <span className="dir-arrow" aria-hidden>→</span>
              </Link>
            ))}
            <div className="ai-card reveal" style={{ ["--d" as string]: ".3s" }}>
              <h3>Не знаєш, що обрати?<br /><span className="lime">AI-помічник підкаже ✦</span></h3>
              <p>Розкажи про свої цілі, досвід і побажання, і отримай персональну рекомендацію курсів.</p>
              <OpenAiButton className="btn btn-primary btn-sm">Почати діалог 💬</OpenAiButton>
              <img src="/assets/png/ui/ai-assistant-mascot.png" alt="" className="ai-card-mascot float" />
            </div>
          </div>
          <div className="dir-more reveal">
            {MORE_DIRECTIONS.map((k) => (
              <Link key={k} href={`/courses?d=${k}`} className="chip-light">{directionByKey(k).title}</Link>
            ))}
            <Link href="/courses" className="chip-light strong">Усі курси →</Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="why-section">
        <div className="arc" aria-hidden />
        <div className="container">
          <Ornament />
          <h2 className="center reveal">Чому обирають навчання тут?</h2>
          <ul className="why">
            {WHY.map((w, i) => (
              <li key={w.title} className="reveal" style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className="why-icon"><img src={w.icon} alt="" /></span>
                <span><b>{w.title}</b><small>{w.text}</small></span>
              </li>
            ))}
          </ul>
        </div>
        <img src="/assets/png/decor/amethyst-cluster.png" alt="" aria-hidden className="side-crystal left float" />
        <img src="/assets/png/decor/amethyst-single.png" alt="" aria-hidden className="side-crystal right float" />
      </section>

      {/* REVIEWS (only real ones, added in the admin panel) */}
      {reviews.length > 0 && <Reviews items={reviews.map((r) => ({ id: r.id, name: r.name, text: r.text, rating: r.rating, photo: r.photo }))} />}

      {/* FEATURED COURSES */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="row-head reveal">
              <h2>Популярні курси <span className="heart">♡</span></h2>
              <Link href="/courses" className="btn btn-secondary btn-sm">Усі курси →</Link>
            </div>
            <div className="grid grid-3">
              {featured.map((c, i) => <CourseCard key={c.id} c={toLite(c)} i={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* LEVELS */}
      {levels.length > 0 && (
        <section className="section" id="levels">
          <div className="container">
            <Ornament />
            <div className="section-head reveal">
              <h2>Рівні платформи</h2>
              <p className="muted">Кожен наступний рівень включає всі курси попереднього. 7 рівень дає повний доступ.</p>
            </div>
            <div className="levels">
              {levels.map((l, i) => (
                <Link key={l.id} href={`/courses/${l.slug}`} className={`glass level reveal ${l.featured ? "level-featured" : ""}`} style={{ ["--d" as string]: `${i * 0.06}s` }}>
                  <span className="level-num display">{i + 1}</span>
                  <div>
                    <h3>{l.title}</h3>
                    <p className="muted">{l.short}</p>
                  </div>
                  <b className="lime level-price">{formatUAH(l.price)}</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <Ornament />
          <h2 className="center reveal" style={{ marginBottom: 36 }}>Як це працює</h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.n} className="glass step reveal" style={{ ["--d" as string]: `${i * 0.1}s` }}>
                <span className="step-n display">{s.n}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* MENTOR */}
      <section className="section" id="mentor">
        <div className="container mentor">
          <div className="mentor-visual reveal">
            <img src="/assets/hero/portrait-vertical.webp" alt="" className="mentor-img" loading="lazy" />
          </div>
          <div className="mentor-text reveal" style={{ ["--d" as string]: ".15s" }}>
            <span className="eyebrow">Про мене</span>
            <h2>{SITE.mentorName}</h2>
            <p className="lead">Наставниця та незалежна партнерка освітньої платформи GaliantPro</p>
            <p className="muted">
              Допоможу обрати онлайн-професію під твої цілі, пройти навчання без хаосу та зробити перші кроки. Навчаючись зі мною, ти отримуєш не лише доступ до курсів, а й супровід: відповіді на питання, розбір твоїх кроків та підтримку на шляху.
            </p>
            <ul className="mentor-points">
              <li>✦ Особистий супровід після покупки</li>
              <li>✦ Допомога з вибором напряму та рівня</li>
              <li>✦ Ціни як на офіційному сайті, плюс наставництво</li>
            </ul>
            <div className="hero-cta">
              <OpenAiButton className="btn btn-primary" tab="human">Написати наставниці</OpenAiButton>
              <a href={SITE.trialUrl} target="_blank" rel="noopener" className="btn btn-secondary">Пробні уроки</a>
            </div>
          </div>
        </div>
      </section>

      {/* TRIAL CTA */}
      <section className="container">
        <div className="cta-banner reveal">
          <h2>Почни з <span className="lime">безкоштовних</span> пробних уроків</h2>
          <p>Познайомся з форматом навчання до покупки.</p>
          <a href={SITE.trialUrl} target="_blank" rel="noopener" className="btn btn-primary btn-lg">Записатися безкоштовно →</a>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container faq-wrap">
          <Ornament />
          <h2 className="center reveal" style={{ marginBottom: 32 }}>Часті питання</h2>
          <div className="faq">
            {FAQ.map((f, i) => (
              <details key={f.q} className="glass faq-item reveal" style={{ ["--d" as string]: `${i * 0.05}s` }}>
                <summary>{f.q}<span aria-hidden className="faq-plus">+</span></summary>
                <p className="muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
