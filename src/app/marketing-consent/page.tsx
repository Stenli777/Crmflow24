import type { Metadata } from "next";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { siteLayout, siteSurfaces } from "@/theme/siteUi";

export const metadata: Metadata = {
  title: "Согласие на получение рекламных и информационных сообщений",
  description:
    "Отдельное согласие на рассылку. На сайте CRM Flow 24 маркетинговая рассылка не ведётся без отметки соответствующего чекбокса.",
  alternates: { canonical: "/marketing-consent" },
  openGraph: {
    title: "Согласие на рекламные рассылки | CRM Flow 24",
    url: `${siteConfig.siteUrl}/marketing-consent`,
  },
};

export default function MarketingConsentPage() {
  return (
    <LegalPageShell
      title="Согласие на получение рекламных и информационных сообщений"
      subtitle="Документ применяется, если вы отдельно отметили согласие на рассылку в форме. Без этой отметки маркетинговые сообщения не направляются."
    >
      <Stack spacing={2} sx={{ maxWidth: siteLayout.articleMaxPx }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Настоящим я даю согласие <strong>{legalConfig.operatorName}</strong> на направление мне на
          указанные в форме контакты (номер телефона, email, мессенджеры при наличии) информационных и
          рекламных сообщений о продуктах и услугах, в т.ч. в виде email, SMS, push и аналогичных каналов,
          если технически доступно.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
          Отзыв и ограничения
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Согласие может быть отозвано в любой момент письмом на {legalConfig.privacyEmail} либо через
          механизм отписки в сообщении (если предусмотрен). Обработка персональных данных для заявки
          описана отдельно в{" "}
          <Link href="/privacy" style={{ fontWeight: 600 }}>
            Политике ПДн
          </Link>{" "}
          и{" "}
          <Link href="/consent" style={{ fontWeight: 600 }}>
            Согласии на обработку ПДн
          </Link>
          .
        </Typography>

        <Box
          component="aside"
          sx={{
            p: 2,
            borderRadius: `${siteSurfaces.cardRadiusPx}px`,
            bgcolor: "rgba(46,125,255,0.06)",
            border: "1px solid rgba(46,125,255,0.2)",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
            <strong>Фактическое состояние сайта {siteConfig.siteDomain}:</strong> отправка формы не
            добавляет вас в рекламную рассылку, если вы не отметили отдельный чекбокс в форме. Интеграция с
            CRM и сценарии рассылки настраиваются отдельно.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
          Версия {legalConfig.policyVersion} от {legalConfig.policyEffectiveDate}.
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
