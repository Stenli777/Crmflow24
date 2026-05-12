import type { Metadata } from "next";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Политика использования cookie",
  description:
    "Как сайт CRM Flow 24 использует файлы cookie и Яндекс.Метрику после вашего согласия.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  const site = `https://${siteConfig.siteDomain}`;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHeading
          title="Политика в отношении использования файлов cookie"
          subtitle="Описание категорий cookie и аналитики на сайте. Аналитические скрипты подключаются только после вашего выбора в баннере согласия (когда баннер будет включён на сайте)."
        />

        <Stack spacing={2} sx={{ mt: 2, maxWidth: 900 }}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Настоящая Политика применяется к сайту{" "}
            <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink> и действует в отношении Оператора:{" "}
            {legalConfig.operatorName} (ИНН {legalConfig.inn}, ОГРН {legalConfig.ogrn}). Вопросы:{" "}
            <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>.
            Обработка персональных данных при использовании Сайта также регулируется{" "}
            <Link href="/privacy" style={{ fontWeight: 600, textDecoration: "underline" }}>
              Политикой обработки персональных данных
            </Link>
            .
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
            1. Что такое cookie
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Cookie — небольшие фрагменты данных, которые сайт может сохранить в браузере. Они помогают
            обеспечить работу интерфейса, запомнить ваш выбор по настройкам cookie и, при отдельном
            согласии, собрать обезличенную статистику посещений.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
            2. Строго необходимые cookie
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Используются для базовой работы Сайта и хранения вашего решения по баннеру согласия (например,
            что выбрано: «только необходимые» или «принять все»). Такие cookie не отключаются через баннер,
            так как без них корректная работа настроек невозможна.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
            3. Аналитические технологии (после согласия)
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            После того как вы в баннере cookie дадите согласие на аналитику, на Сайте может подключаться{" "}
            <strong>Яндекс.Метрика</strong> (ООО «ЯНДЕКС», Российская Федерация) для сбора статистики
            посещений. Идентификатор счётчика: <strong>109166748</strong>. Возможны функции вроде карты
            кликов и вебвизора — в объёме, заданном настройками счётчика. До получения согласия аналитический
            код не должен загружаться.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
            4. Управление
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Вы можете ограничиться необходимыми cookie, принять все предложенные категории или открыть
            настройки (если предусмотрено в интерфейсе баннера). Также вы можете удалить cookie в настройках
            браузера.
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            Версия {legalConfig.policyVersion} от {legalConfig.policyEffectiveDate}.
          </Typography>
        </Stack>
      </Section>
      <Footer />
    </Box>
  );
}
