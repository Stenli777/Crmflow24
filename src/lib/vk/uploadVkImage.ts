import {
  formatPhotoAttachment,
  getWallUploadServer,
  saveWallPhoto,
  uploadPhotoToWallServer,
  type VkSavedWallPhoto,
} from "./client";
import type { VkConfig } from "./config";
import { downloadImageForVk } from "./downloadImage";
import type { ResolvedVkImage } from "./resolveVkImage";

export type VkImageUploadSuccess = {
  ok: true;
  attachment: string;
  photo: VkSavedWallPhoto;
  source: ResolvedVkImage["source"];
  imageUrl: string;
};

export type VkImageUploadFailure = {
  ok: false;
  stage: "download" | "getWallUploadServer" | "upload" | "saveWallPhoto";
  errorCode?: number;
  errorMessage: string;
  raw?: unknown;
};

export type VkImageUploadResult = VkImageUploadSuccess | VkImageUploadFailure;

export async function uploadVkImage(
  image: ResolvedVkImage,
  config: Pick<VkConfig, "accessToken" | "apiVersion" | "groupId">,
): Promise<VkImageUploadResult> {
  if (!config.groupId || !config.accessToken) {
    return {
      ok: false,
      stage: "getWallUploadServer",
      errorMessage: "VK не настроен (token/group)",
    };
  }

  let file: Awaited<ReturnType<typeof downloadImageForVk>>;
  try {
    file = await downloadImageForVk(image.url);
  } catch (err) {
    return {
      ok: false,
      stage: "download",
      errorMessage: err instanceof Error ? err.message : "Ошибка скачивания изображения",
    };
  }

  const uploadServer = await getWallUploadServer(config.groupId, config);
  if (!uploadServer.ok) {
    return {
      ok: false,
      stage: "getWallUploadServer",
      errorCode: uploadServer.errorCode,
      errorMessage: uploadServer.errorMessage,
      raw: uploadServer.raw,
    };
  }

  const uploaded = await uploadPhotoToWallServer(uploadServer.data.upload_url, file);
  if (!uploaded.ok) {
    return {
      ok: false,
      stage: "upload",
      errorMessage: uploaded.errorMessage,
      raw: uploaded.raw,
    };
  }

  const saved = await saveWallPhoto(
    {
      groupId: config.groupId,
      server: uploaded.data.server,
      photo: uploaded.data.photo,
      hash: uploaded.data.hash,
    },
    config,
  );

  if (!saved.ok) {
    return {
      ok: false,
      stage: "saveWallPhoto",
      errorCode: saved.errorCode,
      errorMessage: saved.errorMessage,
      raw: saved.raw,
    };
  }

  const photo = saved.data[0];
  if (!photo?.id || photo.owner_id === undefined) {
    return {
      ok: false,
      stage: "saveWallPhoto",
      errorMessage: "VK не вернул сохранённое фото",
      raw: saved.data,
    };
  }

  return {
    ok: true,
    attachment: formatPhotoAttachment(photo),
    photo,
    source: image.source,
    imageUrl: image.url,
  };
}
