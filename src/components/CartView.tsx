"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./Cart";
import { formatUAH, SITE } from "@/lib/site";

type Props = { user: { name: string; email: string; phone: string } | null };

function submitForm(action: string, fields: Record<string, string | string[]>) {
  const f = document.createElement("form");
  f.method = "POST"; f.action = action; f.acceptCharset = "utf-8"; f.style.display = "none";
  for (const [k, v] of Object.entries(fields)) {
    for (const val of Array.isArray(v) ? v : [v]) {
      const i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = val; f.appendChild(i);
    }
  }
  document.body.appendChild(f); f.submit();
}

export default function CartView({ user }: Props) {
  const cart = useCart();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!cart.items.length)
    return (
      <div className="card empty reveal">
        <img src="/assets/svg/system/cart.svg" alt="" width={56} />
        <h3>Кошик порожній</h3>
        <p className="muted">Обери курс або рівень у каталозі.</p>
        <Link href="/courses" className="btn btn-primary">До каталогу →</Link>
      </div>
    );

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, courseIds: cart.items.map((i) => i.id) }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Помилка");
      submitForm(j.action, j.fields);
    } catch (e) {
      setErr((e as Error).message); setBusy(false);
    }
  };

  return (
    <div className="cart-layout">
      <div className="grid" style={{ gap: 12 }}>
        {cart.items.map((i) => (
          <div key={i.id} className="card cart-item">
            <img src={i.cover} alt="" />
            <div>
              <h3><Link href={`/courses/${i.slug}`}>{i.title}</Link></h3>
              <b className="gold-text">{formatUAH(i.price)}</b>
            </div>
            <button className="btn btn-ghost" onClick={() => cart.remove(i.id)} aria-label={`Видалити ${i.title}`}>✕</button>
          </div>
        ))}
      </div>
      <form className="card summary" onSubmit={pay}>
        <h3 style={{ fontSize: 28 }}>Оформлення</h3>
        <div className="field"><label htmlFor="n">Ім&apos;я та прізвище</label><input id="n" className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></div>
        <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></div>
        <div className="field"><label htmlFor="p">Телефон</label><input id="p" type="tel" className="input" required placeholder="+380…" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></div>
        <label className="check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required /> <span>Погоджуюсь з <Link href="/offer" className="gold-text">офертою</Link> та <Link href="/privacy" className="gold-text">політикою конфіденційності</Link></span></label>
        <div className="summary-row"><span className="muted">Разом</span><b className="price gold-text" style={{ fontSize: 30 }}>{formatUAH(cart.total)}</b></div>
        {err && <div className="alert alert-error">{err}</div>}
        <button className="btn btn-primary btn-block" disabled={busy || !agree}>{busy ? "Переходимо до оплати…" : "Оплатити через WayForPay →"}</button>
        {!user && <p className="muted" style={{ fontSize: 13 }}><Link href="/login?next=/cart" className="gold-text">Увійди</Link>, щоб покупки зберігались у кабінеті. Можна оплатити й без реєстрації.</p>}
        <p className="muted" style={{ fontSize: 13 }}>Після оплати {SITE.mentorName} відкриє тобі доступ до закритого Telegram-каналу.</p>
      </form>
    </div>
  );
}
