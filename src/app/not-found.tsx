import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <PageHero
          title="Страница не найдена"
          subtitle="Возможно, ссылка устарела или адрес введён с ошибкой. Вернитесь на главную или напишите нам — подскажем, где искать нужный раздел."
        />
        <Stack spacing={2} sx={{ maxWidth: 560 }}>
          <Button component="a" href="/" variant="contained" size="large">
            На главную
          </Button>
          <Typography variant="body2" color="text.secondary">
            Связь:{" "}
            <Link href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</Link>
          </Typography>
        </Stack>
      </Section>
      <Footer />
    </Box>
  );
}
