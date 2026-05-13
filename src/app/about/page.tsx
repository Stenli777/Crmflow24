import type { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/AboutPageClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "CRM Flow 24 — команда технических интеграторов: внедрение и сопровождение Bitrix24 под бизнес-процессы. Бизнес-партнёр Битрикс24 с 2020 года.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `О компании | ${siteConfig.brandName}`,
    description:
      "Небольшая команда технических интеграторов: Bitrix24 под процессы продаж, сервиса и управления.",
    url: `${siteConfig.siteUrl}/about`,
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
