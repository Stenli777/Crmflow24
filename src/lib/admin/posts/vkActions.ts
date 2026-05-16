"use server";

import { PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { AdminFormState } from "@/lib/admin/types";
import { formError } from "@/lib/admin/types";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import {
  assertNonEmptyVkMessage,
  buildVkPostMessage,
} from "@/lib/vk/buildVkPost";
import {
  buildVkWallUrl,
  publishWallPost,
  resolveVkOwnerId,
} from "@/lib/vk/client";
import { getVkConfig, isVkPublishConfigured } from "@/lib/vk/config";

export async function publishPostToVkAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const postId = String(formData.get("postId") ?? "").trim();
  if (!postId) {
    return formError("Не указан ID статьи");
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return formError("Статья не найдена");
  }

  if (post.status !== PostStatus.PUBLISHED) {
    return formError(
      "Во ВКонтакте можно публиковать только опубликованные статьи",
    );
  }

  if (!post.publishedAt) {
    return formError("У статьи не задана дата публикации");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || getSiteUrl();
  if (!siteUrl) {
    return formError("NEXT_PUBLIC_SITE_URL не задан");
  }

  const vkConfig = getVkConfig();
  let message: string;

  try {
    message = buildVkPostMessage(post);
    assertNonEmptyVkMessage(message);
  } catch (err) {
    const text = err instanceof Error ? err.message : "Ошибка текста VK";
    return formError(text);
  }

  const revalidate = () => {
    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${postId}`);
  };

  if (vkConfig.dryRun) {
    await prisma.$transaction([
      prisma.vkPublicationLog.create({
        data: {
          postId,
          status: "DRY_RUN",
          vkPostId: "dry-run",
          vkPostUrl: null,
          rawResponse: {
            dryRun: true,
            messagePreview: message.slice(0, 500),
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          vkStatus: "DRY_RUN",
          vkPublishedAt: null,
          vkPostUrl: null,
        },
      }),
    ]);

    revalidate();
    return {
      success:
        "Проверка VK (dry-run): реальный API не вызывался. Статус статьи: DRY_RUN.",
    };
  }

  if (!isVkPublishConfigured(vkConfig)) {
    return formError(
      "Для реальной публикации задайте VK_ACCESS_TOKEN и VK_GROUP_ID",
    );
  }

  const ownerId = resolveVkOwnerId(vkConfig.groupId!);
  const result = await publishWallPost(
    { ownerId, message },
    {
      accessToken: vkConfig.accessToken!,
      apiVersion: vkConfig.apiVersion,
    },
  );

  if (!result.ok) {
    await prisma.$transaction([
      prisma.vkPublicationLog.create({
        data: {
          postId,
          status: "FAILED",
          errorCode: String(result.errorCode),
          errorMessage: result.errorMessage,
          rawResponse: result.raw as object,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { vkStatus: "FAILED" },
      }),
    ]);

    revalidate();
    return formError(`VK API: ${result.errorMessage}`);
  }

  const vkPostId = String(result.data.post_id);
  const vkPostUrl = buildVkWallUrl(ownerId, result.data.post_id);
  const now = new Date();

  await prisma.$transaction([
    prisma.vkPublicationLog.create({
      data: {
        postId,
        status: "PUBLISHED",
        vkPostId,
        vkPostUrl,
        rawResponse: { post_id: result.data.post_id },
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: {
        vkStatus: "PUBLISHED",
        vkPublishedAt: now,
        vkPostUrl,
      },
    }),
  ]);

  revalidate();
  return { success: `Опубликовано во ВКонтакте: ${vkPostUrl}` };
}
