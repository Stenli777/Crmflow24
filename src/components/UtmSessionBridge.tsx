"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const STORAGE_KEY = "crmflow_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function UtmSessionBridge() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let stored: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};
    try {
      stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      /* noop */
    }
    const next = { ...stored };
    let changed = false;
    for (const k of UTM_KEYS) {
      const v = searchParams.get(k)?.trim();
      if (v) {
        next[k] = v;
        changed = true;
      }
    }
    if (changed) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, [searchParams]);

  return null;
}
