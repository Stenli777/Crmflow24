import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/db/prisma";
import { getStorageProvider } from "@/lib/storage";
import {
  uploadErrorMessage,
  validateImageUpload,
} from "@/lib/storage/validation";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Файл не передан" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    validateImageUpload(buffer, file.name, file.type || "application/octet-stream");

    const stored = await getStorageProvider().uploadFile({
      buffer,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
    });

    const asset = await prisma.mediaAsset.create({
      data: {
        type: "IMAGE",
        filename: stored.filename,
        originalName: file.name,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        storageKey: stored.storageKey,
        publicUrl: stored.publicUrl,
      },
    });

    return NextResponse.json({
      id: asset.id,
      url: asset.publicUrl,
      alt: asset.alt ?? "",
    });
  } catch (e) {
    if (e instanceof Error) {
      const known = [
        "EMPTY_FILE",
        "FILE_TOO_LARGE",
        "INVALID_MIME",
        "INVALID_EXTENSION",
        "MIME_EXTENSION_MISMATCH",
      ];
      if (known.includes(e.message)) {
        return NextResponse.json(
          { error: uploadErrorMessage(e.message) },
          { status: 400 },
        );
      }
    }
    return NextResponse.json(
      { error: "Не удалось загрузить файл" },
      { status: 500 },
    );
  }
}
