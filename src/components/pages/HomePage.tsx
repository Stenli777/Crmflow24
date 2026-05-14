"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CasesGrid } from "@/components/CasesGrid";
import { StagesGrid } from "@/components/StagesGrid";
import { CtaBanner } from "@/components/CtaBanner";
import { CardShell } from "@/components/CardShell";
import { bitrixAssembly, bitrixConnectItems, clientPainPoints, faqs } from "@/content/site-content";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { siteSurfaces } from "@/theme/siteUi";

const trustBullets = [
  "Настройка под реальные процессы бизнеса",
  "Понятно объясняем сложные вещи",
  "Воронки, интеграции, отчёты и автоматизация в одном контуре",
];

const chaosSources = ["Excel", "AmoCRM", "Телефония", "Telegram", "Почта", "Сайт"];

const systemOutcomes = [
  "Воронки",
  "Задачи",
  "Отчёты",
  "BI",
  "Контроль менеджеров",
];

export function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff", color: "text.primary" }}>
      <Header />

      <Box
        component="section"
        sx={{
          pt: { xs: 5, md: 7 },
          pb: { xs: 6, md: 8 },
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)",
          borderBottom: siteSurfaces.cardBorder,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.05fr) minmax(0, 0.98fr)" },
              gap: { xs: 4, md: 5 },
              alignItems: "center",
            }}
          >
            <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ minWidth: 0 }}>
              <Typography
                variant="overline"
                sx={{ color: "primary.main", letterSpacing: "0.12em", fontWeight: 700 }}
              >
                Внедрение Bitrix24 для малого и среднего бизнеса
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "1.85rem", sm: "2.125rem", md: "2.5rem" },
                  lineHeight: { xs: 1.2, md: 1.18 },
                  letterSpacing: "-0.02em",
                  maxWidth: 640,
                }}
              >
                Настраиваем Bitrix24 так, чтобы продажи, заявки и отчёты были под контролем
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: `${siteSurfaces.cardRadiusPx}px`,
                  border: "1px solid rgba(46, 125, 255, 0.16)",
                  bgcolor: "rgba(248, 250, 252, 0.85)",
                  boxShadow: siteSurfaces.cardShadowHairline,
                  p: { xs: 1.75, sm: 2 },
                  maxWidth: 620,
                }}
              >
                <Stack spacing={1.25}>
                  <Box
                    sx={{
                      px: 1.15,
                      py: 0.45,
                      borderRadius: "999px",
                      border: "1px solid rgba(46, 125, 255, 0.28)",
                      bgcolor: "rgba(46, 125, 255, 0.08)",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      color: "primary.main",
                      lineHeight: 1.35,
                    }}
                  >
                    Бизнес-партнёр Битрикс24
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.45, color: "text.primary" }}>
                    {legalConfig.projectsCount} проектов • работа с {legalConfig.workSinceYear} года • сопровождение
                    клиентов более {legalConfig.longestClientYearsMin} лет
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.55, color: "text.secondary" }}>
                    Настраиваем CRM, автоматизацию, телефонию и коммуникации внутри Bitrix24
                  </Typography>
                </Stack>
              </Paper>
              <Typography
                component="p"
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.65, maxWidth: 600 }}
              >
                Помогаем перейти из Excel, AmoCRM и разрозненных каналов в понятную CRM-систему: воронки,
                телефония, мессенджеры, автоматизации, BI-отчёты и контроль работы менеджеров.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
                <Button
                  component={Link}
                  href="/contacts#contact-form"
                  variant="contained"
                  size="large"
                  sx={{ px: 2.5, fontWeight: 700 }}
                >
                  {siteConfig.primaryCta}
                </Button>
                <Button
                  component={Link}
                  href="/cases"
                  variant="outlined"
                  size="large"
                  sx={{ px: 2.5, fontWeight: 700, borderColor: "rgba(15, 23, 42, 0.14)", color: "text.primary" }}
                >
                  Посмотреть кейсы
                </Button>
              </Box>
              <Stack spacing={1.15} sx={{ pt: 0.5 }}>
                {trustBullets.map((line) => (
                  <Box key={line} sx={{ display: "flex", gap: 1.1, alignItems: "flex-start" }}>
                    <CheckCircleOutlinedIcon
                      sx={{ fontSize: 22, color: "primary.main", mt: 0.15, flexShrink: 0, opacity: 0.9 }}
                    />
                    <Typography variant="body2" sx={{ lineHeight: 1.55, color: "text.secondary" }}>
                      {line}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>

            <Box
              sx={{
                minWidth: 0,
                width: "100%",
                maxWidth: { xs: 480, md: "none" },
                mx: { xs: "auto", md: 0 },
                pr: { md: 2 },
                pl: { md: 0.5 },
              }}
            >
              <CardShell
                sx={{
                  boxShadow: siteSurfaces.cardShadowSoft,
                  p: { xs: 2.5, sm: 3, md: 3.5 },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontWeight: 700, color: "text.secondary", letterSpacing: "0.06em", mb: 1.75 }}
                >
                  ОТ ХАОСА К СИСТЕМЕ
                </Typography>

                <Typography sx={{ fontWeight: 700, fontSize: "0.8125rem", color: "text.secondary", mb: 1 }}>
                  Разрозненные каналы и привычные инструменты
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.85 }}>
                  {chaosSources.map((label) => (
                    <Box
                      key={label}
                      sx={{
                        px: 1.15,
                        py: 0.65,
                        borderRadius: "10px",
                        border: "1px solid rgba(15, 23, 42, 0.1)",
                        bgcolor: "#f8fafc",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", py: 1.25 }}>
                  <ArrowDownwardIcon sx={{ color: "rgba(15, 23, 42, 0.35)", fontSize: 22 }} />
                </Box>

                <Box
                  sx={{
                    borderRadius: `${siteSurfaces.cardRadiusPx}px`,
                    border: "1px solid rgba(46, 125, 255, 0.22)",
                    background: "linear-gradient(180deg, rgba(46,125,255,0.06) 0%, #ffffff 100%)",
                    px: 2,
                    py: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
                    Bitrix24
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary", lineHeight: 1.5 }}>
                    Единая CRM: заявки, коммуникации и процессы в одном контуре
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", py: 1.25 }}>
                  <ArrowDownwardIcon sx={{ color: "rgba(15, 23, 42, 0.35)", fontSize: 22 }} />
                </Box>

                <Typography sx={{ fontWeight: 700, fontSize: "0.8125rem", color: "text.secondary", mb: 1 }}>
                  Порядок в продажах и управлении
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
                    gap: 0.85,
                  }}
                >
                  {systemOutcomes.map((label) => (
                    <Box
                      key={label}
                      sx={{
                        px: 1,
                        py: 1,
                        borderRadius: "12px",
                        border: siteSurfaces.cardBorder,
                        bgcolor: "#f8fafc",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        textAlign: "center",
                        lineHeight: 1.35,
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Box>
              </CardShell>
            </Box>
          </Box>
        </Container>
      </Box>

      <Section id="bitrix-connect">
        <SectionHeader
          kicker="Внутри продукта"
          title="Что подключаем и настраиваем внутри Bitrix24"
          subtitle="Реальные модули и каналы: без списка «всех возможных интеграций мира» — только то, что обычно нужно бизнесу на практике."
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {bitrixConnectItems.map((label) => (
            <Box
              key={label}
              sx={{
                px: 1.35,
                py: 0.85,
                borderRadius: "999px",
                border: siteSurfaces.cardBorder,
                bgcolor: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.35,
                boxShadow: siteSurfaces.cardShadowHairline,
                transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
                "&:hover": {
                  borderColor: "rgba(46, 125, 255, 0.28)",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      </Section>

      <Section id="audience" tone="muted">
        <SectionHeader
          kicker="Кому помогаем"
          title="Собственник, РОП и маркетолог — когда вокруг CRM уже «не тянется»"
          subtitle="Клиенты часто приходят из хаоса: Excel, AmoCRM, разрозненные мессенджеры, телефония отдельно, почта отдельно. Нет нормальных воронок, отчётов, автоматизаций и понятного контроля менеджеров. Мы наводим систему в Bitrix24 и объясняем шаги без лишнего технического шума."
        />
      </Section>

      <Section id="pains">
        <SectionHeader
          kicker="Запросы"
          title="С чем к нам приходят"
          subtitle="Если узнаёте свою ситуацию — на диагностике разложим по полочкам, что делать в первую очередь."
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 1.25,
          }}
        >
          {clientPainPoints.map((line) => (
            <CardShell key={line} sx={{ p: 2, boxShadow: siteSurfaces.cardShadowHairline }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.45 }}>
                {line}
              </Typography>
            </CardShell>
          ))}
        </Box>
      </Section>

      <Section id="inside" tone="muted">
        <SectionHeader
          kicker="Состав решения"
          title="Что собираем внутри Bitrix24"
          subtitle="Не обязательно включать всё сразу: обычно начинаем с того, что даёт максимум порядка при минимуме риска для команды."
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(5, 1fr)" },
            gap: 1.25,
          }}
        >
          {bitrixAssembly.map((line) => (
            <CardShell key={line} sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.45 }}>
                {line}
              </Typography>
            </CardShell>
          ))}
        </Box>
      </Section>

      <Section id="services">
        <SectionHeader
          kicker="Услуги"
          title="Внедрение, настройка и сопровождение"
          subtitle="Делаем акцент на процессе продаж и управляемости: чтобы заявки не терялись, данные не дублировались, а отчёты отражали реальность."
        />
        <ServicesGrid limit={8} />
        <Box sx={{ mt: 2.5 }}>
          <Button component={Link} href="/services" sx={{ fontWeight: 700 }}>
            Все услуги
          </Button>
        </Box>
      </Section>

      <Section id="cases" tone="muted">
        <SectionHeader
          kicker="Кейсы"
          title="Внедрение Bitrix24: примеры проектов"
          subtitle="Два реальных кейса CRM Flow24 — производство и строительство: задача, что сделали, результат. Без выдуманных процентов роста."
        />
        <CasesGrid limit={2} />
        <Box sx={{ mt: 2.5 }}>
          <Button component={Link} href="/cases" sx={{ fontWeight: 700 }}>
            Все кейсы
          </Button>
        </Box>
      </Section>

      <Section id="process">
        <SectionHeader
          kicker="Процесс"
          title="Как работаем"
          subtitle="Понятные этапы и согласование приоритетов: от разбора процесса до сопровождения после запуска."
        />
        <StagesGrid />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 720, lineHeight: 1.6 }}>
          Срок проекта зависит от объёма задач, количества интеграций и сложности процессов.
        </Typography>
      </Section>

      <Section id="roles" tone="muted">
        <SectionHeader
          kicker="Роли"
          title="Что получает руководитель, РОП и маркетолог"
          subtitle="Один продукт — разные срезы данных. Мы настраиваем Bitrix24 так, чтобы каждому было что посмотреть по зоне ответственности."
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 1.5,
          }}
        >
          {[
            {
              title: "Собственник",
              lines: [
                "Прозрачность воронки и денег без «ручных» сводок",
                "Меньше хаоса в коммуникациях и документах",
                "Понятные контрольные точки и ответственность",
              ],
            },
            {
              title: "РОП",
              lines: [
                "Дисциплина обработки заявок и задач",
                "Видно нагрузку менеджеров и узкие места",
                "Отчёты по этапам, источникам и скорости сделки",
              ],
            },
            {
              title: "Маркетолог",
              lines: [
                "Сквозная картина по источникам и кампаниям",
                "Меньше споров о качестве лидов: фиксация в CRM",
                "Основа для оптимизации бюджета на данных",
              ],
            },
          ].map((col) => (
            <CardShell key={col.title} sx={{ p: 2.25, height: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.25 }}>
                {col.title}
              </Typography>
              <Stack spacing={1}>
                {col.lines.map((line) => (
                  <Box key={line} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        mt: 0.65,
                        flexShrink: 0,
                        opacity: 0.85,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                      {line}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardShell>
          ))}
        </Box>
      </Section>

      <Section id="faq">
        <SectionHeader kicker="Вопросы" title="Частые вопросы" />
        <Stack spacing={1.25}>
          {faqs.map((item) => (
            <Accordion
              key={item.q}
              elevation={0}
              disableGutters
              sx={{
                border: siteSurfaces.cardBorder,
                borderRadius: `${siteSurfaces.cardRadiusPx}px !important`,
                bgcolor: "#ffffff",
                overflow: "hidden",
                "&:before": { display: "none" },
                boxShadow: siteSurfaces.cardShadowHairline,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
                <Typography sx={{ fontWeight: 700, pr: 1 }}>{item.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                <Typography color="text.secondary" variant="body1" sx={{ lineHeight: 1.65 }}>
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Section>

      <Section id="cta" tone="muted">
        <CtaBanner
          title="Аудит CRM и план работ под ваш процесс"
          text="На встрече уточним процесс, источники заявок и отчётность. Покажем, где обычно теряется управляемость, и предложим этапы настройки Bitrix24 без лишней нагрузки на команду."
        />
        <Box sx={{ mt: 2, display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <Button component={Link} href="/about" variant="outlined" sx={{ fontWeight: 700 }}>
            О компании
          </Button>
        </Box>
      </Section>

      <Footer />
    </Box>
  );
}
