import { NextResponse } from "next/server";
import {
  getScrapMaxBodyBytes,
  verifyScrapBearerAuth,
} from "@/lib/scrap/auth";
import { importScrapArticle } from "@/lib/scrap/importScrapArticle";
import {
  jsonAck,
  jsonInternalError,
  jsonMethodNotAllowed,
  jsonPayloadTooLarge,
  jsonServiceUnavailable,
  jsonUnauthorized,
  jsonValidationError,
} from "@/lib/scrap/response";
import { ScrapValidationError } from "@/lib/scrap/types";
import { validateArticleV2 } from "@/lib/scrap/validateArticleV2";

export const dynamic = "force-dynamic";

async function readJsonBody(request: Request): Promise<unknown> {
  const maxBytes = getScrapMaxBodyBytes();
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const len = Number.parseInt(contentLength, 10);
    if (Number.isFinite(len) && len > maxBytes) {
      throw new Error("PAYLOAD_TOO_LARGE");
    }
  }

  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  if (!text.trim()) {
    throw new ScrapValidationError("Empty request body");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ScrapValidationError("Invalid JSON body");
  }
}

export async function POST(request: Request) {
  const auth = verifyScrapBearerAuth(request.headers.get("authorization"));
  if (!auth.ok) {
    if (auth.reason === "not_configured") {
      console.error("[api/scrap/import] SCRAP_IMPORT_TOKEN is not configured");
      return jsonServiceUnavailable("Scrap import is not configured");
    }
    console.warn("[api/scrap/import] Unauthorized request");
    return jsonUnauthorized();
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonValidationError("Content-Type must be application/json");
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (e) {
    if (e instanceof Error && e.message === "PAYLOAD_TOO_LARGE") {
      return jsonPayloadTooLarge();
    }
    if (e instanceof ScrapValidationError) {
      return jsonValidationError(e.message);
    }
    return jsonValidationError("Invalid request body");
  }

  let payload;
  try {
    payload = validateArticleV2(body);
  } catch (e) {
    const message =
      e instanceof ScrapValidationError
        ? e.message
        : "Invalid article_v2 payload";
    console.warn("[api/scrap/import] Validation:", message);
    return jsonValidationError(message);
  }

  try {
    const ack = await importScrapArticle(payload);
    console.info(
      "[api/scrap/import] OK",
      payload.source.documentId,
      payload.source.revisionId,
      ack.remote_status,
    );
    return jsonAck(ack);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(
      "[api/scrap/import] Internal error",
      payload.source.documentId,
      payload.source.revisionId,
      msg,
    );
    return jsonInternalError();
  }
}

export async function GET(): Promise<NextResponse> {
  return jsonMethodNotAllowed();
}

export async function PUT(): Promise<NextResponse> {
  return jsonMethodNotAllowed();
}

export async function PATCH(): Promise<NextResponse> {
  return jsonMethodNotAllowed();
}

export async function DELETE(): Promise<NextResponse> {
  return jsonMethodNotAllowed();
}
