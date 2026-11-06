import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import "./ui.css";
import "./home.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import { CartProvider } from "@/components/Cart";
import ChatWidget from "@/components/ChatWidget";
import { getUser } from "@/lib/auth";
import { SITE } from "@/lib/site";

const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], weight: ["500", "600", "700"], variable: "--font-cormorant", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: { default: `${SITE.mentorName} · онлайн-професії та курси`, template: `%s · ${SITE.mentorName}` },
  description: "Онлайн-навчання з підтримкою наставниці: курси й рівні GaliantPro, персональний добір навчання та AI-помічник.",
  openGraph: { images: ["/assets/hero/hero-desktop-1920x1080.webp"], locale: "uk_UA", type: "website" },
};

export const viewport: Viewport = { themeColor: "#0b0614" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang="uk" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <CartProvider>
          <Starfield />
          <Header user={user ? { name: user.name, admin: user.role === "ADMIN" } : null} />
          <main>{children}</main>
          <Footer />
          <ChatWidget userName={user?.name} />
          <Reveal />
        </CartProvider>
      </body>
    </html>
  );
}
