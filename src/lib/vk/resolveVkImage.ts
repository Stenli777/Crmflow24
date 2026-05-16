import type { MediaAsset, Post } from "@prisma/client";
import { absoluteUrl } from "@/lib/seo/siteUrl";

export type VkImageSourceType = "cover" | "og" | "content";

export type ResolvedVkImage = {
  source: VkImageSourceType;
  url: string;
};

export const VK_IMAGE_SOURCE_LABELS: Record<VkImageSourceType, string> = {
  cover: "Обложка статьи",
  og: "OG image",
  content: "Изображение в тексте",
};

type PostForVkImage = Pick<Post, "ogImageUrl" | "contentHtml"> & {
  coverImage?: Pick<MediaAsset, "publicUrl" | "mimeType"> | null;
};

const BLOCKED_MIME_PREFIXES = ["image/svg"];

function isBlockedMime(mimeType: string | null | undefined): boolean {
  if (!mimeType) return false;
  const lower = mimeType.toLowerCase();
  return BLOCKED_MIME_PREFIXES.some((p) => lower.startsWith(p));
}

function isBlockedUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.endsWith(".svg") || lower.includes(".svg?");
}

function toAbsoluteImageUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (isBlockedUrl(trimmed)) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return absoluteUrl(trimmed);
  }
  return absoluteUrl(`/${trimmed}`);
}

function firstImageFromHtml(contentHtml: string | null | undefined): string | null {
  if (!contentHtml?.trim()) return null;
  const match = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1]?.trim() ?? null;
}

export function resolveVkImage(post: PostForVkImage): ResolvedVkImage | null {
  if (post.coverImage?.publicUrl && !isBlockedMime(post.coverImage.mimeType)) {
    const url = toAbsoluteImageUrl(post.coverImage.publicUrl);
    if (url) {
      return { source: "cover", url };
    }
  }

  if (post.ogImageUrl?.trim()) {
    const url = toAbsoluteImageUrl(post.ogImageUrl);
    if (url) {
      return { source: "og", url };
    }
  }

  const contentSrc = firstImageFromHtml(post.contentHtml);
  if (contentSrc) {
    const url = toAbsoluteImageUrl(contentSrc);
    if (url) {
      return { source: "content", url };
    }
  }

  return null;
}

export function formatVkAttachmentPreview(
  ownerId: number,
  photoId: number,
): string {
  return `photo${ownerId}_${photoId}`;
}
