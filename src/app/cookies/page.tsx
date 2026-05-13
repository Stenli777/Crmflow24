import type { Metadata } from "next";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { ANALYTICS_COOKIE_NAME } from "@/lib/cookieConsentStorage";

export const metadata: Metadata = {
  title: "Политика использования cookie",
  description:
    "Как сайт CRM Flow 24 использует файлы cookie и Яндекс.Метрику после вашего согласия в баннере.",
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "Политика cookie | CRM Flow 24",
    description: "Категории cookie, Яндекс.Метрика и управление согласием.",
    url: `${siteConfig.siteUrl}/cookies`,
  },
};

export default function CookiesPage() {
  const site = `https://${siteConfig.siteDomain}`;

  return (
    <LegalPageShell
      title="Политика в отношении использования файлов cookie"
      subtitle="Описание категорий cookie и аналитики. Яндекс.Метрика подключается только после выбора в баннере (в т.ч. через «Настроить»). Google Analytics и Cloudflare не используются. Выбор сохраняется в браузере (localStorage и, при включении аналитики, технический first-party cookie для согласованной подгрузки счётчика)."
    >
      <Stack spacing={2} sx={{ mt: 2, maxWidth: 900 }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Настоящая Политика применяется к сайту{" "}
          <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink> и действует в отношении Оператора:{" "}
          {legalConfig.operatorName} (ИНН {legalConfig.inn}, ОГРН {legalConfig.ogrn}). Вопросы:{" "}
          <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>.
          Обработка персональных данных также регулируется{" "}
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
          обеспечить работу интерфейса, запомнить ваш выбор по настройкам cookie и, при отдельном согласии,
          собрать обезличенную статистику посещений.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
          2. Необходимые cookie и запись выбора
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Для работы Сайта и сохранения вашего решения по баннеру используется запись в{" "}
          <Box component="code" sx={{ fontSize: "0.9em" }}>
            localStorage
          </Box>{" "}
          (ключ{" "}
          <Box component="code" sx={{ fontSize: "0.9em" }}>
            crmflow24_cookie_consent_v1
          </Box>
          ). Такие сведения не отключаются через баннер, так как без них нельзя сохранить ваш выбор. При
          необходимости также могут использоваться технически необходимые cookie для стабильной работы сайта.
          Если вы включили аналитику, дополнительно выставляется технический first-party cookie{" "}
          <Box component="code" sx={{ fontSize: "0.9em" }}>
            {ANALYTICS_COOKIE_NAME}
          </Box>{" "}
          (значение{" "}
          <Box component="code" sx={{ fontSize: "0.9em" }}>
            1
          </Box>
          ) — он фиксирует ваше согласие на уровне запроса к серверу; без включённой аналитики этот cookie не
          используется. Сторонние аналитические cookie Яндекс.Метрики — только после согласия в баннере.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
          3. Аналитические технологии (после согласия)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          После включения аналитики в баннере на Сайте подключается{" "}
          <strong>Яндекс.Метрика</strong> (ООО «ЯНДЕКС», Российская Федерация). Идентификатор счётчика:{" "}
          <strong>109166748</strong>. Возможны вебвизор и карта кликов — в объёме настроек счётчика. До
          согласия скрипт Метрики не загружается. <strong>Google Analytics не используется.</strong>{" "}
          <strong>Cloudflare не используется.</strong> Сторонние чаты и виджеты на Сайте не используются, в том числе
          Telegram- и WhatsApp-виджеты.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
          4. Управление
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Вы можете нажать «Принять все», «Только необходимые» или «Настроить» в баннере, а позже снова
          открыть настройки через ссылку в подвале сайта. Также вы можете удалить данные сайта в настройках
          браузера.
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
        >
          Версия {legalConfig.policyVersion} от {legalConfig.policyEffectiveDate}.
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
