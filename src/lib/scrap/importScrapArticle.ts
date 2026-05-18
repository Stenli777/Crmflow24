import { PostStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ensureUniqueSlug } from "@/lib/admin/slug-unique";
import { slugify } from "@/lib/slug";
import type { ArticleV2Payload, ScrapImportAck } from "./types";
import { mapArticleV2ToPostData } from "./mapArticleV2ToPost";
import { scrapSuccessAck } from "./response";

const PROVIDER = "scrap";

async function findOrCreateCategory(name: string): Promise<string> {
  const baseSlug = slugify(name);
  if (!baseSlug) {
    throw new Error("SLUG_EMPTY");
  }
  const slug = await ensureUniqueSlug(baseSlug, "category");

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return existing.id;
  }

  const created = await prisma.category.create({
    data: {
      name,
      slug,
      isActive: true,
    },
  });
  return created.id;
}

async function syncTags(postId: string, tagNames: string[]): Promise<void> {
  await prisma.postTag.deleteMany({ where: { postId } });
  if (tagNames.length === 0) return;

  const tagIds: string[] = [];
  for (const name of tagNames) {
    const baseSlug = slugify(name);
    if (!baseSlug) continue;
    const slug = await ensureUniqueSlug(baseSlug, "tag");

    const tag = await prisma.tag.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });
    tagIds.push(tag.id);
  }

  if (tagIds.length > 0) {
    await prisma.postTag.createMany({
      data: tagIds.map((tagId) => ({ postId, tagId })),
      skipDuplicates: true,
    });
  }
}

async function syncFaq(
  postId: string,
  faqItems: Array<{ question: string; answer: string; sortOrder: number }>,
): Promise<void> {
  await prisma.postFaqItem.deleteMany({ where: { postId } });
  if (faqItems.length === 0) return;

  await prisma.postFaqItem.createMany({
    data: faqItems.map((item) => ({
      postId,
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder,
    })),
  });
}

async function applyMappedToPost(
  postId: string,
  mapped: Awaited<ReturnType<typeof mapArticleV2ToPostData>>,
): Promise<void> {
  let categoryId: string | null = null;
  if (mapped.categoryName) {
    categoryId = await findOrCreateCategory(mapped.categoryName);
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: mapped.title,
      slug: mapped.slug,
      summary: mapped.summary,
      excerpt: mapped.excerpt,
      contentHtml: mapped.contentHtml,
      contentJson: Prisma.DbNull,
      status: PostStatus.DRAFT,
      publishedAt: null,
      categoryId,
      seoTitle: mapped.seoTitle,
      seoDescription: mapped.seoDescription,
      seoKeywords: mapped.seoKeywords,
      ogImageUrl: mapped.ogImageUrl,
      robotsDirective: mapped.robotsDirective,
    },
  });

  await syncTags(postId, mapped.tagNames);
  await syncFaq(postId, mapped.faqItems);
}

function editorialJson(
  payload: ArticleV2Payload,
): Prisma.InputJsonValue | undefined {
  if (!payload.editorial || Object.keys(payload.editorial).length === 0) {
    return undefined;
  }
  return payload.editorial as Prisma.InputJsonValue;
}

function remoteStatusForPost(status: PostStatus): string {
  if (status === PostStatus.PUBLISHED) {
    return "published";
  }
  if (status === PostStatus.ARCHIVED) {
    return "draft_locked";
  }
  return "draft";
}

/**
 * Импорт article_v2: create или update draft с идемпотентностью.
 */
export async function importScrapArticle(
  payload: ArticleV2Payload,
): Promise<ScrapImportAck> {
  const { documentId, revisionId } = payload.source;

  const existingImport = await prisma.scrapArticleImport.findUnique({
    where: {
      provider_documentId_revisionId: {
        provider: PROVIDER,
        documentId,
        revisionId,
      },
    },
    include: { post: true },
  });

  const lastPayload = payload.raw as Prisma.InputJsonValue;
  const editorial = editorialJson(payload);

  if (existingImport) {
    const { post } = existingImport;

    if (post.status !== PostStatus.DRAFT) {
      await prisma.scrapArticleImport.update({
        where: { id: existingImport.id },
        data: {
          lastPayload,
          remoteStatus: remoteStatusForPost(post.status),
        },
      });

      return scrapSuccessAck(
        documentId,
        revisionId,
        post.id,
        remoteStatusForPost(post.status),
      );
    }

    const mapped = await mapArticleV2ToPostData(payload, post.id);
    await applyMappedToPost(post.id, mapped);

    await prisma.scrapArticleImport.update({
      where: { id: existingImport.id },
      data: {
        sourceUrl: payload.source.sourceUrl ?? null,
        sourceDomain: payload.source.sourceDomain ?? null,
        scrapedAt: payload.source.scrapedAt ?? null,
        payloadVersion: payload.payloadVersion,
        remoteStatus: "draft",
        editorialJson: editorial,
        lastPayload,
      },
    });

    return scrapSuccessAck(documentId, revisionId, post.id, "draft");
  }

  try {
    return await createScrapDraftPost(payload, editorial, lastPayload);
  } catch (e) {
    if (isUniqueConstraintError(e)) {
      return importScrapArticle(payload);
    }
    throw e;
  }
}

function isUniqueConstraintError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: string }).code === "P2002"
  );
}

async function createScrapDraftPost(
  payload: ArticleV2Payload,
  editorial: Prisma.InputJsonValue | undefined,
  lastPayload: Prisma.InputJsonValue,
): Promise<ScrapImportAck> {
  const { documentId, revisionId } = payload.source;
  const mapped = await mapArticleV2ToPostData(payload);

  const post = await prisma.post.create({
    data: {
      title: mapped.title,
      slug: mapped.slug,
      summary: mapped.summary,
      excerpt: mapped.excerpt,
      contentHtml: mapped.contentHtml,
      contentJson: Prisma.DbNull,
      status: PostStatus.DRAFT,
      publishedAt: null,
      seoTitle: mapped.seoTitle,
      seoDescription: mapped.seoDescription,
      seoKeywords: mapped.seoKeywords,
      ogImageUrl: mapped.ogImageUrl,
      robotsDirective: mapped.robotsDirective,
      categoryId: mapped.categoryName
        ? await findOrCreateCategory(mapped.categoryName)
        : null,
    },
  });

  try {
    await syncTags(post.id, mapped.tagNames);
    await syncFaq(post.id, mapped.faqItems);

    await prisma.scrapArticleImport.create({
      data: {
        provider: PROVIDER,
        documentId,
        revisionId,
        sourceUrl: payload.source.sourceUrl ?? null,
        sourceDomain: payload.source.sourceDomain ?? null,
        scrapedAt: payload.source.scrapedAt ?? null,
        postId: post.id,
        payloadVersion: payload.payloadVersion,
        remoteStatus: "draft",
        editorialJson: editorial,
        lastPayload,
      },
    });
  } catch (e) {
    await prisma.post.delete({ where: { id: post.id } }).catch(() => undefined);
    throw e;
  }

  return scrapSuccessAck(documentId, revisionId, post.id, "draft");
}
