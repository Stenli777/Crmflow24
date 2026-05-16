import type { PostStatus, VkPublicationStatus } from "@prisma/client";

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликовано",
  ARCHIVED: "В архиве",
};

export const VK_STATUS_LABELS: Record<VkPublicationStatus, string> = {
  NOT_PUBLISHED: "Не опубликовано",
  DRY_RUN: "Проверка (dry-run)",
  PUBLISHED: "Опубликовано",
  FAILED: "Ошибка",
};

export function formatAdminDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
