import { RobotsDirective } from "@prisma/client";
import type { ArticleV2Payload } from "./types";
import { ensureUniqueSlug } from "@/lib/admin/slug-unique";
import { slugify } from "@/lib/slug";
import { markdownToSafeHtml } from "./markdown";
import { sanitizePostHtml } from "@/lib/admin/posts/sanitize";

const FALLBACK_HTML =
  "<p>Черновик импортирован из Scrap. Требуется редактура.</p>";

const HTTPS_URL_RE = /^https:\/\//i;

function isSafeHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveContentHtml(payload: ArticleV2Payload): string {
  if (payload.contentHtml?.trim()) {
    const sanitized = sanitizePostHtml(payload.contentHtml);
    if (sanitized.length > 0) {
      return sanitized;
    }
  }
  if (payload.contentMarkdown?.trim()) {
    return markdownToSafeHtml(payload.contentMarkdown);
  }
  return FALLBACK_HTML;
}

function resolveSlugBase(payload: ArticleV2Payload): string {
  if (payload.slug?.trim()) {
    const fromSlug = slugify(payload.slug);
    if (fromSlug) return fromSlug;
  }
  return slugify(payload.title);
}

function resolveSeoKeywords(payload: ArticleV2Payload): string | null {
  const kw = payload.seo?.keywords?.trim();
  if (kw) return kw;
  const tags = payload.seo?.tags;
  if (tags && tags.length > 0) {
    return tags.join(", ");
  }
  return null;
}

function resolveOgImageUrl(payload: ArticleV2Payload): string | null {
  const url = payload.media?.preview?.url?.trim();
  if (!url || !HTTPS_URL_RE.test(url) || !isSafeHttpsUrl(url)) {
    return null;
  }
  return url;
}

export type MappedPostData = {
  title: string;
  slug: string;
  summary: string | null;
  excerpt: string | null;
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImageUrl: string | null;
  robotsDirective: RobotsDirective;
  categoryName: string | null;
  tagNames: string[];
  faqItems: Array<{ question: string; answer: string; sortOrder: number }>;
};

export async function mapArticleV2ToPostData(
  payload: ArticleV2Payload,
  excludePostId?: string,
): Promise<MappedPostData> {
  const slugBase = resolveSlugBase(payload);
  if (!slugBase) {
    throw new Error("SLUG_EMPTY");
  }

  const slug = await ensureUniqueSlug(slugBase, "post", excludePostId);

  const faqItems =
    payload.seo?.faq?.map((item, index) => ({
      question: item.question,
      answer: item.answer,
      sortOrder: index,
    })) ?? [];

  return {
    title: payload.title,
    slug,
    summary: payload.summary ?? payload.seo?.h1 ?? null,
    excerpt: payload.excerpt ?? null,
    contentHtml: resolveContentHtml(payload),
    seoTitle: payload.seo?.title ?? null,
    seoDescription: payload.seo?.description ?? null,
    seoKeywords: resolveSeoKeywords(payload),
    ogImageUrl: resolveOgImageUrl(payload),
    robotsDirective: RobotsDirective.NOINDEX_NOFOLLOW,
    categoryName: payload.seo?.category?.trim() ?? null,
    tagNames: payload.seo?.tags ?? [],
    faqItems,
  };
}
