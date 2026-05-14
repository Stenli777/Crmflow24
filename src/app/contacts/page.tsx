import type { Metadata } from "next";
import { Box, CardContent, IconButton, Stack, Typography } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { CardShell } from "@/components/CardShell";
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

/**
 * Страница статична для кэша CDN/Next: UTM и ?service= читает {@link ContactForm} на клиенте
 * (см. mergeUtmsForSubmit и отправку заявки).
 */
export default function ContactsPage() {
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
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          <Stack spacing={2}>
            <CardShell>
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
            </CardShell>

            <CardShell>
              <CardContent>
                <CompanyRequisitesFull />
              </CardContent>
            </CardShell>
          </Stack>

          <CardShell id="contact-form" sx={{ p: { xs: 2, md: 3 } }}>
            <ContactForm />
          </CardShell>
        </Box>
      </Section>
      <Footer />
    </Box>
  );
}
