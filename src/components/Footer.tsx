"use client";

import { Box, Container, Divider, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { FooterCookieSettingsButton } from "@/components/FooterCookieSettingsButton";

const footMuted = "rgba(19, 40, 74, 0.7)";
const navLinkSx = {
  fontSize: "0.8125rem",
  lineHeight: 1.35,
  fontWeight: 500,
  textUnderlineOffset: 3,
  color: "text.primary",
  "&:hover": { textDecoration: "underline" },
} as const;

export function Footer() {
  return (
    <Box component="footer" sx={{ mt: { xs: 4, md: 5 } }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: { xs: 1.75, md: 2 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 1.5, md: 1.75 },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "flex-start" },
          }}
        >
          <Box sx={{ minWidth: 0, flex: "1 1 auto" }}>
            <Typography
              variant="caption"
              component="div"
              sx={{ display: "block", lineHeight: 1.35, color: footMuted, fontSize: "0.75rem" }}
            >
              © {new Date().getFullYear()} {siteConfig.brandName} · {siteConfig.siteDomain} ·{" "}
              <MuiLink href={`mailto:${siteConfig.contactEmail}`} sx={{ ...navLinkSx, color: footMuted }}>
                {siteConfig.contactEmail}
              </MuiLink>
            </Typography>
            <Typography
              variant="caption"
              component="div"
              sx={{
                mt: 0.5,
                display: "block",
                lineHeight: 1.35,
                color: footMuted,
                fontSize: "0.75rem",
                whiteSpace: { md: "nowrap" },
                overflow: { md: "hidden" },
                textOverflow: { md: "ellipsis" },
              }}
            >
              {legalConfig.operatorName} · ИНН {legalConfig.inn} · ОГРН {legalConfig.ogrn}
            </Typography>
            <Typography
              variant="caption"
              component="p"
              sx={{
                mt: 0.75,
                display: "block",
                lineHeight: 1.35,
                fontSize: "0.6875rem",
                maxWidth: 720,
                color: footMuted,
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
              gap: 0.75,
              alignItems: { xs: "flex-start", md: "flex-end" },
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", gap: { xs: 1.25, md: 1.5 }, flexWrap: "wrap", rowGap: 0.5 }}>
              <MuiLink component={Link} href="/services" sx={navLinkSx}>
                Услуги
              </MuiLink>
              <MuiLink component={Link} href="/cases" sx={navLinkSx}>
                Кейсы
              </MuiLink>
              <MuiLink component={Link} href="/about" sx={navLinkSx}>
                О компании
              </MuiLink>
              <MuiLink component={Link} href="/contacts" sx={navLinkSx}>
                Контакты
              </MuiLink>
            </Box>
            <Box sx={{ display: "flex", gap: { xs: 1.25, md: 1.5 }, flexWrap: "wrap", alignItems: "center", rowGap: 0.5 }}>
              <MuiLink component={Link} href="/privacy" sx={navLinkSx}>
                Политика ПДн
              </MuiLink>
              <MuiLink component={Link} href="/cookies" sx={navLinkSx}>
                Cookies
              </MuiLink>
              <MuiLink component={Link} href="/consent" sx={navLinkSx}>
                Согласие
              </MuiLink>
              <MuiLink component={Link} href="/terms" sx={navLinkSx}>
                Terms
              </MuiLink>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <FooterCookieSettingsButton />
              <Typography variant="caption" component="span" sx={{ color: footMuted, lineHeight: 1.2 }}>
                ·
              </Typography>
              <MuiLink component={Link} href="/marketing-consent" sx={{ ...navLinkSx, fontWeight: 600 }}>
                Согласие на рассылку
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
