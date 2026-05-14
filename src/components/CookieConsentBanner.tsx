"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { siteConfig } from "@/config/site";

/**
 * Один модальный слой: первый визит — выбор в диалоге; «Настроить» — смена контента
 * в том же окне (без второго overlay и без баннера поверх модалки).
 */
export function CookieConsentBanner() {
  const titleId = useId();
  const descIntroId = useId();
  const descSettingsId = useId();

  const {
    hydrated,
    cookieDialogOpen,
    closeCookieDialog,
    acceptAll,
    acceptNecessary,
    applyCustom,
    consent,
  } = useCookieConsent();

  /** Второй шаг мастера при первом визите (из футера не используется). */
  const [firstVisitSettings, setFirstVisitSettings] = useState(false);
  const [draftAnalytics, setDraftAnalytics] = useState(true);

  const dialogOpen = hydrated && (consent === null || cookieDialogOpen);
  const isFirstVisit = consent === null;
  const fromFooter = Boolean(consent && cookieDialogOpen);

  useEffect(() => {
    if (!hydrated || !fromFooter || !consent) return;
    const id = window.setTimeout(() => {
      setDraftAnalytics(consent.analytics);
    }, 0);
    return () => window.clearTimeout(id);
  }, [hydrated, fromFooter, consent]);

  const goToSettings = useCallback(() => {
    setDraftAnalytics(consent?.analytics ?? true);
    setFirstVisitSettings(true);
  }, [consent]);

  const handleDialogClose = useCallback(
    (_: unknown, reason: "backdropClick" | "escapeKeyDown" | string) => {
      if (isFirstVisit) {
        if (reason === "backdropClick") return;
        if (reason === "escapeKeyDown") {
          if (firstVisitSettings) {
            setFirstVisitSettings(false);
            return;
          }
          acceptNecessary();
        }
        return;
      }
      if (reason === "escapeKeyDown" || reason === "backdropClick") {
        closeCookieDialog();
      }
    },
    [isFirstVisit, firstVisitSettings, acceptNecessary, closeCookieDialog],
  );

  const handleCloseButton = useCallback(() => {
    if (isFirstVisit) {
      if (firstVisitSettings) setFirstVisitSettings(false);
      else acceptNecessary();
      return;
    }
    closeCookieDialog();
  }, [isFirstVisit, firstVisitSettings, acceptNecessary, closeCookieDialog]);

  const handleSaveCustom = useCallback(() => {
    applyCustom(draftAnalytics);
  }, [applyCustom, draftAnalytics]);

  const showIntro = isFirstVisit && !firstVisitSettings;

  return (
    <Dialog
      key={isFirstVisit ? "cookie-first" : "cookie-footer"}
      open={dialogOpen}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      aria-describedby={showIntro ? descIntroId : descSettingsId}
      scroll="paper"
      disablePortal={false}
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: { enter: 240, exit: 180 } },
        paper: {
          sx: {
            borderRadius: "16px",
            maxHeight: "min(88dvh, calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 24px))",
            width: "100%",
            m: { xs: 1.25, sm: 2 },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        },
        backdrop: {
          sx: {
            backgroundColor: "rgba(19, 40, 74, 0.42)",
          },
        },
      }}
    >
      <DialogTitle
        id={titleId}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          py: 1.5,
          px: 2,
          pr: 1,
          fontWeight: 700,
          fontSize: "1.0625rem",
          lineHeight: 1.35,
        }}
      >
        <span>{showIntro ? "Файлы cookie и аналитика" : "Настройки cookie"}</span>
        <IconButton
          type="button"
          size="small"
          onClick={handleCloseButton}
          aria-label={
            isFirstVisit
              ? firstVisitSettings
                ? "Вернуться к выбору"
                : "Только необходимые cookie и закрыть"
              : "Закрыть без сохранения"
          }
          sx={{ mt: -0.25, color: "text.secondary" }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        id={showIntro ? descIntroId : descSettingsId}
        sx={{
          px: 2,
          py: 1.5,
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {showIntro ? (
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Мы используем необходимые cookie для работы сайта и запоминания вашего выбора. С вашего согласия
              подключается Яндекс.Метрика. Подробнее:{" "}
              <Link href="/cookies" style={{ fontWeight: 600 }}>
                Политика cookie
              </Link>
              ,{" "}
              <Link href="/privacy" style={{ fontWeight: 600 }}>
                Политика ПДн
              </Link>
              .
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.75}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Сайт {siteConfig.siteDomain}. Необходимые cookie отключить нельзя. Яндекс.Метрика подключается
              только при включённой опции ниже; без неё счётчик не загружается и аналитические cookie Метрики не
              создаются.
            </Typography>

            <FormControlLabel
              control={<Checkbox size="small" checked disabled tabIndex={-1} />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Необходимые cookie
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Работа сайта и сохранение вашего выбора. Отключить нельзя.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0, mr: 0 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={draftAnalytics}
                  onChange={(e) => setDraftAnalytics(e.target.checked)}
                  slotProps={{
                    input: {
                      "aria-label": "Разрешить аналитику Яндекс.Метрики",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Аналитика Яндекс.Метрики
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Опционально: статистика посещений.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0, mr: 0 }}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          py: 1.25,
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "stretch",
          "& .MuiButton-root": { minHeight: 40 },
        }}
      >
        {showIntro ? (
          <>
            <Button
              type="button"
              variant="contained"
              size="medium"
              onClick={acceptAll}
              aria-label="Принять все cookie и аналитику"
              sx={{ fontWeight: 700, flex: { xs: "1 1 100%", sm: "1 1 auto" } }}
            >
              Принять все
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="medium"
              onClick={acceptNecessary}
              aria-label="Только необходимые cookie, без аналитики"
              sx={{ fontWeight: 600, flex: { xs: "1 1 100%", sm: "1 1 auto" } }}
            >
              Только необходимые
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="medium"
              onClick={goToSettings}
              aria-label="Открыть детальные настройки cookie"
              sx={{ fontWeight: 600, flex: { xs: "1 1 100%", sm: "1 1 auto" } }}
            >
              Настроить
            </Button>
          </>
        ) : (
          <>
            {fromFooter ? (
              <Button
                type="button"
                onClick={closeCookieDialog}
                color="inherit"
                size="medium"
                aria-label="Отменить изменения"
                sx={{ fontWeight: 600, mr: "auto" }}
              >
                Отмена
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setFirstVisitSettings(false)}
                color="inherit"
                size="medium"
                aria-label="Вернуться к краткому выбору"
                sx={{ fontWeight: 600, mr: "auto" }}
              >
                Назад
              </Button>
            )}
            <Button
              type="button"
              variant="contained"
              size="medium"
              onClick={handleSaveCustom}
              aria-label="Сохранить выбор по cookie и аналитике"
              sx={{ fontWeight: 700, minWidth: { sm: 160 } }}
            >
              Сохранить выбор
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
