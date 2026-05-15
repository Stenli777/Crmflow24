"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ensureUniqueSlug, resolveSlugFromForm } from "@/lib/admin/slug-unique";
import type { AdminFormState } from "@/lib/admin/types";
import { formError } from "@/lib/admin/types";

function parseSortOrder(value: FormDataEntryValue | null): number {
  const n = Number(String(value ?? "0"));
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

export async function createCategoryAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return formError("Название обязательно");
  }

  try {
    const baseSlug = resolveSlugFromForm(
      String(formData.get("slug") ?? ""),
      name,
    );
    const slug = await ensureUniqueSlug(baseSlug, "category");

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: String(formData.get("description") ?? "").trim() || null,
        seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
        seoDescription:
          String(formData.get("seoDescription") ?? "").trim() || null,
        sortOrder: parseSortOrder(formData.get("sortOrder")),
        isActive: formData.get("isActive") === "on",
      },
    });

    revalidatePath("/admin/categories");
    redirect(`/admin/categories/${category.id}`);
  } catch (e) {
    if (e instanceof Error && e.message === "SLUG_EMPTY") {
      return formError("Укажите название или slug");
    }
    if (e instanceof Error && e.message === "NEXT_REDIRECT") {
      throw e;
    }
    return formError("Slug уже используется");
  }
}

export async function updateCategoryAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) {
    return formError("Название обязательно");
  }

  try {
    const baseSlug = resolveSlugFromForm(
      String(formData.get("slug") ?? ""),
      name,
    );
    const slug = await ensureUniqueSlug(baseSlug, "category", id);

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: String(formData.get("description") ?? "").trim() || null,
        seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
        seoDescription:
          String(formData.get("seoDescription") ?? "").trim() || null,
        sortOrder: parseSortOrder(formData.get("sortOrder")),
        isActive: formData.get("isActive") === "on",
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    return { success: "Категория сохранена" };
  } catch (e) {
    if (e instanceof Error && e.message === "SLUG_EMPTY") {
      return formError("Укажите название или slug");
    }
    return formError("Slug уже используется");
  }
}

export async function deleteCategoryAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return formError("Категория не найдена");
  }

  const postsCount = await prisma.post.count({ where: { categoryId: id } });
  if (postsCount > 0) {
    return formError("Нельзя удалить категорию, к которой привязаны статьи");
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
