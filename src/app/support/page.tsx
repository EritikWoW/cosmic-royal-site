import { SITE } from "@/lib/site";
import OpenAiButton from "@/components/OpenAiButton";

export const metadata = { title: "Зв'язок з наставницею" };

export default function Support() {
  return (
    <div className="container page-top" style={{ maxWidth: 900 }}>
      <div className="page-title reveal" style={{ textAlign: "center", justifyItems: "center" }}>
        <span className="eyebrow">Зворотний зв&apos;язок</span>
        <h1>Напиши <span className="gold-text">наставниці</span></h1>
        <p className="muted">Питання про курси, оплату чи доступ: {SITE.mentorName} відповість прямо в чаті на сайті. А AI-помічник на зв&apos;язку цілодобово.</p>
      </div>
      <div className="grid grid-2">
        <div className="card card-glow reveal" style={{ padding: 28, display: "grid", gap: 14, justifyItems: "start" }}>
          <img src="/assets/svg/ui/moon-badge.svg" alt="" width={56} />
          <h3>Чат з наставницею</h3>
          <p className="muted">Повідомлення одразу приходить {SITE.mentorName} у Telegram, а відповідь з&apos;явиться в цьому чаті.</p>
          <OpenAiButton className="btn btn-primary" tab="human">Відкрити чат</OpenAiButton>
        </div>
        <div className="card card-glow reveal" style={{ padding: 28, display: "grid", gap: 14, justifyItems: "start", ["--d" as string]: ".1s" }}>
          <img src="/assets/svg/ui/ai-assistant-mascot.svg" alt="" width={56} />
          <h3>AI-помічник 24/7</h3>
          <p className="muted">Миттєво підбере курс чи рівень під твої цілі та відповість на питання про програми.</p>
          <OpenAiButton className="btn btn-secondary" prompt="Допоможи обрати навчання">Запитати AI</OpenAiButton>
        </div>
      </div>
      {(SITE.telegramUrl || SITE.instagramUrl) && (
        <div className="row-actions reveal" style={{ justifyContent: "center", marginTop: 28 }}>
          {SITE.telegramUrl && <a className="btn btn-secondary" href={SITE.telegramUrl} target="_blank" rel="noopener"><img src="/assets/svg/system/telegram.svg" alt="" width={18} /> Telegram</a>}
          {SITE.instagramUrl && <a className="btn btn-secondary" href={SITE.instagramUrl} target="_blank" rel="noopener">Instagram</a>}
        </div>
      )}
    </div>
  );
}
