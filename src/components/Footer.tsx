"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { NAV } from "./Header";
import Icon from "./Icon";
import LogoStar from "./LogoStar";

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
            <LogoStar size={62} />
            <span>
              <b>{SITE.mentorName}</b>
              <small>{SITE.tagline}</small>
            </span>
          </Link>
          <span className="footer-docs">
            <Link href="/offer">Оферта</Link>
            <Link href="/privacy">Конфіденційність</Link>
          </span>
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
      </div>
    </footer>
  );
}
