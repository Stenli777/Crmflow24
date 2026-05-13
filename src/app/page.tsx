import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  description:
    "Настраиваем Bitrix24 под процессы: переезд с AmoCRM и Excel, воронки, телефония, мессенджеры, автоматизации, отчёты и интеграции. Бизнес-партнёр Битрикс24 с 2020 года.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.brandTagline} — ${siteConfig.brandName}`,
    description:
      "Настраиваем Bitrix24 под процессы: воронки, телефония, мессенджеры, автоматизации, отчёты и интеграции.",
    url: siteConfig.siteUrl,
  },
};

export default function Page() {
  return <HomePage />;
}
