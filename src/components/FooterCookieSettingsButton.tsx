"use client";

import { Button } from "@mui/material";
import { useCookieConsent } from "@/context/CookieConsentContext";

/** Ссылка в футере для повторного открытия настроек cookie (клиентский кусок). */
export function FooterCookieSettingsButton() {
  const { openCookieDialog } = useCookieConsent();

  return (
    <Button
      type="button"
      variant="text"
      size="small"
      onClick={openCookieDialog}
      sx={{
        p: 0,
        minWidth: 0,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.8125rem",
        verticalAlign: "baseline",
      }}
    >
      Настройки cookie
    </Button>
  );
}
