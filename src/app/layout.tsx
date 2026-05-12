import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    title: `${siteConfig.brandTagline} — ${siteConfig.brandName}`,
    description:
      "Настраиваем Bitrix24 под процессы: воронки, телефония, мессенджеры, автоматизации, отчёты и интеграции.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
