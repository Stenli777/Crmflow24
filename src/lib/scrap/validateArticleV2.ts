import type { ArticleV2Payload } from "./types";
import { ScrapValidationError } from "./types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function trimStr(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function parseScrapedAt(v: unknown): Date | undefined {
  if (typeof v !== "string" || !v.trim()) return undefined;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
}

function parseDocumentId(v: unknown): string | undefined {
  if (typeof v === "number" && Number.isFinite(v)) {
    return String(Math.trunc(v));
  }
  if (typeof v === "string" && v.trim()) {
    return v.trim();
  }
  return undefined;
}

function parseRevisionId(v: unknown): string {
  if (typeof v === "number" && Number.isFinite(v)) {
    return String(Math.trunc(v));
  }
  if (typeof v === "string" && v.trim()) {
    return v.trim();
  }
  return "latest";
}

function parseFaq(
  faq: unknown,
): Array<{ question: string; answer: string }> | undefined {
  if (!Array.isArray(faq) || faq.length === 0) return undefined;

  const items: Array<{ question: string; answer: string }> = [];
  for (const item of faq) {
    if (!isRecord(item)) continue;
    const question = trimStr(item.question);
    const answer = trimStr(item.answer);
    if (question && answer) {
      items.push({ question, answer });
    }
  }
  return items.length > 0 ? items : undefined;
}

function parseTags(tags: unknown): string[] | undefined {
  if (!Array.isArray(tags)) return undefined;
  const out = tags
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter((t) => t.length > 0);
  return out.length > 0 ? out : undefined;
}

/**
 * Валидирует и нормализует article_v2.
 * @throws ScrapValidationError — terminal 400
 */
export function validateArticleV2(body: unknown): ArticleV2Payload {
  if (!isRecord(body)) {
    throw new ScrapValidationError("Body must be a JSON object");
  }

  const payloadVersion = trimStr(body.payload_version);
  if (payloadVersion && payloadVersion !== "article_v2") {
    throw new ScrapValidationError(
      `Unsupported payload_version: ${payloadVersion}`,
    );
  }

  const projectSlug = trimStr(body.project_slug);
  if (projectSlug && projectSlug !== "crmflow24") {
    throw new ScrapValidationError(`Unsupported project_slug: ${projectSlug}`);
  }

  const title = trimStr(body.title);
  if (!title) {
    throw new ScrapValidationError("title is required");
  }

  if (!isRecord(body.source)) {
    throw new ScrapValidationError("source is required");
  }

  const documentId = parseDocumentId(body.source.document_id);
  if (!documentId) {
    throw new ScrapValidationError("source.document_id is required");
  }

  if (!isRecord(body.publication)) {
    throw new ScrapValidationError("publication is required");
  }

  const publicationStatus = trimStr(body.publication.status);
  if (!publicationStatus) {
    throw new ScrapValidationError("publication.status is required");
  }
  if (publicationStatus !== "draft") {
    throw new ScrapValidationError(
      `Unsupported publication.status: ${publicationStatus}`,
    );
  }

  const revisionId = parseRevisionId(body.source.revision_id);

  let seo: ArticleV2Payload["seo"];
  if (isRecord(body.seo)) {
    seo = {
      title: trimStr(body.seo.title),
      description: trimStr(body.seo.description),
      h1: trimStr(body.seo.h1),
      keywords: trimStr(body.seo.keywords),
      tags: parseTags(body.seo.tags),
      category: trimStr(body.seo.category),
      faq: parseFaq(body.seo.faq),
    };
  }

  let editorial: Record<string, unknown> | undefined;
  if (isRecord(body.editorial)) {
    editorial = { ...body.editorial };
  }

  let media: ArticleV2Payload["media"];
  if (isRecord(body.media) && isRecord(body.media.preview)) {
    media = {
      preview: {
        url: trimStr(body.media.preview.url),
        alt_text: trimStr(body.media.preview.alt_text),
        caption: trimStr(body.media.preview.caption),
      },
    };
  }

  return {
    payloadVersion: payloadVersion ?? "article_v2",
    projectSlug: projectSlug ?? "crmflow24",
    title,
    slug: trimStr(body.slug),
    summary: trimStr(body.summary),
    excerpt: trimStr(body.excerpt),
    contentHtml: trimStr(body.content_html),
    contentMarkdown: trimStr(body.content_markdown),
    seo,
    source: {
      sourceUrl: trimStr(body.source.source_url),
      sourceDomain: trimStr(body.source.source_domain),
      scrapedAt: parseScrapedAt(body.source.scraped_at),
      documentId,
      revisionId,
    },
    publication: { status: "draft" },
    editorial,
    media,
    raw: body,
  };
}
