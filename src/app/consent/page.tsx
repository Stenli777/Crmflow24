import type { Metadata } from "next";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Текст согласия субъекта персональных данных на обработку ПДн при обращении через сайт CRM Flow 24.",
  alternates: { canonical: "/consent" },
  openGraph: {
    title: "Согласие на обработку ПДн | CRM Flow 24",
    url: `${siteConfig.siteUrl}/consent`,
  },
};

export default function ConsentPage() {
  return (
    <LegalPageShell title="Согласие на обработку персональных данных">
      <Stack spacing={2} sx={{ mt: 2, maxWidth: 900 }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Настоящим я, заполняя форму на сайте{" "}
          <strong>{siteConfig.siteDomain}</strong>, даю согласие{" "}
          <strong>{legalConfig.operatorName}</strong> (ИНН {legalConfig.inn}, ОГРН {legalConfig.ogrn},
          адрес: {legalConfig.legalAddress}) на обработку моих персональных данных: фамилии, имени, контактного
          телефона, адреса электронной почты, наименования компании, иных сведений, указанных в форме и
          необходимых для идентификации и связи.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
          Цели обработки
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.secondary", lineHeight: 1.7 }}>
          <li>рассмотрение обращения и обработка заявки;</li>
          <li>связь со мной по указанным контактным данным;</li>
          <li>направление ответов и материалов, запрошенных в обращении.</li>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Обработка может включать: сбор, запись, систематизацию, накопление, хранение, уточнение,
          извлечение, использование, передачу (предоставление, доступ), обезличивание, блокирование,
          удаление, уничтожение данных — с соблюдением{" "}
          <Link href="/privacy" style={{ fontWeight: 600 }}>
            Политики обработки персональных данных
          </Link>
          .
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Согласие даётся до достижения целей обработки либо до его отзыва. Отзыв возможен письмом на{" "}
          <strong>{legalConfig.privacyEmail}</strong> с пометкой «Отзыв согласия на обработку ПДн».
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
          Версия {legalConfig.policyVersion} от {legalConfig.policyEffectiveDate}.
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
