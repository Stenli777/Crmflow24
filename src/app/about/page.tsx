import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { CtaBanner } from "@/components/CtaBanner";

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHeading
          title="О подходе к проектам"
          subtitle="Мы внедряем Bitrix24 как систему роста продаж: от бизнес-аналитики и архитектуры до запуска, контроля KPI и развития."
        />

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
          <Chip label="Интеграции и внешние системы" />
          <Chip label="Телефония и мессенджеры" />
          <Chip label="Воронки и бизнес-процессы" />
          <Chip label="REST API и отчеты" />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Image
            src="/images/process-placeholder.svg"
            alt="Схема этапов внедрения и контроля процесса"
            width={920}
            height={420}
            style={{ width: "100%", height: "auto", borderRadius: 16 }}
          />
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2.5,
          }}
        >
          {[
            "Фиксируем KPI и критерии приемки до старта работ",
            "Делаем внедрение этапами с прозрачной отчетностью",
            "Сопровождаем запуск и улучшаем конверсию после внедрения",
          ].map((item) => (
            <Card key={item} variant="outlined" sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography color="text.secondary">{item}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Typography color="text.secondary" sx={{ mt: 2.5 }}>
          Наш подход совпадает с лучшими интеграторами рынка: сначала бизнес-цель и
          метрики, потом автоматизация и интеграции, затем закрепление результата в
          регулярной операционной работе.
        </Typography>

        <CtaBanner
          title="Хотите внедрение без хаоса и переделок?"
          text="Запланируем проект по этапам, зафиксируем зоны ответственности и доведем внедрение до рабочего результата."
        />
      </Section>
      <Footer />
    </Box>
  );
}

