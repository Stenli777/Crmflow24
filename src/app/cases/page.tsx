import { Box, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { CasesGrid } from "@/components/CasesGrid";
import { CtaBanner } from "@/components/CtaBanner";

export default function CasesPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHeading
          title="Кейсы внедрения Bitrix24"
          subtitle="На основе лучших сайтов интеграторов сделали формат, который конвертит: контекст ниши, проблема, решение и результат в цифрах."
        />
        <CasesGrid />
        <Typography color="text.secondary" sx={{ mt: 2.5 }}>
          Добавим сюда ваши реальные проекты, логотипы и отзывы — это усилит доверие и
          заметно поднимет конверсию в заявку.
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

