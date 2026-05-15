import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/slug";

async function isSlugTaken(
  slug: string,
  model: "category" | "tag" | "post",
  excludeId?: string,
): Promise<boolean> {
  if (model === "category") {
    const row = await prisma.category.findUnique({ where: { slug } });
    return Boolean(row && row.id !== excludeId);
  }
  if (model === "tag") {
    const row = await prisma.tag.findUnique({ where: { slug } });
    return Boolean(row && row.id !== excludeId);
  }
  const row = await prisma.post.findUnique({ where: { slug } });
  return Boolean(row && row.id !== excludeId);
}

export async function ensureUniqueSlug(
  baseInput: string,
  model: "category" | "tag" | "post",
  excludeId?: string,
): Promise<string> {
  const baseSlug = slugify(baseInput);
  if (!baseSlug) {
    throw new Error("SLUG_EMPTY");
  }

  let candidate = baseSlug;
  let suffix = 2;

  while (await isSlugTaken(candidate, model, excludeId)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function resolveSlugFromForm(
  slugField: string | null | undefined,
  nameField: string,
): string {
  const trimmedSlug = slugField?.trim() ?? "";
  if (trimmedSlug) {
    const normalized = slugify(trimmedSlug);
    if (!normalized) {
      throw new Error("SLUG_EMPTY");
    }
    return normalized;
  }

  const fromName = slugify(nameField);
  if (!fromName) {
    throw new Error("SLUG_EMPTY");
  }
  return fromName;
}
