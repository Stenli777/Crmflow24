import type { Metadata } from "next";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { ContactForm } from "@/components/ContactForm";
import { CompanyRequisitesFull } from "@/components/CompanyRequisitesFull";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Телефон, email, Telegram, режим работы и реквизиты ООО «Лиса Эдженси». Заявка на аудит CRM через форму.",
  alternates: { canonical: "/contacts" },
  openGraph: {
    title: `Контакты | ${siteConfig.brandName}`,
    description: "Свяжитесь с CRM Flow 24: заявка, телефон, email и реквизиты.",
    url: `${siteConfig.siteUrl}/contacts`,
  },
};

type ContactsSearchParams = Record<string, string | string[] | undefined>;

function firstParam(sp: ContactsSearchParams, key: string): string {
  const v = sp[key];
  if (Array.isArray(v)) return (v[0] ?? "").trim();
  return (v ?? "").trim();
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<ContactsSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHeading
          title="Контакты"
          subtitle="Свяжитесь удобным способом или оставьте заявку — ответим в рабочее время и предложим следующий шаг по вашей CRM."
        />

        <Box
          sx={{
            mt: 2.5,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          <Stack spacing={2}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Связь
                </Typography>
                <Stack spacing={1.25} sx={{ color: "text.secondary", lineHeight: 1.65 }}>
                  <Typography>
                    Телефон:{" "}
                    <Link href={`tel:${legalConfig.phoneTel}`} style={{ fontWeight: 600 }}>
                      {legalConfig.phoneDisplay}
                    </Link>
                  </Typography>
                  <Typography>
                    Email:{" "}
                    <Link href={`mailto:${siteConfig.contactEmail}`} style={{ fontWeight: 600 }}>
                      {siteConfig.contactEmail}
                    </Link>
                  </Typography>
                  <Typography>
                    Email по персональным данным:{" "}
                    <Link href={`mailto:${legalConfig.privacyEmail}`} style={{ fontWeight: 600 }}>
                      {legalConfig.privacyEmail}
                    </Link>
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography component="span">Telegram:</Typography>
                    <IconButton
                      component="a"
                      href={legalConfig.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Написать в Telegram"
                      color="primary"
                      size="small"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <TelegramIcon />
                    </IconButton>
                  </Box>
                  <Typography>Режим работы: {legalConfig.workHours}</Typography>
                  <Typography>Формат работы: {legalConfig.workFormat}</Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <CompanyRequisitesFull />
              </CardContent>
            </Card>
          </Stack>

          <Card id="contact-form" variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
            <ContactForm
              initialUtm={{
                utm_source: firstParam(sp, "utm_source"),
                utm_medium: firstParam(sp, "utm_medium"),
                utm_campaign: firstParam(sp, "utm_campaign"),
                utm_content: firstParam(sp, "utm_content"),
                utm_term: firstParam(sp, "utm_term"),
              }}
              serviceFromQuery={firstParam(sp, "service") || firstParam(sp, "topic")}
            />
          </Card>
        </Box>
      </Section>
      <Footer />
    </Box>
  );
}
