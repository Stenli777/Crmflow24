import { PostStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const publishedWhere: Prisma.PostWhereInput = {
  status: PostStatus.PUBLISHED,
  publishedAt: { not: null },
};

const publishedOrderBy: Prisma.PostOrderByWithRelationInput[] = [
  { publishedAt: "desc" },
  { createdAt: "desc" },
];

const RSS_LLMS_LIMIT = 50;

const rssPostSelect = {
  title: true,
  slug: true,
  summary: true,
  excerpt: true,
  contentHtml: true,
  publishedAt: true,
  updatedAt: true,
  seoDescription: true,
  ogImageUrl: true,
  coverImage: {
    select: { publicUrl: true, mimeType: true },
  },
  category: {
    select: { name: true },
  },
  author: {
    select: { name: true, email: true },
  },
} satisfies Prisma.PostSelect;

export type RssPost = Prisma.PostGetPayload<{ select: typeof rssPostSelect }>;

export async function getPostsForSitemap() {
  return prisma.post.findMany({
    where: publishedWhere,
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: publishedOrderBy,
  });
}

export async function getCategoriesForSitemap() {
  return prisma.category.findMany({
    where: {
      isActive: true,
      posts: { some: publishedWhere },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getPostsForRss(): Promise<RssPost[]> {
  return prisma.post.findMany({
    where: publishedWhere,
    select: rssPostSelect,
    orderBy: publishedOrderBy,
    take: RSS_LLMS_LIMIT,
  });
}

export async function getPostsForLlms() {
  return prisma.post.findMany({
    where: publishedWhere,
    select: {
      title: true,
      slug: true,
      summary: true,
      excerpt: true,
      publishedAt: true,
    },
    orderBy: publishedOrderBy,
    take: RSS_LLMS_LIMIT,
  });
}
