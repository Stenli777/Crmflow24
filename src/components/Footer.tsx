import { Box, Container, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { FooterCookieSettingsButton } from "@/components/FooterCookieSettingsButton";

export function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6 }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.55 }}>
              © {new Date().getFullYear()} {siteConfig.brandName} · {siteConfig.siteDomain} ·{" "}
              <Link href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</Link>
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.75, display: "block", lineHeight: 1.55, fontSize: "0.75rem" }}
            >
              {legalConfig.operatorName} · ИНН {legalConfig.inn} · ОГРН {legalConfig.ogrn}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              sx={{
                mt: 1,
                display: "block",
                lineHeight: 1.5,
                fontSize: "0.6875rem",
                maxWidth: 640,
              }}
            >
              CRM Flow 24 — независимая компания по настройке и сопровождению Битрикс24. «Bitrix24» — товарный знак ООО
              «1С-Битрикс». Сайт не является официальным ресурсом Битрикс24.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Link href="/services">Услуги</Link>
              <Link href="/cases">Кейсы</Link>
              <Link href="/about">О компании</Link>
              <Link href="/contacts">Контакты</Link>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/privacy" style={{ fontSize: "0.8125rem" }}>
                Политика ПДн
              </Link>
              <Link href="/cookies" style={{ fontSize: "0.8125rem" }}>
                Cookies
              </Link>
              <Link href="/consent" style={{ fontSize: "0.8125rem" }}>
                Согласие
              </Link>
              <Link href="/terms" style={{ fontSize: "0.8125rem" }}>
                Terms
              </Link>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <FooterCookieSettingsButton />
              <Typography variant="caption" color="text.secondary" component="span">
                ·
              </Typography>
              <Link href="/marketing-consent" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                Согласие на рассылку
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
