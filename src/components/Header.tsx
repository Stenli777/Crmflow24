"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Image from "next/image";
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

const headerTransition = "background-color 220ms ease, backdrop-filter 220ms ease, border-color 220ms ease";
const layoutTransition = "min-height 220ms ease, padding-top 220ms ease, padding-bottom 220ms ease";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: scrolled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.72)",
        color: "text.primary",
        backdropFilter: scrolled ? "blur(18px)" : "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        transition: headerTransition,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: scrolled ? 56 : 64, md: scrolled ? 58 : 72 },
            py: { xs: scrolled ? 0.5 : 0.75, md: scrolled ? 0.65 : 1 },
            transition: layoutTransition,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 1.25, md: 2 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                href="/"
                aria-label={siteConfig.brandName}
                style={{ lineHeight: 0, display: "inline-flex" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    flexShrink: 0,
                    height: scrolled ? 34 : 40,
                    width: scrolled ? 83 : 97,
                    transition: "transform 220ms ease, height 220ms ease, width 220ms ease",
                    transform: scrolled ? "scale(0.94)" : "scale(1)",
                    transformOrigin: "left center",
                  }}
                >
                  <Image
                    src="/images/logo.png"
                    alt=""
                    fill
                    priority
                    sizes="100px"
                    style={{ objectFit: "contain", objectPosition: "left center" }}
                  />
                </Box>
              </Link>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.25,
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
                    px: scrolled ? 1 : 1.15,
                    py: scrolled ? 0.5 : 0.65,
                    minHeight: scrolled ? 36 : 40,
                    fontSize: scrolled ? "0.9rem" : "0.9375rem",
                    transition: "padding 220ms ease, min-height 220ms ease, font-size 220ms ease",
                  }}
                >
                  {it.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
              <Button
                variant="contained"
                component={Link}
                href="/contacts#contact-form"
                size="medium"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: { xs: 1.5, sm: scrolled ? 1.75 : 2 },
                  py: scrolled ? 0.65 : 0.85,
                  fontSize: scrolled ? "0.875rem" : "0.9375rem",
                  transition: "padding 220ms ease, font-size 220ms ease",
                }}
              >
                {siteConfig.primaryCta}
              </Button>
              <IconButton
                onClick={() => setOpen(true)}
                sx={{ display: { xs: "inline-flex", md: "none" } }}
                aria-label="Открыть меню"
                size={scrolled ? "small" : "medium"}
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
