"use client";

import Link from "next/link";
import { Box, CardContent, Stack, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { CtaBanner } from "@/components/CtaBanner";
import { CompanyRequisitesFull } from "@/components/CompanyRequisitesFull";
import { legalConfig } from "@/config/legal";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { CardShell } from "@/components/CardShell";
import { siteLayout } from "@/theme/siteUi";

const border = "1px solid rgba(15, 23, 42, 0.08)";

const workSteps = [
  "Разбираем текущий процесс",
  "Проектируем CRM",
  "Настраиваем Bitrix24",
  "Подключаем интеграции и автоматизации",
  "Обучаем команду",
  "Сопровождаем и развиваем систему",
] as const;

const whyLongTerm = [
  "фиксируем процессы и роли;",
  "не перегружаем CRM;",
  "объясняем логику автоматизации;",
  "развиваем систему постепенно;",
  "сопровождаем после запуска.",
] as const;

export function AboutPageClient() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHero
          title="О компании CRM Flow 24"
          subtitle="CRM Flow 24 — небольшая команда технических интеграторов: внедряем, настраиваем и сопровождаем Bitrix24 под реальные процессы продаж, сервиса и управления."
        />

        <Stack spacing={1.25} sx={{ maxWidth: siteLayout.articleMaxPx }}>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Бизнес-партнёр Битрикс24 с {legalConfig.businessPartnerSinceYear} года.
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            С {legalConfig.workSinceYear} года реализовано {legalConfig.projectsCount} проектов. Самый долгий клиент
            работает с нами более {legalConfig.longestClientYearsMin} лет.
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Срок проекта зависит от объёма задач: количества воронок, интеграций, ролей, автоматизаций и необходимости
            миграции данных.
          </Typography>
        </Stack>

        <Typography sx={{ mt: 3, fontWeight: 700, maxWidth: siteLayout.articleMaxPx, lineHeight: 1.65 }}>
          Мы строим внедрение от бизнес-цели: сначала метрики и архитектура процесса, затем автоматизация и интеграции,
          затем закрепление в регулярной работе.
        </Typography>

        <Box sx={{ mt: 3.5, maxWidth: siteLayout.articleMaxPx }}>
          <SectionHeader dense level="subsection" title="С кем работаем" titleComponent="h2" />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {legalConfig.clientIndustries.map((label) => (
              <Box
                key={label}
                sx={{
                  px: 1.35,
                  py: 0.75,
                  borderRadius: "999px",
                  border,
                  bgcolor: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: "text.primary",
                }}
              >
                {label}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 3.5, maxWidth: siteLayout.articleMaxPx }}>
          <SectionHeader dense level="subsection" title="Почему компании работают с нами годами" titleComponent="h2" />
          <Stack component="ul" spacing={0.85} sx={{ m: 0, pl: 2.25, color: "text.secondary", lineHeight: 1.65 }}>
            {whyLongTerm.map((line) => (
              <Typography key={line} component="li" sx={{ pl: 0.25 }}>
                {line}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 3 }}>
          <SectionHeader dense level="subsection" title="Как работаем" titleComponent="h2" />
          <Stack
            component="ol"
            spacing={1}
            sx={{ m: 0, pl: 2.5, maxWidth: siteLayout.articleMaxPx, color: "text.secondary", lineHeight: 1.65 }}
          >
            {workSteps.map((step) => (
              <Typography key={step} component="li">
                {step}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 3, maxWidth: siteLayout.articleMaxPx }}>
          <CompanyRequisitesFull />
        </Box>

        <CardShell sx={{ mt: 3, maxWidth: siteLayout.articleMaxPx }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Документы и связь
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
              Политика ПДн:{" "}
              <Link href="/privacy" style={{ fontWeight: 600 }}>
                /privacy
              </Link>
              . Контакты и форма заявки:{" "}
              <Link href="/contacts#contact-form" style={{ fontWeight: 600 }}>
                /contacts
              </Link>
              .
            </Typography>
          </CardContent>
        </CardShell>

        <CtaBanner
          title="Обсудим ваш процесс и следующий шаг"
          text="Расскажите, как сейчас устроены заявки, воронка и отчётность — подготовим план настройки Bitrix24 без лишней нагрузки на команду."
        />
      </Section>
      <Footer />
    </Box>
  );
}
