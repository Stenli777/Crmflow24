import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Divider } from "@mui/material";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import { BlogBreadcrumbs } from "@/components/blog/BlogBreadcrumbs";
import { BlogArticleHeader } from "@/components/blog/BlogArticleHeader";
import { BlogArticleContent } from "@/components/blog/BlogArticleContent";
import { BlogArticleCta } from "@/components/blog/BlogArticleCta";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { BlogRelatedServices } from "@/components/blog/BlogRelatedServices";
import { BlogRelatedPosts } from "@/components/blog/BlogRelatedPosts";
import { BlogJsonLd } from "@/components/blog/BlogJsonLd";
import {
  getPublishedPostBySlug,
  getRelatedPostsForPost,
} from "@/lib/blog/queries";
import { buildBlogPostMetadata } from "@/lib/seo/blogMetadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return { title: "Статья не найдена" };
  }
  return buildBlogPostMetadata(post);
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPostsForPost(post.id);

  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Блог", href: "/blog" },
    ...(post.category
      ? [
          {
            label: post.category.name,
            href: `/blog/category/${post.category.slug}`,
          },
        ]
      : []),
    { label: post.title },
  ];

  return (
    <BlogPageShell>
      <BlogJsonLd post={post} />
      <BlogBreadcrumbs items={breadcrumbItems} />
      <BlogArticleHeader post={post} />
      <BlogArticleCta
        title={post.ctaTitle}
        text={post.ctaText}
        buttonLabel={post.ctaButtonLabel}
        buttonHref={post.ctaButtonHref}
      />
      <BlogArticleContent html={post.contentHtml} />
      <Divider sx={{ my: 4 }} />
      <BlogFaq items={post.faqItems} />
      <BlogRelatedServices services={post.relatedServices} />
      <BlogRelatedPosts posts={relatedPosts} />
      <BlogArticleCta
        title={post.ctaTitle}
        text={post.ctaText}
        buttonLabel={post.ctaButtonLabel}
        buttonHref={post.ctaButtonHref}
      />
    </BlogPageShell>
  );
}
