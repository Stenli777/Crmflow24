import type { Metadata } from "next";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { siteLayout } from "@/theme/siteUi";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
  description:
    "Правила использования сайта CRM Flow 24, ограничение ответственности и интеллектуальная собственность.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Пользовательское соглашение | CRM Flow 24",
    url: `${siteConfig.siteUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Пользовательское соглашение"
      subtitle="Условия использования информационного ресурса, размещённого по адресу в сети Интернет."
    >
      <Stack spacing={2} sx={{ maxWidth: siteLayout.articleMaxPx }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между{" "}
          <strong>{legalConfig.operatorName}</strong> (далее — «Администрация») и любым лицом, использующим
          сайт <strong>{siteConfig.siteDomain}</strong> (далее — «Сайт»).
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
          1. Общие положения
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Используя Сайт, вы подтверждаете, что ознакомились с Соглашением,{" "}
          <Link href="/privacy" style={{ fontWeight: 600 }}>
            Политикой обработки персональных данных
          </Link>{" "}
          и{" "}
          <Link href="/cookies" style={{ fontWeight: 600 }}>
            Политикой cookie
          </Link>
          . Если вы не согласны с условиями — прекратите использование Сайта.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
          2. Информация на Сайте
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Материалы Сайта носят информационный характер и не являются юридической или иной профессиональной
          консультацией, если прямо не оговорено иное. Актуальность материалов поддерживается разумными
          усилиями, но ошибки и устаревание не исключены.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
          3. Ограничение ответственности
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Администрация не отвечает за перебои в работе Сайта по причинам, не зависящим от Администрации, а
          также за действия третьих лиц. Сведения о результатах внедрений и кейсах не являются
          гарантией аналогичного результата в вашем проекте, если иное прямо не закреплено договором.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
          4. Интеллектуальная собственность и товарные знаки
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Оформление и тексты Сайта, если не указано иное, принадлежат Администрации или используются на
          законных основаниях. Названия «Битрикс24», «Bitrix24» являются товарными знаками ООО «1С-Битрикс».
          Сайт не является официальным сайтом Битрикс24.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
          5. Реквизиты Администрации
        </Typography>
        <Typography variant="body1" color="text.secondary" component="div" sx={{ lineHeight: 1.7 }}>
          {legalConfig.operatorName}
          <br />
          ИНН {legalConfig.inn}, КПП {legalConfig.kpp}, ОГРН {legalConfig.ogrn}
          <br />
          {legalConfig.legalAddress}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
          Версия {legalConfig.policyVersion} от {legalConfig.policyEffectiveDate}.
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
