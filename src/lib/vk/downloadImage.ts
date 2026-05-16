import { readFile } from "fs/promises";
import path from "path";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export const VK_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type DownloadedVkImage = {
  buffer: Buffer;
  mimeType: string;
  filename: string;
};

function getUploadsRoot(): string {
  const dir = process.env.UPLOADS_DIR?.trim();
  if (!dir) {
    return path.join(process.cwd(), "public", "uploads");
  }
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

function getPublicUploadsPrefix(): string {
  const base = process.env.UPLOADS_PUBLIC_BASE_URL?.trim() || "/uploads";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function isAllowedHost(url: URL): boolean {
  const siteHost = new URL(getSiteUrl()).host;
  if (url.host === siteHost) return true;
  if (url.host === "localhost" || url.host.startsWith("localhost:")) {
    return true;
  }
  return false;
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return ".jpg";
  }
}

function assertAllowedMime(mimeType: string): string {
  const normalized = mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!ALLOWED_MIME_TYPES.has(normalized)) {
    throw new Error(
      `Недопустимый тип изображения для VK: ${normalized || "unknown"}`,
    );
  }
  return normalized;
}

async function readLocalUpload(url: URL): Promise<DownloadedVkImage> {
  const prefix = getPublicUploadsPrefix();
  const pathname = url.pathname;
  if (!pathname.startsWith(`${prefix}/`)) {
    throw new Error("Локальный файл вне каталога uploads");
  }
  const relativeKey = pathname.slice(prefix.length + 1);
  const filePath = path.join(getUploadsRoot(), relativeKey);
  const buffer = await readFile(filePath);
  if (buffer.length > VK_IMAGE_MAX_BYTES) {
    throw new Error("Изображение слишком большое для VK");
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
  return {
    buffer,
    mimeType: assertAllowedMime(mimeType),
    filename: `vk-upload${extensionForMime(mimeType)}`,
  };
}

async function fetchRemoteImage(url: URL): Promise<DownloadedVkImage> {
  if (!isAllowedHost(url)) {
    throw new Error("Разрешены только изображения с этого сайта");
  }

  const response = await fetch(url.toString(), {
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Не удалось скачать изображение: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  const mimeType = assertAllowedMime(contentType ?? "image/jpeg");

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length > VK_IMAGE_MAX_BYTES) {
    throw new Error("Изображение слишком большое для VK");
  }

  if (buffer.length === 0) {
    throw new Error("Пустой файл изображения");
  }

  return {
    buffer,
    mimeType,
    filename: `vk-upload${extensionForMime(mimeType)}`,
  };
}

/** Скачивает изображение только с нашего сайта (без передачи URL в VK). */
export async function downloadImageForVk(imageUrl: string): Promise<DownloadedVkImage> {
  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    throw new Error("Некорректный URL изображения");
  }

  const prefix = getPublicUploadsPrefix();
  if (parsed.pathname.startsWith(`${prefix}/`)) {
    return readLocalUpload(parsed);
  }

  return fetchRemoteImage(parsed);
}
