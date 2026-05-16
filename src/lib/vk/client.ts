import type { VkConfig } from "./config";

export type VkWallPostResponse = {
  post_id: number;
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
