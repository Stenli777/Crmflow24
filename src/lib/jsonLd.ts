import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";

const base = siteConfig.siteUrl.replace(/\/$/, "");

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    legalName: legalConfig.operatorName,
    url: siteConfig.siteUrl,
    logo: `${base}/images/logo.png`,
    email: legalConfig.contactEmail,
    telephone: legalConfig.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: legalConfig.addressStructured.streetAddress,
      addressLocality: legalConfig.addressStructured.addressLocality,
      postalCode: legalConfig.addressStructured.postalCode,
      addressCountry: legalConfig.addressStructured.addressCountry,
    },
    sameAs: [legalConfig.bitrixPartnerProfileUrl],
  };
}

export function buildFaqPageJsonLd(
  items: readonly { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/** Заголовок второго уровня крошек для известных путей приложения. */
export const breadcrumbPageTitles: Record<string, string> = {
  "/about": "О компании",
  "/cases": "Кейсы",
  "/consent": "Согласие на обработку персональных данных",
  "/contacts": "Контакты",
  "/cookies": "Политика использования cookie",
  "/marketing-consent": "Согласие на рекламные рассылки",
  "/privacy": "Политика обработки персональных данных",
  "/services": "Услуги",
  "/terms": "Пользовательское соглашение",
};

export function buildBreadcrumbJsonLd(pathname: string, pageTitle: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const itemUrl = `${base}${path === "/" ? "" : path}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: `${base}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageTitle,
        item: itemUrl,
      },
    ],
  };
}

export function jsonLdScriptContent(obj: unknown) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
