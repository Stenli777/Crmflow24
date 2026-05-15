import { jsonLdScriptContent } from "@/lib/jsonLd";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { siteConfig } from "@/config/site";
import type { BlogPostArticle } from "@/lib/blog/queries";

type BlogJsonLdProps = {
  post: BlogPostArticle;
};

function buildBlogPostingJsonLd(post: BlogPostArticle): Record<string, unknown> {
  const description =
    post.seoDescription?.trim() ||
    post.summary?.trim() ||
    post.excerpt?.trim() ||
    undefined;

  const imageUrl = (() => {
    const og = post.ogImageUrl?.trim();
    if (og) return og.startsWith("http") ? og : absoluteUrl(og);
    const cover = post.coverImage?.publicUrl;
    if (cover) return cover.startsWith("http") ? cover : absoluteUrl(cover);
    return undefined;
  })();

  const keywords = [
    ...(post.seoKeywords?.split(",").map((k) => k.trim()).filter(Boolean) ?? []),
    ...post.tags.map(({ tag }) => tag.name),
  ];

  const schemaType =
    post.schemaType === "Article" ? "Article" : "BlogPosting";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: siteConfig.brandName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };

  if (description) data.description = description;
  if (imageUrl) data.image = [imageUrl];
  if (post.category) data.articleSection = post.category.name;
  if (keywords.length > 0) data.keywords = keywords.join(", ");

  return data;
}

export function BlogJsonLd({ post }: BlogJsonLdProps) {
  const data = buildBlogPostingJsonLd(post);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  );
}
