import Link from "next/link";
import { DIRECTIONS } from "@/lib/directions";
import { SITE, formatUAH } from "@/lib/site";
import { publishedCourses, toLite } from "@/lib/catalog";
import CourseCard from "@/components/CourseCard";
import OpenAiButton from "@/components/OpenAiButton";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: "graduation", title: "Актуальні курси", text: "SMM, AI, дизайн, онлайн-бізнес" },
  { icon: "support", title: "Підтримка наставниці", text: "Супровід на кожному етапі" },
  { icon: "sparkles", title: "AI-помічник", text: "Підбере навчання під твої цілі" },
  { icon: "lock", title: "Доступ назавжди", text: "Після одноразової оплати" },
];

const STEPS = [
  { n: "I", title: "Обери напрям", text: "Переглянь курси та рівні або розкажи AI-помічнику про свої цілі, і він підкаже, з чого почати." },
  { n: "II", title: "Оплати онлайн", text: "Безпечна оплата карткою, Apple Pay чи Google Pay через WayForPay." },
  { n: "III", title: "Отримай доступ", text: "Після оплати ти отримаєш інструкцію і посилання на закритий Telegram-канал з уроками." },
  { n: "IV", title: "Навчайся з наставницею", text: `${SITE.mentorName} супроводжує, відповідає на питання та допомагає дійти до результату.` },
];

const FAQ = [
  { q: "Чим відрізняється покупка тут від покупки на офіційному сайті?", a: "Ціни такі самі, як на офіційному сайті GaliantPro. Але при купівлі на офіційному сайті ти навчаєшся самостійно, без наставництва. Купуючи через наставницю, ти отримуєш супровід, відповіді на питання та допомогу з вибором напряму." },
  { q: "Як я отримаю доступ до курсів?", a: "Курси розміщені в закритих Telegram-каналах: відеоуроки та записи ефірів. Після оплати в особистому кабінеті з'явиться інструкція, а наставниця підтвердить доступ, зазвичай протягом 24 годин." },
  { q: "На скільки часу дається доступ?", a: "Доступ до курсів після одноразової покупки залишається назавжди, без щомісячних платежів." },
  { q: "Чи можна спочатку спробувати?", a: "Так. Запишись на безкоштовні пробні уроки, щоб познайомитись з форматом перед покупкою." },
  { q: "Не знаю, що обрати. Що робити?", a: "Напиши AI-помічнику: він розпитає про твої цілі, досвід та бюджет і порадить курс або рівень. Або напиши напряму наставниці в чат на сайті." },
  { q: "Чи гарантуєте ви дохід?", a: "Ні. Ми даємо знання, практику та підтримку, а результат залежить від твоїх зусиль і часу, який ти вкладаєш." },
];

