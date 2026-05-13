"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ConsentAnalyticsCookieSync } from "@/components/ConsentAnalyticsCookieSync";
import { UtmSessionBridge } from "@/components/UtmSessionBridge";

const theme = createTheme({
  shape: { borderRadius: 16 },
  palette: {
    primary: { main: "#2E7DFF" },
    secondary: { main: "#00BFA6" },
    text: {
      primary: "#13284a",
      secondary: "rgba(19, 40, 74, 0.72)",
    },
  },
  typography: {
    fontFamily: "var(--font-open-sans), system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    /** Базовый ритм: комфортное чтение B2B, без «сжатого» SaaS */
    body1: {
      fontSize: "1.0625rem",
      lineHeight: 1.65,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    subtitle1: {
      fontSize: "1.0625rem",
      fontWeight: 500,
      lineHeight: 1.55,
      letterSpacing: "0.01em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
    overline: {
      fontSize: "0.6875rem",
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    caption: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
    h1: {
      fontWeight: 700,
      fontSize: "2.375rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      "@media (min-width:900px)": {
        fontSize: "3rem",
        lineHeight: 1.18,
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.25,
      letterSpacing: "-0.015em",
      "@media (min-width:900px)": {
        fontSize: "2.375rem",
        lineHeight: 1.22,
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.625rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
      "@media (min-width:900px)": {
        fontSize: "1.875rem",
        lineHeight: 1.28,
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.375rem",
      lineHeight: 1.35,
      letterSpacing: "-0.008em",
      "@media (min-width:900px)": {
        fontSize: "1.5rem",
        lineHeight: 1.33,
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      letterSpacing: "0",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.0625rem",
      lineHeight: 1.45,
      letterSpacing: "0.005em",
    },
    button: {
      fontWeight: 600,
      fontSize: "0.9375rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: "0.5em",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.02em",
          borderRadius: "14px",
        },
        sizeLarge: {
          fontSize: "1rem",
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          marginTop: 14,
          marginBottom: 14,
        },
      },
    },
  },
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookieConsentProvider>
        <Suspense fallback={null}>
          <UtmSessionBridge />
        </Suspense>
        <ConsentAnalyticsCookieSync />
        {children}
        <CookieConsentBanner />
      </CookieConsentProvider>
    </ThemeProvider>
  );
}
