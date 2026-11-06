"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { NAV } from "./Header";
import Icon from "./Icon";

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  const socials = [
    { name: "telegram", href: SITE.telegramUrl || "/support", label: "Telegram" },
    { name: "instagram", href: SITE.instagramUrl, label: "Instagram" },
    { name: "youtube", href: SITE.youtubeUrl, label: "YouTube" },
  ].filter((s) => s.href);
  return (
    <footer className="site-footer">
      <div className="footer-bar">
        <div className="container footer-row">
          <Link href="/" className="footer-brand" aria-label="На головну">
            <img src="/assets/svg/brand/cosmic-star.svg" alt="" width={58} height={58} />
            <span>
              <b>{SITE.mentorName}</b>
              <small>{SITE.tagline}</small>
            </span>
          </Link>
          <nav className="footer-nav" aria-label="Меню у футері">
            {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          </nav>
          <div className="footer-socials">
            {socials.map((s) => {
              const ext = s.href.startsWith("http");
              return (
                <a key={s.name} href={s.href} aria-label={s.label} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
                  <Icon name={s.name} size={22} />
                </a>
              );
            })}
          </div>
        </div>
        <div className="container footer-legal">
          <span>© {new Date().getFullYear()} {SITE.mentorName}. Сайт не є офіційним сайтом GaliantPro. Результат навчання залежить від особистих зусиль.</span>
          <span className="footer-docs">
            <Link href="/offer">Оферта</Link>
            <Link href="/privacy">Конфіденційність</Link>
            <a href={SITE.trialUrl} target="_blank" rel="noopener">Пробні уроки</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
