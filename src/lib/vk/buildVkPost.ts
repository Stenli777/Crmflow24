import type { Post } from "@prisma/client";
import { absoluteUrl } from "@/lib/seo/siteUrl";

const VK_MESSAGE_MAX_LENGTH = 4000;

type PostForVk = Pick<
  Post,
  "title" | "slug" | "summary" | "excerpt" | "vkText"
>;

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateMessage(message: string): string {
  if (message.length <= VK_MESSAGE_MAX_LENGTH) {
    return message;
  }
  return `${message.slice(0, VK_MESSAGE_MAX_LENGTH - 1)}…`;
}

export function buildVkPostMessage(post: PostForVk): string {
  const articleUrl = absoluteUrl(`/blog/${post.slug}`);

  if (post.vkText?.trim()) {
    const custom = stripHtml(post.vkText.trim());
    const withLink = custom.includes(articleUrl)
      ? custom
      : `${custom}\n\nЧитать: ${articleUrl}`;
    return truncateMessage(withLink);
  }

  const description = stripHtml(
    post.summary?.trim() || post.excerpt?.trim() || "",
  );

  const lines = [`Новая статья: ${post.title.trim()}`];
  if (description) {
    lines.push("", description);
  }
  lines.push("", `Читать: ${articleUrl}`);

  const message = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return truncateMessage(message);
}

export function assertNonEmptyVkMessage(message: string): void {
  if (!message.trim()) {
    throw new Error("Текст поста для ВКонтакте пустой");
  }
}
