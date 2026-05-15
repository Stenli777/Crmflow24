"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ensureUniqueSlug, resolveSlugFromForm } from "@/lib/admin/slug-unique";
import type { AdminFormState } from "@/lib/admin/types";
import { formError } from "@/lib/admin/types";

export async function createTagAction(
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
    const slug = await ensureUniqueSlug(baseSlug, "tag");

    const tag = await prisma.tag.create({ data: { name, slug } });

    revalidatePath("/admin/tags");
    redirect(`/admin/tags/${tag.id}`);
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

export async function updateTagAction(
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
    const slug = await ensureUniqueSlug(baseSlug, "tag", id);

    await prisma.tag.update({ where: { id }, data: { name, slug } });

    revalidatePath("/admin/tags");
    revalidatePath(`/admin/tags/${id}`);
    return { success: "Тег сохранён" };
  } catch (e) {
    if (e instanceof Error && e.message === "SLUG_EMPTY") {
      return formError("Укажите название или slug");
    }
    return formError("Slug уже используется");
  }
}

export async function deleteTagAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return formError("Тег не найден");
  }

  const postsCount = await prisma.postTag.count({ where: { tagId: id } });
  if (postsCount > 0) {
    return formError("Нельзя удалить тег, который используется в статьях");
  }

  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}
