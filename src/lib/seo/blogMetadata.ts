import type { Metadata } from "next";
import type { RobotsDirective } from "@prisma/client";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";
import { robotsDirectiveToMetadata } from "@/lib/seo/robots";
import type { BlogPostArticle } from "@/lib/blog/queries";

type CategoryMetaSource = {
  name: string;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function buildBlogIndexMetadata(): Metadata {
  const title = "Блог о Битрикс24, CRM и автоматизации продаж";
  const description =
    "Практические статьи о внедрении Битрикс24, CRM, автоматизации продаж, интеграциях и работе с клиентской базой.";

  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    openGraph: {
      title: `${title} — CRM Flow24`,
      description,
      url: absoluteUrl("/blog"),
      type: "website",
    },
  };
}

export function buildBlogCategoryMetadata(
  category: CategoryMetaSource,
): Metadata {
  const title =
    category.seoTitle?.trim() || `${category.name} — блог`;
  const description =
    category.seoDescription?.trim() ||
    `Материалы по теме «${category.name}»: CRM, Битрикс24, автоматизация продаж и интеграции.`;
  const canonical = `/blog/category/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      type: "website",
    },
  };
}

function resolvePostOgImage(post: BlogPostArticle): string | undefined {
  const og = post.ogImageUrl?.trim();
  if (og) {
    return og.startsWith("http") ? og : absoluteUrl(og);
  }
  const cover = post.coverImage?.publicUrl;
  if (cover) {
    return cover.startsWith("http") ? cover : absoluteUrl(cover);
  }
  return undefined;
}

export function buildBlogPostMetadata(post: BlogPostArticle): Metadata {
  const title = post.seoTitle?.trim() || post.title;
  const description =
    post.seoDescription?.trim() ||
    post.summary?.trim() ||
    post.excerpt?.trim() ||
    "";
  const canonicalPath = post.canonicalUrl?.trim()
    ? post.canonicalUrl.trim()
    : `/blog/${post.slug}`;
  const canonical =
    canonicalPath.startsWith("http")
      ? canonicalPath
      : absoluteUrl(canonicalPath);

  const ogTitle = post.ogTitle?.trim() || title;
  const ogDescription =
    post.ogDescription?.trim() || description || undefined;
  const ogImage = resolvePostOgImage(post);

  return {
    title,
    description: description || undefined,
    alternates: { canonical },
    robots: robotsDirectiveToMetadata(post.robotsDirective as RobotsDirective),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    metadataBase: new URL(getSiteUrl()),
  };
}
