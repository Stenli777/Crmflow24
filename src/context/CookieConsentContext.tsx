"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { StoredCookieConsent } from "@/lib/cookieConsentStorage";
import {
  readStoredCookieConsent,
  syncAnalyticsCookie,
  writeStoredCookieConsent,
} from "@/lib/cookieConsentStorage";

type CookieConsentContextValue = {
  hydrated: boolean;
  consent: StoredCookieConsent | null;
  analyticsAllowed: boolean;
  /** Нет сохранённого решения — показываем нижний баннер */
  showMainBanner: boolean;
  cookieDialogOpen: boolean;
  openCookieDialog: () => void;
  closeCookieDialog: () => void;
  acceptAll: () => void;
  acceptNecessary: () => void;
  applyCustom: (analytics: boolean) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

function nowIso() {
  return new Date().toISOString();
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [consent, setConsent] = useState<StoredCookieConsent | null>(null);
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setConsent(readStoredCookieConsent());
      setHydrated(true);
    });
  }, []);

  const persist = useCallback(
    (next: StoredCookieConsent) => {
      writeStoredCookieConsent(next);
      syncAnalyticsCookie(next);
      setConsent(next);
      setCookieDialogOpen(false);
      router.refresh();
    },
    [router],
  );

  const acceptAll = useCallback(() => {
    persist({
      version: 1,
      choice: "all",
      analytics: true,
      updatedAt: nowIso(),
    });
  }, [persist]);

  const acceptNecessary = useCallback(() => {
    persist({
      version: 1,
      choice: "necessary",
      analytics: false,
      updatedAt: nowIso(),
    });
  }, [persist]);

  const applyCustom = useCallback(
    (analytics: boolean) => {
      persist({
        version: 1,
        choice: "custom",
        analytics,
        updatedAt: nowIso(),
      });
    },
    [persist],
  );

  const openCookieDialog = useCallback(() => {
    setCookieDialogOpen(true);
  }, []);

  const closeCookieDialog = useCallback(() => {
    setCookieDialogOpen(false);
  }, []);

  const showMainBanner = hydrated && consent === null;

  const value = useMemo(
    () => ({
      hydrated,
      consent,
      analyticsAllowed: consent?.analytics === true,
      showMainBanner,
      cookieDialogOpen,
      openCookieDialog,
      closeCookieDialog,
      acceptAll,
      acceptNecessary,
      applyCustom,
    }),
    [
      hydrated,
      consent,
      showMainBanner,
      cookieDialogOpen,
      openCookieDialog,
      closeCookieDialog,
      acceptAll,
      acceptNecessary,
      applyCustom,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
