import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 800, mb: 1 }}>
            Страница не найдена
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Возможно, ссылка устарела или адрес введён с ошибкой. Вернитесь на главную или напишите нам — подскажем,
            где искать нужный раздел.
          </Typography>
          <Button component="a" href="/" variant="contained" size="large">
            На главную
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Связь:{" "}
            <Link href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</Link>
          </Typography>
        </Container>
      </Section>
      <Footer />
    </Box>
  );
}
