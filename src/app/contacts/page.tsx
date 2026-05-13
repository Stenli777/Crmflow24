import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHeading } from "@/components/PageHeading";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/config/site";

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
          title="Контакты и заявка на консультацию"
          subtitle="Опишите задачу в свободной форме: текущая воронка, каналы лидов, этапы продаж и что хотите улучшить в первую очередь."
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
          <Box>
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Email для заявок
                    </Typography>
                    <Typography color="text.secondary">{siteConfig.contactEmail}</Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Что вы получите после первой консультации
                  </Typography>
                  <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                    <li>
                      <Typography color="text.secondary">
                        Карту ключевых проблем и потерь в текущем процессе.
                      </Typography>
                    </li>
                    <li>
                      <Typography color="text.secondary">
                        План запуска MVP-внедрения с приоритетами.
                      </Typography>
                    </li>
                    <li>
                      <Typography color="text.secondary">
                        Оценку интеграций, сроков и необходимых ресурсов.
                      </Typography>
                    </li>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label="Быстрый ответ" />
                <Chip label="Фокус на продажах" />
                <Chip label="Поэтапный запуск" />
              </Box>
            </Stack>
          </Box>

          <Card variant="outlined" sx={{ borderRadius: 4, p: { xs: 2, md: 3 } }}>
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

