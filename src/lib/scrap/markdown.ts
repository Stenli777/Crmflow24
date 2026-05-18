import { marked } from "marked";
import { sanitizePostHtml } from "@/lib/admin/posts/sanitize";

marked.setOptions({
  gfm: true,
  breaks: false,
});

/** Markdown → санитизированный HTML для Post.contentHtml. */
export function markdownToSafeHtml(markdown: string): string {
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  const sanitized = sanitizePostHtml(rawHtml);
  return sanitized.length > 0 ? sanitized : "<p></p>";
}
