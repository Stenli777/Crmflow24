import { siteConfig } from "@/config/site";

/** Канонический origin сайта без завершающего слэша. */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    return env.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return siteConfig.siteUrl.replace(/\/$/, "");
}

/** Абсолютный URL для metadata, canonical, JSON-LD. */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
