"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";

const items: Array<{ label: string; href: string }> = [
  { label: "Услуги", href: "/services" },
  { label: "Кейсы", href: "/cases" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 6 });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.72)",
        color: "text.primary",
        backdropFilter: scrolled ? "blur(18px)" : "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        transition: "background-color 160ms ease, backdrop-filter 160ms ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                aria-hidden
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #2E7DFF 0%, #00BFA6 100%)",
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: -0.2 }}
              >
                <Link href="/">{siteConfig.brandName}</Link>
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {items.map((it) => (
                <Button
                  key={it.href}
                  color="inherit"
                  component={Link}
                  href={it.href}
                  sx={{
                    textTransform: "none",
                    fontWeight: pathname === it.href ? 700 : 500,
                  }}
                >
                  {it.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                component={Link}
                href="/contacts#contact-form"
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                {siteConfig.primaryCta}
              </Button>
              <IconButton
                onClick={() => setOpen(true)}
                sx={{ display: { xs: "inline-flex", md: "none" } }}
                aria-label="Открыть меню"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setOpen(false)} aria-label="Закрыть меню">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: "grid", gap: 1 }}>
            {items.map((it) => (
              <Button
                key={it.href}
                component={Link}
                href={it.href}
                onClick={() => setOpen(false)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: pathname === it.href ? 700 : 500,
                }}
              >
                {it.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

