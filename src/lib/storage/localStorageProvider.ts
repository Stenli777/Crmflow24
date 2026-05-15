import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import type { StorageProvider, StoredFile, UploadFileInput } from "./storageProvider";
import { validateImageUpload } from "./validation";

const DEFAULT_UPLOADS_ROOT = path.join("public", "uploads");

function getUploadsRoot(): string {
  const dir = process.env.UPLOADS_DIR?.trim();
  if (!dir) {
    return path.join(process.cwd(), DEFAULT_UPLOADS_ROOT);
  }
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

function getPublicBaseUrl(): string {
  const base = process.env.UPLOADS_PUBLIC_BASE_URL?.trim() || "/uploads";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export class LocalStorageProvider implements StorageProvider {
  getPublicUrl(storageKey: string): string {
    const key = storageKey.replace(/^\/+/, "");
    return `${getPublicBaseUrl()}/${key}`;
  }

  async uploadFile(input: UploadFileInput): Promise<StoredFile> {
    const { mimeType, extension } = validateImageUpload(
      input.buffer,
      input.originalName,
      input.mimeType,
    );

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const randomId = randomBytes(16).toString("hex");
    const filename = `${randomId}${extension}`;
    const storageKey = `media/${year}/${month}/${filename}`;

    const root = getUploadsRoot();
    const absolutePath = path.join(root, storageKey);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.buffer);

    return {
      storageKey,
      publicUrl: this.getPublicUrl(storageKey),
      filename,
      sizeBytes: input.buffer.length,
      mimeType,
    };
  }

  async deleteFile(storageKey: string): Promise<void> {
    const root = getUploadsRoot();
    const absolutePath = path.join(root, storageKey);
    await unlink(absolutePath).catch(() => undefined);
  }
}
