import { buildExternalId } from "@/lib/scrap/response";

/** Метаданные Scrap для списка постов (без lastPayload). */
export type ScrapImportListMeta = {
  documentId: string;
  revisionId: string;
  remoteStatus: string;
};

export type ScrapImportDetail = ScrapImportListMeta & {
  id: string;
  provider: string;
  sourceUrl: string | null;
  sourceDomain: string | null;
  scrapedAt: Date | null;
  payloadVersion: string;
  importedAt: Date;
  updatedAt: Date;
  editorialJson: unknown;
  lastPayload: unknown;
};

export function formatScrapDocRevision(
  documentId: string,
  revisionId: string,
): string {
  return `${documentId}:${revisionId}`;
}

export function scrapExternalId(documentId: string, revisionId: string): string {
  return buildExternalId(documentId, revisionId);
}

/** Тестовый/smoke draft по заголовку (ручная проверка в админке). */
export function isTestScrapDraftTitle(title: string): boolean {
  const t = title.toLowerCase();
  return t.includes("smoke test") || t.includes("удалить");
}

export type EditorialPreview =
  | { kind: "fields"; lines: string[] }
  | { kind: "json"; text: string }
  | { kind: "empty" };

export function formatEditorialPreview(editorial: unknown): EditorialPreview {
  if (editorial === null || editorial === undefined) {
    return { kind: "empty" };
  }

  if (typeof editorial !== "object" || Array.isArray(editorial)) {
    return { kind: "json", text: JSON.stringify(editorial, null, 2) };
  }

  const o = editorial as Record<string, unknown>;
  const lines: string[] = [];

  if (o.review_score !== undefined && o.review_score !== null) {
    lines.push(`review_score: ${String(o.review_score)}`);
  }
  if (o.quality_score !== undefined && o.quality_score !== null) {
    lines.push(`quality_score: ${String(o.quality_score)}`);
  }
  if (o.editorial_status !== undefined && o.editorial_status !== null) {
    lines.push(`editorial_status: ${String(o.editorial_status)}`);
  }

  const known = new Set(["review_score", "quality_score", "editorial_status"]);
  for (const [key, value] of Object.entries(o)) {
    if (known.has(key)) continue;
    if (value !== undefined && value !== null) {
      lines.push(`${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`);
    }
  }

  if (lines.length > 0) {
    return { kind: "fields", lines };
  }

  return { kind: "json", text: JSON.stringify(editorial, null, 2) };
}

export function formatLastPayloadPreview(payload: unknown): string {
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}

export const scrapImportListSelect = {
  select: {
    documentId: true,
    revisionId: true,
    remoteStatus: true,
  },
  take: 1,
  orderBy: { importedAt: "desc" as const },
};

export const scrapImportDetailSelect = {
  id: true,
  provider: true,
  documentId: true,
  revisionId: true,
  sourceUrl: true,
  sourceDomain: true,
  scrapedAt: true,
  payloadVersion: true,
  remoteStatus: true,
  importedAt: true,
  updatedAt: true,
  editorialJson: true,
  lastPayload: true,
};
