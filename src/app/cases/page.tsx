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
          Указанные результаты достигнуты в отдельных проектах и зависят от исходных данных, отрасли и
          вовлечённости команды. Это не гарантия аналогичного результата; детали — после диагностики.
        </Typography>
        <CtaBanner
          title="Хотите такой же результат в вашем отделе продаж?"
          text="Разберем текущую систему, покажем точки потерь и дадим дорожную карту с быстрыми улучшениями."
        />
      </Section>
      <Footer />
    </Box>
  );
}
