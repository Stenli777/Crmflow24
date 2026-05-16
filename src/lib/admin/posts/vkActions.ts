"use server";

import { PostStatus, VkPublicationStatus } from "@prisma/client";
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
import { resolveVkImage, VK_IMAGE_SOURCE_LABELS } from "@/lib/vk/resolveVkImage";
import { uploadVkImage } from "@/lib/vk/uploadVkImage";

async function writeVkFailure(
  postId: string,
  error: {
    errorCode?: string | number;
    errorMessage: string;
    rawResponse?: object;
  },
) {
  await prisma.$transaction([
    prisma.vkPublicationLog.create({
      data: {
        postId,
        status: VkPublicationStatus.FAILED,
        errorCode: error.errorCode != null ? String(error.errorCode) : null,
        errorMessage: error.errorMessage,
        rawResponse: error.rawResponse ?? undefined,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { vkStatus: VkPublicationStatus.FAILED },
    }),
  ]);
}

export async function publishPostToVkAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const postId = String(formData.get("postId") ?? "").trim();
  const forceRepublish = String(formData.get("forceRepublish") ?? "") === "1";

  if (!postId) {
    return formError("Не указан ID статьи");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      coverImage: { select: { publicUrl: true, mimeType: true } },
    },
  });

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
  const resolvedImage = resolveVkImage(post);

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

  const imagePreviewBase = resolvedImage
    ? {
        source: resolvedImage.source,
        sourceLabel: VK_IMAGE_SOURCE_LABELS[resolvedImage.source],
        url: resolvedImage.url,
      }
    : null;

  if (vkConfig.dryRun) {
    await prisma.$transaction([
      prisma.vkPublicationLog.create({
        data: {
          postId,
          status: VkPublicationStatus.DRY_RUN,
          vkPostId: "dry-run",
          vkPostUrl: null,
          rawResponse: {
            dryRun: true,
            messagePreview: message.slice(0, 500),
            image: imagePreviewBase
              ? {
                  ...imagePreviewBase,
                  attachmentPreview: "photo{owner_id}_{id} (dry-run, upload skipped)",
                }
              : null,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          vkStatus: VkPublicationStatus.DRY_RUN,
          vkPublishedAt: null,
          vkPostUrl: null,
        },
      }),
    ]);

    revalidate();
    const imageNote = imagePreviewBase
      ? ` Изображение: ${imagePreviewBase.sourceLabel} (upload не выполнялся).`
      : " Без изображения.";
    return {
      success: `Проверка VK (dry-run): API не вызывался.${imageNote}`,
    };
  }

  if (
    post.vkStatus === VkPublicationStatus.PUBLISHED &&
    !forceRepublish
  ) {
    return formError(
      "Статья уже опубликована в VK. Нажмите «Опубликовать повторно», если нужен новый пост.",
    );
  }

  if (!isVkPublishConfigured(vkConfig)) {
    return formError(
      "Для реальной публикации задайте VK_ACCESS_TOKEN и VK_GROUP_ID",
    );
  }

  const ownerId = resolveVkOwnerId(vkConfig.groupId!);
  const apiConfig = {
    accessToken: vkConfig.accessToken!,
    apiVersion: vkConfig.apiVersion,
    groupId: vkConfig.groupId!,
  };

  let attachment: string | undefined;
  const publishMeta: Record<string, unknown> = {
    image: imagePreviewBase,
  };

  if (resolvedImage) {
    const upload = await uploadVkImage(resolvedImage, apiConfig);
    if (!upload.ok) {
      await writeVkFailure(postId, {
        errorCode: upload.errorCode,
        errorMessage: `[${upload.stage}] ${upload.errorMessage}`,
        rawResponse: {
          stage: upload.stage,
          image: imagePreviewBase,
          raw: upload.raw ?? null,
        },
      });
      revalidate();
      return formError(`VK image: ${upload.errorMessage}`);
    }
    attachment = upload.attachment;
    publishMeta.image = {
      ...imagePreviewBase,
      attachment: upload.attachment,
      vkPhotoId: upload.photo.id,
      vkPhotoOwnerId: upload.photo.owner_id,
    };
  }

  const result = await publishWallPost(
    { ownerId, message, attachments: attachment },
    apiConfig,
  );

  if (!result.ok) {
    await writeVkFailure(postId, {
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
      rawResponse: {
        stage: "wall.post",
        ...publishMeta,
        raw: result.raw as object,
      },
    });
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
        status: VkPublicationStatus.PUBLISHED,
        vkPostId,
        vkPostUrl,
        rawResponse: {
          post_id: result.data.post_id,
          attachments: attachment ?? null,
          ...publishMeta,
        },
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: {
        vkStatus: VkPublicationStatus.PUBLISHED,
        vkPublishedAt: now,
        vkPostUrl,
      },
    }),
  ]);

  revalidate();
  const attachNote = attachment ? ` Вложение: ${attachment}.` : "";
  return { success: `Опубликовано во ВКонтакте: ${vkPostUrl}.${attachNote}` };
}
