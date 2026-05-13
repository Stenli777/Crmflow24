import { Box, Container, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { FooterCookieSettingsButton } from "@/components/FooterCookieSettingsButton";

export function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6 }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} {siteConfig.brandName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {siteConfig.siteDomain} • {siteConfig.city} • {siteConfig.contactEmail}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.6 }}>
              {legalConfig.operatorName} · ИНН {legalConfig.inn} · КПП {legalConfig.kpp} · ОГРН{" "}
              {legalConfig.ogrn}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
              Юр. адрес: {legalConfig.legalAddress}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              sx={{ mt: 1.5, display: "block", lineHeight: 1.65 }}
            >
              CRM Flow 24 — независимая компания, оказывающая услуги по настройке и сопровождению
              Битрикс24. «Bitrix24» и «Битрикс24» — товарные знаки ООО «1С-Битрикс». Сайт не является
              официальным сайтом Битрикс24.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
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
              <Link href="/privacy">Политика ПДн</Link>
              <Link href="/cookies">Cookies</Link>
              <Link href="/consent">Согласие</Link>
              <Link href="/terms">Terms</Link>
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
