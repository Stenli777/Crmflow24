import { Box, Container, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6 }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} {siteConfig.brandName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {siteConfig.siteDomain} • {siteConfig.city} • {siteConfig.contactEmail}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Link href="/services">Услуги</Link>
            <Link href="/cases">Кейсы</Link>
            <Link href="/about">О компании</Link>
            <Link href="/contacts">Контакты</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

