import { Box, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CtaBanner } from "@/components/CtaBanner";

export default function ServicesPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHeading
          title="Услуги внедрения и интеграции Bitrix24"
          subtitle="Собрали структуру по лучшим паттернам рынка: каждая услуга описана через выгоду, внедрение и итог для бизнеса."
        />
        <ServicesGrid />
        <Typography color="text.secondary" sx={{ mt: 2.5 }}>
          Мы можем собрать коммерческое предложение по этапам: быстрый запуск MVP, а
          затем масштабирование под рост команды и каналов продаж.
        </Typography>
        <CtaBanner
          title="Нужен расчет под вашу задачу?"
          text="Опишите текущий процесс продаж и источники заявок — подготовим план внедрения с приоритетами."
        />
      </Section>
      <Footer />
    </Box>
  );
}

