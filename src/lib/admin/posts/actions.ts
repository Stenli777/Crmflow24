"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ensureUniqueSlug, resolveSlugFromForm } from "@/lib/admin/slug-unique";
import type { AdminFormState } from "@/lib/admin/types";
import { formError } from "@/lib/admin/types";
import {
  parseFaqItems,
  parseOptionalDate,
  parsePostStatus,
  parseRelatedPostIds,
  parseRelatedServices,
  parseRobots,
  parseTagIds,
  resolvePublishedAt,
} from "./parse";
import { parsePostContent } from "./sanitize";

function postTextFields(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const { contentJson, contentHtml } = parsePostContent(formData);
  return {
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim() || null,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    contentJson,
    contentHtml,
    status: parsePostStatus(formData.get("status")),
    categoryId,
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
    seoKeywords: String(formData.get("seoKeywords") ?? "").trim() || null,
    canonicalUrl: String(formData.get("canonicalUrl") ?? "").trim() || null,
    robotsDirective: parseRobots(formData.get("robotsDirective")),
    ogTitle: String(formData.get("ogTitle") ?? "").trim() || null,
    ogDescription: String(formData.get("ogDescription") ?? "").trim() || null,
    ogImageUrl: String(formData.get("ogImageUrl") ?? "").trim() || null,
    schemaType: String(formData.get("schemaType") ?? "BlogPosting").trim(),
    ctaTitle: String(formData.get("ctaTitle") ?? "").trim() || null,
    ctaText: String(formData.get("ctaText") ?? "").trim() || null,
    ctaButtonLabel: String(formData.get("ctaButtonLabel") ?? "").trim() || null,
    ctaButtonHref: String(formData.get("ctaButtonHref") ?? "").trim() || null,
    vkText: String(formData.get("vkText") ?? "").trim() || null,
    publishedAtInput: parseOptionalDate(formData.get("publishedAt")),
  };
}

async function syncPostRelations(
  postId: string,
  tagIds: string[],
  relatedPostIds: string[],
  faqItems: ReturnType<typeof parseFaqItems>,
  services: ReturnType<typeof parseRelatedServices>,
) {
  await prisma.postTag.deleteMany({ where: { postId } });
  if (tagIds.length > 0) {
    await prisma.postTag.createMany({
      data: tagIds.map((tagId) => ({ postId, tagId })),
    });
  }

  await prisma.postFaqItem.deleteMany({ where: { postId } });
  if (faqItems.length > 0) {
    await prisma.postFaqItem.createMany({
      data: faqItems.map((item) => ({ postId, ...item })),
    });
  }

  await prisma.postServiceRelation.deleteMany({ where: { postId } });
  if (services.length > 0) {
    await prisma.postServiceRelation.createMany({
      data: services.map((item) => ({ postId, ...item })),
    });
  }

  await prisma.postRelation.deleteMany({ where: { fromPostId: postId } });
  const uniqueRelated = [...new Set(relatedPostIds.filter((id) => id !== postId))];
  if (uniqueRelated.length > 0) {
    await prisma.postRelation.createMany({
      data: uniqueRelated.map((toPostId, index) => ({
        fromPostId: postId,
        toPostId,
        sortOrder: index,
      })),
    });
  }
}

