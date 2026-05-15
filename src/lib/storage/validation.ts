const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type ValidatedUpload = {
  mimeType: string;
  extension: string;
};

export function validateImageUpload(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): ValidatedUpload {
  if (buffer.length === 0) {
    throw new Error("EMPTY_FILE");
  }

  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const normalizedMime = mimeType.toLowerCase().split(";")[0]?.trim() ?? "";
  if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
    throw new Error("INVALID_MIME");
  }

  const extFromName = extractExtension(originalName);
  if (extFromName && !ALLOWED_EXTENSIONS.has(extFromName)) {
    throw new Error("INVALID_EXTENSION");
  }

  const extension = MIME_TO_EXT[normalizedMime];
  if (!extension) {
    throw new Error("INVALID_MIME");
  }

  if (extFromName && extFromName !== extension && extFromName !== ".jpeg") {
    // .jpeg and .jpg both map to image/jpeg
    if (!(normalizedMime === "image/jpeg" && extFromName === ".jpg")) {
      throw new Error("MIME_EXTENSION_MISMATCH");
    }
  }

  return { mimeType: normalizedMime, extension };
}

function extractExtension(filename: string): string | null {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return null;
  return base.slice(dot).toLowerCase();
}

export function uploadErrorMessage(code: string): string {
  switch (code) {
    case "EMPTY_FILE":
      return "Файл пустой";
    case "FILE_TOO_LARGE":
      return "Файл слишком большой (максимум 5 МБ)";
    case "INVALID_MIME":
    case "INVALID_EXTENSION":
    case "MIME_EXTENSION_MISMATCH":
      return "Разрешены только изображения JPEG, PNG, WebP или AVIF";
    default:
      return "Не удалось загрузить файл";
  }
}
