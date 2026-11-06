"use client";
import { useState } from "react";
export default function TgSetup() {
  const [msg, setMsg] = useState("");
  return (
    <div className="row-actions" style={{ alignItems: "center" }}>
      <button className="btn btn-violet btn-sm" onClick={async () => {
        const r = await fetch("/api/telegram/setup", { method: "POST" });
        const j = await r.json().catch(() => ({}));
        setMsg(r.ok && j.ok ? "Вебхук бота встановлено ✓" : j.error || "Не вдалося");
      }}>Підключити вебхук Telegram-бота</button>
      {msg && <span className="muted">{msg}</span>}
    </div>
  );
}