export async function createPostAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await requireAdmin();

  try {
    const fields = postTextFields(formData);

    if (!fields.title) {
      return formError("Название обязательно");
    }
    const baseSlug = resolveSlugFromForm(
      String(formData.get("slug") ?? ""),
      fields.title,
    );
    const slug = await ensureUniqueSlug(baseSlug, "post");
    const tagIds = parseTagIds(formData);
    const relatedPostIds = parseRelatedPostIds(formData);
    const faqItems = parseFaqItems(formData);
    const services = parseRelatedServices(formData);

    const publishedAt = resolvePublishedAt(
      fields.status,
      fields.publishedAtInput,
      null,
    );

    const post = await prisma.post.create({
      data: {
        title: fields.title,
        slug,
        summary: fields.summary,
        excerpt: fields.excerpt,
        contentJson:
          fields.contentJson === null ? Prisma.DbNull : fields.contentJson,
        contentHtml: fields.contentHtml,
        status: fields.status,
        publishedAt,
        authorId: admin.id,
        categoryId: fields.categoryId,
        seoTitle: fields.seoTitle,
        seoDescription: fields.seoDescription,
        seoKeywords: fields.seoKeywords,
        canonicalUrl: fields.canonicalUrl,
        robotsDirective: fields.robotsDirective,
        ogTitle: fields.ogTitle,
        ogDescription: fields.ogDescription,
        ogImageUrl: fields.ogImageUrl,
        schemaType: fields.schemaType || "BlogPosting",
        ctaTitle: fields.ctaTitle,
        ctaText: fields.ctaText,
        ctaButtonLabel: fields.ctaButtonLabel,
        ctaButtonHref: fields.ctaButtonHref,
        vkText: fields.vkText,
      },
    });

    await syncPostRelations(
      post.id,
      tagIds,
      relatedPostIds,
      faqItems,
      services,
    );

    revalidatePath("/admin/posts");
    redirect(`/admin/posts/${post.id}`);
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    if (e instanceof Error && e.message === "INVALID_CONTENT_JSON") {
      return formError("Некорректный контент редактора");
    }
    if (e instanceof Error && e.message === "SLUG_EMPTY") {
      return formError("Укажите заголовок или slug");
    }
    if (e instanceof Error && e.message === "FAQ_INCOMPLETE") {
      return formError("Заполните вопрос и ответ для каждого блока FAQ");
    }
    if (e instanceof Error && e.message === "SERVICE_INCOMPLETE") {
      return formError("Заполните все поля связанной услуги");
    }
    return formError("Slug уже используется");
  }
}

export async function updatePostAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  try {
    const fields = postTextFields(formData);

    if (!id || !fields.title) {
      return formError("Название обязательно");
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return formError("Статья не найдена");
    }
    const baseSlug = resolveSlugFromForm(
      String(formData.get("slug") ?? ""),
      fields.title,
    );
    const slug = await ensureUniqueSlug(baseSlug, "post", id);
    const tagIds = parseTagIds(formData);
    const relatedPostIds = parseRelatedPostIds(formData);
    const faqItems = parseFaqItems(formData);
    const services = parseRelatedServices(formData);

    const publishedAt = resolvePublishedAt(
      fields.status,
      fields.publishedAtInput,
      existing.publishedAt,
    );

    await prisma.post.update({
      where: { id },
      data: {
        title: fields.title,
        slug,
        summary: fields.summary,
        excerpt: fields.excerpt,
        contentJson:
          fields.contentJson === null ? Prisma.DbNull : fields.contentJson,
        contentHtml: fields.contentHtml,
        status: fields.status,
        publishedAt,
        categoryId: fields.categoryId,
        seoTitle: fields.seoTitle,
        seoDescription: fields.seoDescription,
        seoKeywords: fields.seoKeywords,
        canonicalUrl: fields.canonicalUrl,
        robotsDirective: fields.robotsDirective,
        ogTitle: fields.ogTitle,
        ogDescription: fields.ogDescription,
        ogImageUrl: fields.ogImageUrl,
        schemaType: fields.schemaType || "BlogPosting",
        ctaTitle: fields.ctaTitle,
        ctaText: fields.ctaText,
        ctaButtonLabel: fields.ctaButtonLabel,
        ctaButtonHref: fields.ctaButtonHref,
        vkText: fields.vkText,
      },
    });

    await syncPostRelations(
      id,
      tagIds,
      relatedPostIds,
      faqItems,
      services,
    );

    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${id}`);
    return { success: "Статья сохранена" };
  } catch (e) {
    if (e instanceof Error && e.message === "INVALID_CONTENT_JSON") {
      return formError("Некорректный контент редактора");
    }
    if (e instanceof Error && e.message === "SLUG_EMPTY") {
      return formError("Укажите заголовок или slug");
    }
    if (e instanceof Error && e.message === "FAQ_INCOMPLETE") {
      return formError("Заполните вопрос и ответ для каждого блока FAQ");
    }
    if (e instanceof Error && e.message === "SERVICE_INCOMPLETE") {
      return formError("Заполните все поля связанной услуги");
    }
    return formError("Slug уже используется");
  }
}

export async function deletePostAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return formError("Статья не найдена");
  }

  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
