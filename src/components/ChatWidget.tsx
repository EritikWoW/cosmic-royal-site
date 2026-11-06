"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };
type SupportMsg = { id: string; author: "USER" | "ADMIN"; text: string };

const GREETING = `Привіт! 👋 Я AI-помічник ${SITE.mentorName}. Розкажи, чого хочеш навчитися або що для тебе важливо, і я підберу курси чи рівень саме під тебе.`;
const QUICK = ["Хочу нову професію", "Хочу заробляти в Instagram", "Працювати з AI", "Свій інтернет-магазин", "Не можу визначитись"];

/** Renders [text](url) links and line breaks safely, with no HTML injection. */
function Rich({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(((?:\/|https:\/\/)[^\s)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      const ext = m[2].startsWith("http");
      parts.push(<a key={k++} href={m[2]} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>{m[1]}</a>);
    } else parts.push(<b key={k++}>{m[3]}</b>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function ChatWidget({ userName }: { userName?: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"ai" | "human">("ai");
  const [ai, setAi] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [support, setSupport] = useState<SupportMsg[]>([]);
  const [hasThread, setHasThread] = useState(false);
  const [contact, setContact] = useState({ name: userName || "", contact: "" });
  const [err, setErr] = useState("");
  const body = useRef<HTMLDivElement>(null);
  const aiRef = useRef<Msg[]>([]);
  aiRef.current = ai;

  const scroll = () => requestAnimationFrame(() => body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" }));

  const askAi = useCallback(async (text: string) => {
    const next: Msg[] = [...aiRef.current, { role: "user", content: text }];
    setAi([...next, { role: "assistant", content: "" }]);
    setBusy(true); scroll();
    try {
      const r = await fetch("/api/ai/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next }) });
      if (!r.body) throw new Error();
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setAi([...next, { role: "assistant", content: acc }]);
        scroll();
      }
    } catch {
      setAi([...next, { role: "assistant", content: "Не вдалося з'єднатися. Спробуй ще раз або напиши наставниці." }]);
    } finally {
      setBusy(false);
    }
  }, []);

  // Open from anywhere: window.dispatchEvent(new CustomEvent("cr:open-chat", { detail: { tab, prompt } }))
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      setOpen(true);
      setTab(d.tab === "human" ? "human" : "ai");
      if (d.prompt) askAi(d.prompt);
    };
    window.addEventListener("cr:open-chat", h);
    return () => window.removeEventListener("cr:open-chat", h);
  }, [askAi]);

  const loadSupport = useCallback(async () => {
    const r = await fetch("/api/support", { cache: "no-store" });
    if (!r.ok) return;
    const j = await r.json();
    setHasThread(Boolean(j.thread));
    setSupport((prev) => { if (prev.length !== j.messages.length) scroll(); return j.messages; });
  }, []);

  useEffect(() => {
    if (!open || tab !== "human") return;
    loadSupport();
    const t = setInterval(loadSupport, 6000);
    return () => clearInterval(t);
  }, [open, tab, loadSupport]);

  useEffect(() => { if (open) scroll(); }, [open, tab]);

  const sendSupport = async (text: string) => {
    setErr("");
    const r = await fetch("/api/support", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, ...contact }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(j.error || "Помилка"); return false; }
    await loadSupport();
    return true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    if (tab === "ai") { setInput(""); askAi(text); }
    else { setBusy(true); if (await sendSupport(text)) setInput(""); setBusy(false); }
  };

  if (path.startsWith("/admin")) return null;

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Чат">
          <div className="chat-head">
            <img src={tab === "ai" ? "/assets/svg/ui/ai-assistant-mascot.svg" : "/assets/svg/ui/moon-badge.svg"} alt="" />
            <div>
              <b>{tab === "ai" ? "AI-помічник" : `Наставниця ${SITE.mentorName}`}</b>
              <small>● {tab === "ai" ? "онлайн 24/7" : "відповідає в робочий час"}</small>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Закрити чат">×</button>
          </div>
          <div className="chat-tabs" role="tablist">
            <button role="tab" aria-selected={tab === "ai"} className={tab === "ai" ? "on" : ""} onClick={() => setTab("ai")}>✦ AI-помічник</button>
            <button role="tab" aria-selected={tab === "human"} className={tab === "human" ? "on" : ""} onClick={() => setTab("human")}>☾ Наставниця</button>
          </div>
          <div className="chat-body" ref={body} aria-live="polite">
            {tab === "ai" ? (
              <>
                <div className="msg bot">{GREETING}</div>
                {ai.map((m, i) =>
                  m.role === "assistant" && !m.content ? (
                    <div key={i} className="msg bot typing" aria-label="Друкує"><span /><span /><span /></div>
                  ) : (
                    <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}`}>{m.role === "assistant" ? <Rich text={m.content} /> : m.content}</div>
                  ),
                )}
              </>
            ) : (
              <>
                <div className="msg bot">Напиши своє питання, і {SITE.mentorName} відповість тут, у цьому чаті. Сповіщення приходять їй у Telegram.</div>
                {support.map((m) => <div key={m.id} className={`msg ${m.author === "USER" ? "me" : "bot"}`}>{m.text}</div>)}
              </>
            )}
          </div>
          {tab === "ai" && ai.length === 0 && (
            <div className="chat-chips">{QUICK.map((q) => <button key={q} className="chip" onClick={() => askAi(q)}>{q}</button>)}</div>
          )}
          {tab === "human" && !hasThread && !userName && (
            <div className="chat-chips" style={{ display: "grid", gap: 6 }}>
              <input className="input" placeholder="Твоє ім'я" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} aria-label="Ім'я" />
              <input className="input" placeholder="Telegram, телефон або email" value={contact.contact} onChange={(e) => setContact({ ...contact, contact: e.target.value })} aria-label="Контакт" />
            </div>
          )}
          {err && <div className="alert alert-error" style={{ margin: "0 12px 8px" }}>{err}</div>}
          <form className="chat-input" onSubmit={submit}>
            <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Напиши повідомлення…" aria-label="Повідомлення" maxLength={2000} />
            <button className="send-btn" disabled={busy || !input.trim()} aria-label="Надіслати"><img src="/assets/svg/system/arrow-right.svg" alt="" /></button>
          </form>
          {tab === "ai" && <p className="chat-note">Відповіді генерує AI і можуть бути неточними. Для важливих питань напиши наставниці.</p>}
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label={open ? "Закрити чат" : "Відкрити чат з AI-помічником"} aria-expanded={open}>
        <img src="/assets/svg/ui/ai-assistant-mascot.svg" alt="" />
      </button>
    </>
  );
}
