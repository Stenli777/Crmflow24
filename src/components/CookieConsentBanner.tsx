"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { siteConfig } from "@/config/site";

export function CookieConsentBanner() {
  const {
    showMainBanner,
    cookieDialogOpen,
    openCookieDialog,
    closeCookieDialog,
    acceptAll,
    acceptNecessary,
    applyCustom,
    consent,
  } = useCookieConsent();

  const [draftAnalytics, setDraftAnalytics] = useState(true);

  useEffect(() => {
    if (!cookieDialogOpen) return;
    setDraftAnalytics(consent?.analytics ?? true);
  }, [cookieDialogOpen, consent]);

  return (
    <>
      {showMainBanner ? (
        <Box
          role="dialog"
          aria-modal="false"
          aria-label="Настройки файлов cookie"
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (theme) => theme.zIndex.modal + 2,
            p: { xs: 1.5, sm: 2 },
            pointerEvents: "none",
          }}
        >
          <Paper
            elevation={12}
            sx={{
              pointerEvents: "auto",
              maxWidth: 960,
              mx: "auto",
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Файлы cookie и аналитика
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                Мы используем необходимые cookie для работы сайта и запоминания вашего выбора. С вашего
                согласия подключается Яндекс.Метрика. Подробнее:{" "}
                <Link href="/cookies" style={{ fontWeight: 600 }}>
                  Политика cookie
                </Link>
                ,{" "}
                <Link href="/privacy" style={{ fontWeight: 600 }}>
                  Политика ПДн
                </Link>
                .
              </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap",
                gap: 1,
              }}
            >
                <Button variant="contained" onClick={acceptAll} sx={{ fontWeight: 700 }}>
                  Принять все
                </Button>
                <Button variant="outlined" onClick={acceptNecessary} sx={{ fontWeight: 600 }}>
                  Только необходимые
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setDraftAnalytics(true);
                    openCookieDialog();
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  Настроить
                </Button>
            </Box>
            </Stack>
          </Paper>
        </Box>
      ) : null}

      <Dialog open={cookieDialogOpen} onClose={closeCookieDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Настройки cookie</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Сайт {siteConfig.siteDomain}. Необходимые cookie отключить нельзя. Аналитика (Яндекс.Метрика)
              подключается только при включённом переключателе ниже.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={draftAnalytics}
                  onChange={(e) => setDraftAnalytics(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Аналитика (Яндекс.Метрика)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Счётчик не загружается без этой опции.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeCookieDialog} color="inherit">
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={() => applyCustom(draftAnalytics)}
            sx={{ fontWeight: 700 }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