export default async function Home() {
  const courses = await publishedCourses();
  const levels = courses.filter((c) => c.kind === "level");
  const featured = courses.filter((c) => c.kind !== "level" && c.featured).slice(0, 6);
  const counts = Object.fromEntries(DIRECTIONS.map((d) => [d.key, courses.filter((c) => c.direction === d.key).length]));

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden>
          <picture>
            <source media="(max-width: 767px)" srcSet="/assets/hero/hero-mobile-1080x1440.webp" />
            <img src="/assets/hero/hero-desktop-1920x1080.webp" alt="" fetchPriority="high" />
          </picture>
        </div>
        <img src="/assets/svg/decor/amethyst-cluster.svg" alt="" aria-hidden className="hero-crystal c1 float" />
        <img src="/assets/svg/decor/golden-crescent.svg" alt="" aria-hidden className="hero-crystal c2 float" />
        <img src="/assets/svg/decor/amethyst-single.svg" alt="" aria-hidden className="hero-crystal c3 float" />
        <div className="container hero-content">
          <span className="eyebrow hero-in" style={{ ["--d" as string]: ".1s" }}>
            <img src="/assets/svg/ui/gold-sparkle.svg" alt="" width={16} height={16} /> Онлайн-навчання та менторство
          </span>
          <h1 className="hero-in" style={{ ["--d" as string]: ".25s" }}>
            Професії <br /><span className="gold-text">нового часу</span>
          </h1>
          <p className="hero-sub hero-in" style={{ ["--d" as string]: ".4s" }}>
            Обери навчання, що розкриває твій потенціал, і отримай підтримку наставниці на кожному етапі.
          </p>
          <div className="hero-cta hero-in" style={{ ["--d" as string]: ".55s" }}>
            <Link href="/courses" className="btn btn-primary">Обрати професію <span aria-hidden>→</span></Link>
            <OpenAiButton>Підбір з AI ✦</OpenAiButton>
          </div>
          <a href={SITE.trialUrl} target="_blank" rel="noopener" className="trial-link hero-in" style={{ ["--d" as string]: ".7s" }}>
            <img src="/assets/svg/system/play.svg" alt="" width={18} height={18} /> Записатися на безкоштовні пробні уроки
          </a>
        </div>
        <div className="container">
          <ul className="features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="hero-in" style={{ ["--d" as string]: `${0.8 + i * 0.1}s` }}>
                <span className="feature-icon"><img src={`/assets/svg/system/${f.icon}.svg`} alt="" /></span>
                <span><b>{f.title}</b><small>{f.text}</small></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="section" id="directions">
        <div className="container">
          <div className="section-head reveal">
            <h2>Обери свій <span className="gold-text">напрям</span></h2>
            <p className="muted">Знайди навчання, яке відповідає твоїм цілям, досвіду та інтересам.</p>
            <div className="divider" />
          </div>
          <div className="grid grid-4">
            {DIRECTIONS.map((d, i) => (
              <Link key={d.key} href={`/courses?d=${d.key}`} className="card card-glow direction reveal" style={{ ["--d" as string]: `${(i % 4) * 0.08}s` }}>
                <img src={d.cover} alt="" loading="lazy" className="direction-img" />
                <div className="direction-body">
                  <h3>{d.title}</h3>
                  <p className="muted">{d.blurb}</p>
                  <span className="direction-count">{counts[d.key] || 0} програм →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI BANNER */}
      <section className="container">
        <div className="ai-banner reveal">
          <img src="/assets/svg/ui/ai-assistant-mascot.svg" alt="" className="ai-mascot float" />
          <div className="ai-banner-text">
            <span className="badge badge-gold">AI-помічник · онлайн 24/7</span>
            <h2>Не знаєш, що обрати? <span className="gold-text">AI підкаже</span></h2>
            <p className="muted">Розкажи про свої цілі, досвід і бюджет, і отримай персональну рекомендацію курсів та рівнів.</p>
            <div className="chips">
              {["Хочу нову професію", "Хочу заробляти в Instagram", "Працювати з AI", "Не можу визначитись"].map((p) => (
                <OpenAiButton key={p} className="chip" prompt={p}>{p}</OpenAiButton>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEVELS */}
      {levels.length > 0 && (
        <section className="section" id="levels">
          <div className="container">
            <div className="section-head reveal">
              <h2>Рівні <span className="gold-text">платформи</span></h2>
              <p className="muted">Кожен наступний рівень включає всі курси попереднього. 7 рівень дає повний доступ.</p>
              <div className="divider" />
            </div>
            <div className="levels">
              {levels.map((l, i) => (
                <Link key={l.id} href={`/courses/${l.slug}`} className={`card card-glow level reveal ${l.featured ? "level-featured" : ""}`} style={{ ["--d" as string]: `${i * 0.06}s` }}>
                  <span className="level-num display">{i + 1}</span>
                  <div>
                    <h3>{l.title}</h3>
                    <p className="muted">{l.short}</p>
                  </div>
                  <b className="gold-text level-price">{formatUAH(l.price)}</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED COURSES */}
      {featured.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head reveal">
              <h2>Популярні <span className="gold-text">курси</span></h2>
              <div className="divider" />
            </div>
            <div className="grid grid-3">
              {featured.map((c, i) => <CourseCard key={c.id} c={toLite(c)} i={i} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <Link href="/courses" className="btn btn-secondary">Усі курси →</Link>
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="section steps-section">
        <div className="container">
          <div className="section-head reveal">
            <h2>Як це <span className="gold-text">працює</span></h2>
            <div className="divider" />
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.n} className="card step reveal" style={{ ["--d" as string]: `${i * 0.1}s` }}>
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
            <img src="/assets/svg/decor/celestial-arch.svg" alt="" className="mentor-arch" />
            <img src="/assets/hero/hero-mobile-1080x1440.webp" alt="" className="mentor-img" loading="lazy" />
          </div>
          <div className="mentor-text reveal" style={{ ["--d" as string]: ".15s" }}>
            <span className="eyebrow">Твоя наставниця</span>
            <h2>{SITE.mentorName}</h2>
            <p className="lead">Наставниця та незалежна партнерка освітньої платформи GaliantPro.</p>
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
        <div className="cta-banner reveal" style={{ backgroundImage: "url(/assets/backgrounds/cta-mentorship-1600x550.webp)" }}>
          <h2>Почни з <span className="gold-text">безкоштовних</span> пробних уроків</h2>
          <p>Познайомся з форматом навчання до покупки.</p>
          <a href={SITE.trialUrl} target="_blank" rel="noopener" className="btn btn-primary">Записатися безкоштовно →</a>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container faq-wrap">
          <div className="section-head reveal">
            <h2>Часті <span className="gold-text">питання</span></h2>
            <div className="divider" />
          </div>
          <div className="faq">
            {FAQ.map((f, i) => (
              <details key={f.q} className="card faq-item reveal" style={{ ["--d" as string]: `${i * 0.05}s` }}>
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
