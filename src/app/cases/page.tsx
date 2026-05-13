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
    "Примеры внедрения CRM: воронки, автоматизации и отчётность. Результаты зависят от исходной ситуации клиента.",
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
          subtitle="Структура карточки: ниша и контекст, исходная ситуация, что сделали, измеримый результат. Публикуем только согласованные с клиентом формулировки и цифры; без разрешения — анонимизация."
        />
        <CasesGrid />
        <Typography color="text.secondary" sx={{ mt: 2.5, maxWidth: 900, lineHeight: 1.65 }}>
          Результаты зависят от исходной ситуации, отрасли и вовлечённости команды клиента. Описания проектов могут
          быть анонимизированы. Указанные формулировки не являются гарантией аналогичного эффекта; детали — после
          диагностики.
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
