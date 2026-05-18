/** Нормализованный payload article_v2 после валидации. */
export type ArticleV2Payload = {
  payloadVersion: string;
  projectSlug: string;
  title: string;
  slug?: string;
  summary?: string;
  excerpt?: string;
  contentHtml?: string;
  contentMarkdown?: string;
  seo?: {
    title?: string;
    description?: string;
    h1?: string;
    keywords?: string;
    tags?: string[];
    category?: string;
    faq?: Array<{ question: string; answer: string }>;
  };
  source: {
    sourceUrl?: string;
    sourceDomain?: string;
    scrapedAt?: Date;
    documentId: string;
    revisionId: string;
  };
  publication: {
    status: "draft";
  };
  editorial?: Record<string, unknown>;
  media?: {
    preview?: {
      url?: string;
      alt_text?: string;
      caption?: string;
    };
  };
  /** Сырой payload для lastPayload (без секретов). */
  raw: Record<string, unknown>;
};

export type ScrapImportAck = {
  success: true;
  external_id: string;
  draft_url: string;
  remote_status: string;
  response_schema_version: "crmflow24_ack_v2";
};

export type ScrapApiError = {
  error: string;
  message: string;
  retryable: boolean;
};

export class ScrapValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScrapValidationError";
  }
}
