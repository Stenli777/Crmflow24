import crypto from "crypto";

function readBearerToken(authorization: string | null): string | null {
  if (!authorization?.trim()) {
    return null;
  }
  const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());
  return match?.[1]?.trim() ?? null;
}

/** Constant-time сравнение двух строк одинаковой длины (UTF-8). */
export function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function getScrapImportToken(): string | null {
  const token = process.env.SCRAP_IMPORT_TOKEN?.trim();
  return token || null;
}

export function getScrapMaxBodyBytes(): number {
  const raw = process.env.SCRAP_MAX_BODY_BYTES?.trim();
  if (!raw) {
    return 1_048_576;
  }
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) {
    return 1_048_576;
  }
  return n;
}

export type ScrapAuthResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "missing" | "invalid" };

export function verifyScrapBearerAuth(
  authorization: string | null,
): ScrapAuthResult {
  const expected = getScrapImportToken();
  if (!expected) {
    return { ok: false, reason: "not_configured" };
  }

  const provided = readBearerToken(authorization);
  if (!provided) {
    return { ok: false, reason: "missing" };
  }

  if (!safeEqualStrings(provided, expected)) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true };
}
