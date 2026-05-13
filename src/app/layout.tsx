import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { YandexMetrikaServer } from "@/components/YandexMetrikaServer";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Медиа-ассеты для публикации и превью в мессенджерах — положите файлы в каталог `site/public/`:
 *
 * 1) Favicon (PNG), чтобы дополнить текущий `favicon.svg`:
 *    - `favicon-32x32.png` — 32×32 px, PNG
 *    - `favicon-192.png` — 192×192 px, PNG (для Android / PWA)
 *    - `favicon-512.png` — 512×512 px, PNG
 *    После добавления раскомментируйте записи в `metadata.icons.icon` ниже (рядом с SVG).
 *
 * 2) Apple Touch Icon:
 *    - `apple-touch-icon.png` — 180×180 px, PNG
 *    Добавьте `apple: "/apple-touch-icon.png"` в `metadata.icons`.
 *
 * 3) Open Graph (превью в Telegram, Discord, Slack, соцсетях):
 *    - `og-image.png` (или WebP) — 1200×630 px
 *    Добавьте в `metadata.openGraph.images`: `[{ url: "/og-image.png", width: 1200, height: 630, alt: "…" }]`
 *
 * Пока файлов нет, сайт использует только `/favicon.svg`; OG-image не задан — мессенджеры могут подставить свой fallback.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.brandTagline} — ${siteConfig.brandName}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Настраиваем Bitrix24 под процессы: переезд с AmoCRM и Excel, воронки, телефония, мессенджеры, почта, автоматизации, смарт-процессы, согласования, отчёты и интеграции.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    title: `${siteConfig.brandTagline} — ${siteConfig.brandName}`,
    description:
      "Настраиваем Bitrix24 под процессы: воронки, телефония, мессенджеры, автоматизации, отчёты и интеграции.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandTagline} — ${siteConfig.brandName}`,
    description:
      "Внедрение и интеграция Bitrix24: воронки, телефония, автоматизации и отчёты.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={openSans.variable}>
      <body>
        <SiteJsonLd />
        <YandexMetrikaServer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
