"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./Cart";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Головна" },
  { href: "/courses", label: "Курси" },
  { href: "/courses?d=levels", label: "Рівні" },
  { href: "/#mentor", label: "Наставниця" },
  { href: "/#faq", label: "Питання" },
  { href: "/support", label: "Зв'язок" },
];

export default function Header({ user }: { user: { name: string; admin: boolean } | null }) {
  const path = usePathname();
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => setOpen(false), [path]);
  if (path.startsWith("/admin")) return null;

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-row">
        <Link href="/" className="logo" aria-label="На головну">
          <img src="/assets/svg/brand/cosmic-star.svg" alt="" className="logo-star" />
          <span>
            <b>{SITE.mentorName}</b>
            <small>{SITE.tagline}</small>
          </span>
        </Link>
        <nav className={`nav ${open ? "open" : ""}`} aria-label="Головне меню">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={path === n.href ? "active" : ""}>{n.label}</Link>
          ))}
          <a href={SITE.trialUrl} target="_blank" rel="noopener" className="btn btn-secondary btn-sm nav-trial">Пробні уроки</a>
        </nav>
        <div className="header-actions">
          <Link href="/cart" className="icon-btn" aria-label={`Кошик, ${items.length} товарів`}>
            <img src="/assets/svg/system/cart.svg" alt="" />
            {items.length > 0 && <span className="count">{items.length}</span>}
          </Link>
          {user ? (
            <Link href={user.admin ? "/admin" : "/account"} className="icon-btn" aria-label="Кабінет" title={user.name}>
              <img src="/assets/svg/system/user.svg" alt="" />
            </Link>
          ) : (
            <Link href="/login" className="btn btn-secondary btn-sm hide-sm">Увійти</Link>
          )}
          <button className="icon-btn burger" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(!open)}>
            <img src="/assets/svg/system/menu.svg" alt="" />
          </button>
        </div>
      </div>
    </header>
  );
}
