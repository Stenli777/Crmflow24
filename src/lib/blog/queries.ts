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

const postCardSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  excerpt: true,
  publishedAt: true,
  category: {
    select: { id: true, name: true, slug: true },
  },
  tags: {
    select: {
      tag: { select: { id: true, name: true, slug: true } },
    },
  },
  coverImage: {
    select: { publicUrl: true, alt: true },
  },
} satisfies Prisma.PostSelect;

export type BlogPostCard = Prisma.PostGetPayload<{ select: typeof postCardSelect }>;

const postArticleSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  excerpt: true,
  contentHtml: true,
  publishedAt: true,
  updatedAt: true,
  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  canonicalUrl: true,
  robotsDirective: true,
  ogTitle: true,
  ogDescription: true,
  ogImageUrl: true,
  schemaType: true,
  ctaTitle: true,
  ctaText: true,
  ctaButtonLabel: true,
  ctaButtonHref: true,
  category: {
    select: { id: true, name: true, slug: true },
  },
  tags: {
    select: {
      tag: { select: { id: true, name: true, slug: true } },
    },
  },
  coverImage: {
    select: { publicUrl: true, alt: true },
  },
  faqItems: {
    orderBy: { sortOrder: "asc" as const },
    select: { id: true, question: true, answer: true, sortOrder: true },
  },
  relatedServices: {
    orderBy: { sortOrder: "asc" as const },
    select: { id: true, title: true, href: true, sortOrder: true },
  },
} satisfies Prisma.PostSelect;

export type BlogPostArticle = Prisma.PostGetPayload<{
  select: typeof postArticleSelect;
}>;

export async function getPublishedPosts(): Promise<BlogPostCard[]> {
  return prisma.post.findMany({
    where: publishedWhere,
    select: postCardSelect,
    orderBy: publishedOrderBy,
  });
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<BlogPostArticle | null> {
  return prisma.post.findFirst({
    where: { ...publishedWhere, slug },
    select: postArticleSelect,
  });
}

export async function getActiveCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      seoTitle: true,
      seoDescription: true,
    },
  });
}

export async function getPublishedPostsByCategorySlug(
  categorySlug: string,
): Promise<{ category: NonNullable<Awaited<ReturnType<typeof getActiveCategoryBySlug>>>; posts: BlogPostCard[] } | null> {
  const category = await getActiveCategoryBySlug(categorySlug);
  if (!category) {
    return null;
  }

  const posts = await prisma.post.findMany({
    where: {
      ...publishedWhere,
      categoryId: category.id,
    },
    select: postCardSelect,
    orderBy: publishedOrderBy,
  });

  return { category, posts };
}

export async function getActiveCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: {
        select: {
          posts: { where: publishedWhere },
        },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    postCount: c._count.posts,
  }));
}

export async function getRelatedPostsForPost(
  postId: string,
): Promise<BlogPostCard[]> {
  const relations = await prisma.postRelation.findMany({
    where: {
      fromPostId: postId,
      toPost: publishedWhere,
    },
    orderBy: { sortOrder: "asc" },
    select: {
      toPost: { select: postCardSelect },
    },
  });

  const related = relations.map((r) => r.toPost);
  if (related.length > 0) {
    return related;
  }

  return prisma.post.findMany({
    where: {
      ...publishedWhere,
      id: { not: postId },
    },
    select: postCardSelect,
    orderBy: publishedOrderBy,
    take: 3,
  });
}
