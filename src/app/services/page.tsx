import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CtaBanner } from "@/components/CtaBanner";
import { siteConfig } from "@/config/site";
import { siteLayout } from "@/theme/siteUi";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Внедрение и интеграция Bitrix24: воронки, телефония, мессенджеры, автоматизации, отчёты и REST API под процессы компании.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Услуги | ${siteConfig.brandName}`,
    description: "Услуги по настройке и сопровождению Bitrix24 под задачи бизнеса.",
    url: `${siteConfig.siteUrl}/services`,
  },
};

export default function ServicesPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHeading
          title="Услуги внедрения и интеграции Bitrix24"
          subtitle="Каждая услуга описана через задачу клиента, этапы внедрения и ожидаемый эффект для продаж и сервиса."
        />
        <ServicesGrid />
        <Typography color="text.secondary" sx={{ mt: 2.5, maxWidth: siteLayout.heroLeadMaxPx, lineHeight: 1.65 }}>
          Мы можем собрать коммерческое предложение по этапам: быстрый запуск MVP, а
          затем масштабирование под рост команды и каналов продаж.
        </Typography>
        <CtaBanner
          title="Нужен расчёт под вашу задачу?"
          text="Опишите текущий процесс продаж и источники заявок — подготовим план внедрения с приоритетами."
        />
      </Section>
      <Footer />
    </Box>
  );
}

