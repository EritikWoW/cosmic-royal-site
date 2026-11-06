"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/assets/svg/brand/cosmic-star.svg" alt="" width={44} height={44} />
          <div>
            <b className="display" style={{ fontSize: 26 }}>{SITE.mentorName}</b>
            <p className="muted">{SITE.tagline}. Сайт не є офіційним сайтом платформи GaliantPro.</p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Меню у футері">
          <Link href="/courses">Курси</Link>
          <Link href="/courses?d=levels">Рівні платформи</Link>
          <Link href="/support">Зв&apos;язок з наставницею</Link>
          <a href={SITE.trialUrl} target="_blank" rel="noopener">Пробні уроки</a>
        </nav>
        <nav className="footer-links" aria-label="Документи">
          <Link href="/offer">Публічна оферта</Link>
          <Link href="/privacy">Політика конфіденційності</Link>
          <Link href="/account">Особистий кабінет</Link>
          {SITE.telegramUrl && <a href={SITE.telegramUrl} target="_blank" rel="noopener">Telegram</a>}
          {SITE.instagramUrl && <a href={SITE.instagramUrl} target="_blank" rel="noopener">Instagram</a>}
        </nav>
      </div>
      <div className="container footer-bottom muted">
        <span>© {new Date().getFullYear()} {SITE.mentorName}. Оплата через WayForPay.</span>
        <span>Результати навчання залежать від особистих зусиль; ми не гарантуємо рівень доходу.</span>
      </div>
    </footer>
  );
}
