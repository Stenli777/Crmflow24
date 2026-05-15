import sanitizeHtml from "sanitize-html";
import type { Prisma } from "@prisma/client";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "title"],
};

function transformAnchor(
  tagName: string,
  attribs: sanitizeHtml.Attributes,
): sanitizeHtml.Tag {
  if (tagName === "a" && attribs.href) {
    const href = attribs.href;
    if (!href.toLowerCase().startsWith("javascript:")) {
      attribs.rel = "nofollow noopener noreferrer";
      if (!attribs.target) {
        attribs.target = "_blank";
      }
    }
  }
  return { tagName, attribs };
}

/** Санитизация HTML перед сохранением в БД. */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: transformAnchor,
    },
    exclusiveFilter(frame) {
      if (frame.tag === "a" && frame.attribs.href?.toLowerCase().startsWith("javascript:")) {
        return true;
      }
      if (frame.tag === "img" && frame.attribs.src?.toLowerCase().startsWith("data:")) {
        return true;
      }
      return false;
    },
  }).trim();
}

export function parseContentJson(raw: string): Prisma.InputJsonValue | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("INVALID_CONTENT_JSON");
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("INVALID_CONTENT_JSON");
  }

  return parsed as Prisma.InputJsonValue;
}

export function parsePostContent(formData: FormData): {
  contentJson: Prisma.InputJsonValue | null;
  contentHtml: string | null;
} {
  const contentJsonRaw = String(formData.get("contentJson") ?? "");
  const contentHtmlRaw = String(formData.get("contentHtml") ?? "");

  const contentJson = parseContentJson(contentJsonRaw);
  const sanitized =
    contentHtmlRaw.trim().length > 0 ? sanitizePostHtml(contentHtmlRaw) : "";

  return {
    contentJson,
    contentHtml: sanitized.length > 0 ? sanitized : null,
  };
}
