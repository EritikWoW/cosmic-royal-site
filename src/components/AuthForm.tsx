"use client";
import Link from "next/link";
import { useState } from "react";

export default function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const reg = mode === "register";
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(reg ? f : { email: f.email, password: f.password }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(j.error || "Помилка"); setBusy(false); return; }
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    window.location.href = safeNext || (j.admin ? "/admin" : "/account");
  };
  return (
    <form className="card auth reveal" onSubmit={submit}>
      <img src="/assets/svg/ui/moon-badge.svg" alt="" width={64} style={{ justifySelf: "center" }} className="float" />
      <h1>{reg ? <>Реєстрація</> : <>Вхід</>}</h1>
      {reg && <div className="field"><label htmlFor="n">Ім&apos;я</label><input id="n" className="input" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></div>}
      <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" className="input" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></div>
      {reg && <div className="field"><label htmlFor="p">Телефон (необов&apos;язково)</label><input id="p" type="tel" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" /></div>}
      <div className="field"><label htmlFor="pw">Пароль</label><input id="pw" type="password" className="input" required minLength={reg ? 8 : 1} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete={reg ? "new-password" : "current-password"} /></div>
      {err && <div className="alert alert-error">{err}</div>}
      <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Зачекай…" : reg ? "Створити акаунт" : "Увійти"}</button>
      <p className="muted" style={{ textAlign: "center", fontSize: 14 }}>
        {reg ? <>Вже є акаунт? <Link href="/login" className="gold-text">Увійти</Link></> : <>Ще немає акаунта? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="gold-text">Зареєструватися</Link></>}
      </p>
    </form>
  );
}
