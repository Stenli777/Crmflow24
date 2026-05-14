import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { CasesGrid } from "@/components/CasesGrid";
import { CtaBanner } from "@/components/CtaBanner";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Кейсы внедрения Bitrix24",
  description:
    "Реальные проекты CRM Flow24: Bitrix24 для продаж, производства, строительства, коммуникаций, аналитики и внутренних процессов.",
  alternates: { canonical: "/cases" },
  openGraph: {
    title: `Кейсы внедрения Bitrix24 | ${siteConfig.brandName}`,
    url: `${siteConfig.siteUrl}/cases`,
  },
};

export default function CasesPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHeading
          title="Кейсы внедрения Bitrix24"
          subtitle="Реальные проекты CRM Flow24: как мы настраивали Bitrix24 для продаж, производства, строительства, коммуникаций, аналитики и внутренних процессов."
        />
        <CasesGrid />
        <Typography color="text.secondary" sx={{ mt: 2.5, maxWidth: 900, lineHeight: 1.65 }}>
          Результаты проектов зависят от исходной ситуации, отрасли, качества данных и вовлечённости команды заказчика.
          Описанные результаты не являются гарантией аналогичного эффекта в каждом проекте.
        </Typography>
        <CtaBanner
          title="Обсудим вашу CRM и следующий шаг"
          text="Разберём текущую систему, покажем типичные точки потерь управляемости и предложим план работ по приоритетам."
        />
      </Section>
      <Footer />
    </Box>
  );
}
