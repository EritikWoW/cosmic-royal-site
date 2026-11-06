import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import OpenAiButton from "@/components/OpenAiButton";
import Ornament from "@/components/Ornament";

export const metadata: Metadata = { title: "Про мене" };

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

export default function About() {
  return (
    <div className="page-top">
      <section className="section about-first">
        <div className="container mentor">
          <div className="mentor-visual reveal">
            <img src="/assets/v3/moon-ring.webp" alt="" aria-hidden className="mentor-ring" />
            <img src="/assets/v3/portrait-cutout.webp" alt="" className="mentor-cut" />
          </div>
          <div className="mentor-text reveal" style={{ ["--d" as string]: ".15s" }}>
            <span className="eyebrow">Про мене</span>
            <h1>{SITE.mentorName}</h1>
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

      <section className="container">
        <div className="cta-banner reveal">
          <h2>Почни з <span className="lime">безкоштовних</span> пробних уроків</h2>
          <p>Познайомся з форматом навчання до покупки.</p>
          <a href={SITE.trialUrl} target="_blank" rel="noopener" className="btn btn-primary btn-lg">Записатися безкоштовно →</a>
        </div>
      </section>

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
    </div>
  );
}
