"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  hasAnalyticsCookie,
  readStoredCookieConsent,
  syncAnalyticsCookie,
} from "@/lib/cookieConsentStorage";

/** Миграция: в localStorage уже есть согласие на аналитику, cookie ещё не выставляли. */
export function ConsentAnalyticsCookieSync() {
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const consent = readStoredCookieConsent();
    if (consent?.analytics === true && !hasAnalyticsCookie()) {
      done.current = true;
      syncAnalyticsCookie(consent);
      router.refresh();
    }
  }, [router]);

  return null;
}
