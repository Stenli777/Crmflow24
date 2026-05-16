import type { VkConfig } from "./config";

export type VkWallPostResponse = {
  post_id: number;
};

export type VkWallUploadServer = {
  upload_url: string;
};

export type VkUploadServerResponse = {
  server: number;
  photo: string;
  hash: string;
};

export type VkSavedWallPhoto = {
  id: number;
  owner_id: number;
  access_key?: string;
};

export type VkApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      errorCode: number;
      errorMessage: string;
      raw: unknown;
    };

function toOwnerId(groupId: string): string {
  const numeric = groupId.replace(/^-/, "");
  return `-${numeric}`;
}

export function buildVkWallUrl(ownerId: string, postId: number | string): string {
  return `https://vk.com/wall${ownerId}_${postId}`;
}

export async function vkApi<T>(
  method: string,
  params: Record<string, string | number | boolean | undefined>,
  config: Pick<VkConfig, "accessToken" | "apiVersion">,
): Promise<VkApiResult<T>> {
  if (!config.accessToken) {
    return {
      ok: false,
      errorCode: 0,
      errorMessage: "VK_ACCESS_TOKEN не задан",
      raw: null,
    };
  }

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      body.set(key, String(value));
    }
  }
  body.set("access_token", config.accessToken);
  body.set("v", config.apiVersion);

  const response = await fetch(`https://api.vk.com/method/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return {
      ok: false,
      errorCode: 0,
      errorMessage: "Некорректный ответ VK API",
      raw: null,
    };
  }

  const record = json as {
    error?: { error_code: number; error_msg: string };
    response?: T;
  };

  if (record.error) {
    return {
      ok: false,
      errorCode: record.error.error_code,
      errorMessage: record.error.error_msg,
      raw: json,
    };
  }

  if (record.response === undefined) {
    return {
      ok: false,
      errorCode: 0,
      errorMessage: "Пустой ответ VK API",
      raw: json,
    };
  }

  return { ok: true, data: record.response };
}

export async function publishWallPost(
  input: {
    ownerId: string;
    message: string;
    attachments?: string;
  },
  config: Pick<VkConfig, "accessToken" | "apiVersion">,
): Promise<VkApiResult<VkWallPostResponse>> {
  return vkApi<VkWallPostResponse>(
    "wall.post",
    {
      owner_id: input.ownerId,
      from_group: 1,
      message: input.message,
      attachments: input.attachments,
    },
    config,
  );
}

export function resolveVkOwnerId(groupId: string): string {
  return toOwnerId(groupId);
}

function toPositiveGroupId(groupId: string): string {
  return groupId.replace(/^-/, "");
}

export async function getWallUploadServer(
  groupId: string,
  config: Pick<VkConfig, "accessToken" | "apiVersion">,
): Promise<VkApiResult<VkWallUploadServer>> {
  return vkApi<VkWallUploadServer>(
    "photos.getWallUploadServer",
    { group_id: toPositiveGroupId(groupId) },
    config,
  );
}

export async function uploadPhotoToWallServer(
  uploadUrl: string,
  file: { buffer: Buffer; mimeType: string; filename: string },
): Promise<
  | { ok: true; data: VkUploadServerResponse }
  | { ok: false; errorMessage: string; raw: unknown }
> {
  const form = new FormData();
  const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimeType });
  form.append("photo", blob, file.filename);

  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return {
      ok: false,
      errorMessage: "Ошибка загрузки файла на сервер VK",
      raw: null,
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return {
      ok: false,
      errorMessage: "Некорректный ответ сервера загрузки VK",
      raw: null,
    };
  }

  const record = json as Partial<VkUploadServerResponse> & { error?: string };
  if (!response.ok || record.error || !record.server || !record.hash || !record.photo) {
    return {
      ok: false,
      errorMessage: record.error ?? "Сервер VK не принял изображение",
      raw: json,
    };
  }

  return {
    ok: true,
    data: {
      server: record.server,
      photo: record.photo,
      hash: record.hash,
    },
  };
}

export async function saveWallPhoto(
  input: {
    groupId: string;
    server: number;
    photo: string;
    hash: string;
  },
  config: Pick<VkConfig, "accessToken" | "apiVersion">,
): Promise<VkApiResult<VkSavedWallPhoto[]>> {
  return vkApi<VkSavedWallPhoto[]>(
    "photos.saveWallPhoto",
    {
      group_id: toPositiveGroupId(input.groupId),
      server: input.server,
      photo: input.photo,
      hash: input.hash,
    },
    config,
  );
}

export function formatPhotoAttachment(photo: VkSavedWallPhoto): string {
  return `photo${photo.owner_id}_${photo.id}`;
}
