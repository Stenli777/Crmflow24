import { NextResponse } from "next/server";
import type { ScrapApiError, ScrapImportAck } from "./types";
import { absoluteUrl } from "@/lib/seo/siteUrl";

export const ACK_SCHEMA_VERSION = "crmflow24_ack_v2" as const;

export function buildExternalId(documentId: string, revisionId: string): string {
  return `scrap:${documentId}:${revisionId}`;
}

export function buildDraftUrl(postId: string): string {
  return absoluteUrl(`/admin/posts/${postId}`);
}

export function scrapSuccessAck(
  documentId: string,
  revisionId: string,
  postId: string,
  remoteStatus: string,
): ScrapImportAck {
  return {
    success: true,
    external_id: buildExternalId(documentId, revisionId),
    draft_url: buildDraftUrl(postId),
    remote_status: remoteStatus,
    response_schema_version: ACK_SCHEMA_VERSION,
  };
}

export function jsonAck(ack: ScrapImportAck, status = 200): NextResponse {
  return NextResponse.json(ack, { status });
}

export function jsonValidationError(message: string): NextResponse {
  const body: ScrapApiError = {
    error: "VALIDATION_ERROR",
    message,
    retryable: false,
  };
  return NextResponse.json(body, { status: 400 });
}

export function jsonUnauthorized(): NextResponse {
  return NextResponse.json(
    { error: "UNAUTHORIZED", message: "Invalid or missing token", retryable: false },
    { status: 401 },
  );
}

export function jsonServiceUnavailable(message: string): NextResponse {
  return NextResponse.json(
    { error: "SERVICE_UNAVAILABLE", message, retryable: false },
    { status: 503 },
  );
}

export function jsonPayloadTooLarge(): NextResponse {
  return NextResponse.json(
    {
      error: "PAYLOAD_TOO_LARGE",
      message: "Request body exceeds allowed size",
      retryable: false,
    },
    { status: 413 },
  );
}

export function jsonMethodNotAllowed(): NextResponse {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED", message: "Only POST is allowed", retryable: false },
    { status: 405 },
  );
}

export function jsonInternalError(): NextResponse {
  const body: ScrapApiError = {
    error: "INTERNAL_ERROR",
    message: "Internal server error",
    retryable: true,
  };
  return NextResponse.json(body, { status: 500 });
}
