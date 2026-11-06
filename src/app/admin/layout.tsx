import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Адмінка", robots: { index: false } };

const NAV = [
  { href: "/admin", icon: "analytics", label: "Огляд" },
  { href: "/admin/orders", icon: "orders", label: "Замовлення" },
  { href: "/admin/courses", icon: "graduation", label: "Курси" },
  { href: "/admin/support", icon: "chat", label: "Звернення" },
  { href: "/admin/reviews", icon: "heart", label: "Відгуки" },
  { href: "/admin/users", icon: "user", label: "Користувачі" },
  { href: "/", icon: "globe", label: "На сайт" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await requireAdmin();
  if (!u) redirect("/login?next=/admin");
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="logo" style={{ marginBottom: 14 }}>
          <img src="/assets/svg/brand/cosmic-star.svg" alt="" className="logo-star" />
          <span><b>Адмінка</b><small>{u.name}</small></span>
        </Link>
        {NAV.map((n) => <Link key={n.href} href={n.href}><img src={`/assets/svg/system/${n.icon}.svg`} alt="" />{n.label}</Link>)}
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
