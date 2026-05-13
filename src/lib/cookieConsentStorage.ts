/** Ключ в localStorage; версия в имени — при смене схемы можно сменить ключ. */
export const COOKIE_CONSENT_STORAGE_KEY = "crmflow24_cookie_consent_v1";

export type StoredCookieConsent = {
  version: 1;
  /** Выбор в баннере */
  choice: "all" | "necessary" | "custom";
  /** Разрешена ли аналитика (Яндекс.Метрика) */
  analytics: boolean;
  updatedAt: string;
};

export function readStoredCookieConsent(): StoredCookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCookieConsent;
    if (parsed?.version !== 1) return null;
    if (!["all", "necessary", "custom"].includes(parsed.choice)) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredCookieConsent(data: StoredCookieConsent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(data));
}

export function clearStoredCookieConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
}
