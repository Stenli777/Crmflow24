/** Ключ в localStorage; версия в имени — при смене схемы можно сменить ключ. */
export const COOKIE_CONSENT_STORAGE_KEY = "crmflow24_cookie_consent_v1";

/**
 * Зеркало разрешения аналитики для SSR (Next читает cookies()).
 * Значение `1` — можно подключать Яндекс.Метрику в HTML.
 */
export const ANALYTICS_COOKIE_NAME = "crmflow24_analytics";

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
  syncAnalyticsCookie(null);
}

export function syncAnalyticsCookie(consent: StoredCookieConsent | null): void {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secureAttr = secure ? "; Secure" : "";
  if (consent?.analytics === true) {
    document.cookie = `${ANALYTICS_COOKIE_NAME}=1; Path=/; Max-Age=31536000; SameSite=Lax${secureAttr}`;
  } else {
    document.cookie = `${ANALYTICS_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secureAttr}`;
  }
}

export function hasAnalyticsCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((row) => row.startsWith(`${ANALYTICS_COOKIE_NAME}=1`));
}
