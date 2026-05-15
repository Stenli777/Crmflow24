import { isIndexableEnvironment } from "@/lib/seo/deployEnvironment";

/** Блокировка RSS/llms/sitemap на staging и dev (не только nginx). */
export function isSeoFeedAllowed(): boolean {
  return isIndexableEnvironment();
}

export function seoFeedBlockedResponse(): Response {
  return new Response("Not available on non-production environment", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
