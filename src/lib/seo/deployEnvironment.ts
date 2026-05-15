export type DeployEnvironment = "production" | "staging" | "development";

const STAGING_HOST_MARKERS = ["stage.", "staging.", "dev.crmflow24"] as const;

function normalizeSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().toLowerCase();
}

/**
 * Окружение деплоя для robots, sitemap, RSS и заголовков.
 * Приоритет: STAGE → NEXT_PUBLIC_SITE_URL → NODE_ENV.
 */
export function getDeployEnvironment(): DeployEnvironment {
  const stage = process.env.STAGE?.trim().toLowerCase();
  if (stage === "staging" || stage === "stage") {
    return "staging";
  }
  if (stage === "production" || stage === "prod") {
    return "production";
  }

  const siteUrl = normalizeSiteUrl();

  if (
    !siteUrl ||
    siteUrl.includes("localhost") ||
    siteUrl.includes("127.0.0.1")
  ) {
    return "development";
  }

  if (STAGING_HOST_MARKERS.some((marker) => siteUrl.includes(marker))) {
    return "staging";
  }

  if (siteUrl.includes("crmflow24.ru")) {
    return "production";
  }

  // Неизвестный production-like хост без явного STAGE=production — безопасный noindex.
  if (process.env.NODE_ENV === "production") {
    return "staging";
  }

  return "development";
}

/** Публичная индексация (crmflow24.ru production). */
export function isIndexableEnvironment(): boolean {
  return getDeployEnvironment() === "production";
}

export function isStagingEnvironment(): boolean {
  return getDeployEnvironment() === "staging";
}
