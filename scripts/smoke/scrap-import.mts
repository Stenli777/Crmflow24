/**
 * Smoke: POST /api/scrap/articles/import (article_v2).
 *
 * Env:
 *   SCRAP_IMPORT_TOKEN — обязателен
 *   SCRAP_SMOKE_BASE_URL — default http://localhost:3000
 *
 * Запуск (dev server должен быть поднят):
 *   npm run smoke:scrap-import
 */

const token = process.env.SCRAP_IMPORT_TOKEN?.trim();
if (!token) {
  console.error("SCRAP_IMPORT_TOKEN is not set");
  process.exit(1);
}

const baseUrl = (
  process.env.SCRAP_SMOKE_BASE_URL?.trim() || "http://localhost:3000"
).replace(/\/$/, "");

const endpoint = `${baseUrl}/api/scrap/articles/import`;

const documentId = `smoke-${Date.now()}`;
const revisionId = "1";

const payload = {
  payload_version: "article_v2",
  project_slug: "crmflow24",
  status: "draft",
  title: `Scrap smoke import ${documentId}`,
  slug: `scrap-smoke-${documentId}`,
  excerpt: "Smoke test excerpt from Scrap.",
  content_markdown: "## Smoke\n\nImported via **scrap-import** smoke script.",
  seo: {
    title: "SEO title smoke",
    description: "SEO description smoke",
    tags: ["smoke", "scrap"],
    category: "Smoke",
    faq: [{ question: "Q?", answer: "A." }],
  },
  source: {
    source_url: "https://example.com/article",
    source_domain: "example.com",
    scraped_at: new Date().toISOString(),
    document_id: documentId,
    revision_id: revisionId,
  },
  editorial: {
    review_score: 90,
    quality_score: 85,
    editorial_status: "ready_to_publish",
  },
  publication: {
    status: "draft",
    requested_at: new Date().toISOString(),
  },
  media: {
    preview: {
      url: "https://example.com/preview.jpg",
      alt_text: "preview",
    },
  },
};

const expectedExternalId = `scrap:${documentId}:${revisionId}`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const text = await res.text();
let body: Record<string, unknown>;
try {
  body = JSON.parse(text) as Record<string, unknown>;
} catch {
  console.error("Non-JSON response", res.status, text.slice(0, 500));
  process.exit(1);
}

if (res.status !== 200) {
  console.error("HTTP", res.status, body);
  process.exit(1);
}

const checks: Array<[string, boolean]> = [
  ["success", body.success === true],
  ["external_id", body.external_id === expectedExternalId],
  ["draft_url", typeof body.draft_url === "string" && body.draft_url.includes("/admin/posts/")],
  ["remote_status", body.remote_status === "draft"],
  [
    "response_schema_version",
    body.response_schema_version === "crmflow24_ack_v2",
  ],
];

let failed = false;
for (const [field, ok] of checks) {
  if (!ok) {
    console.error(`FAIL field: ${field}`, body[field]);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log("OK scrap-import smoke", {
  external_id: body.external_id,
  draft_url: body.draft_url,
  remote_status: body.remote_status,
});

// Idempotency: same payload again
const res2 = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const body2 = (await res2.json()) as Record<string, unknown>;
if (res2.status !== 200 || body2.external_id !== expectedExternalId) {
  console.error("FAIL idempotency retry", res2.status, body2);
  process.exit(1);
}

console.log("OK idempotency retry", body2.external_id);
