import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/PageHeading";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import { BlogBreadcrumbs } from "@/components/blog/BlogBreadcrumbs";
import { BlogCategoryNav } from "@/components/blog/BlogCategoryNav";
import { BlogList } from "@/components/blog/BlogList";
import {
  getActiveCategoriesWithCounts,
  getPublishedPostsByCategorySlug,
} from "@/lib/blog/queries";
import { buildBlogCategoryMetadata } from "@/lib/seo/blogMetadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedPostsByCategorySlug(slug);
  if (!data) {
    return { title: "Категория не найдена" };
  }
  return buildBlogCategoryMetadata(data.category);
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, categories] = await Promise.all([
    getPublishedPostsByCategorySlug(slug),
    getActiveCategoriesWithCounts(),
  ]);

  if (!data) {
    notFound();
  }

  const { category, posts } = data;
  const emptyMessage = `В категории «${category.name}» пока нет опубликованных статей.`;

  return (
    <BlogPageShell>
      <BlogBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Блог", href: "/blog" },
          { label: category.name },
        ]}
      />
      <PageHeading
        title={category.name}
        subtitle={
          category.description?.trim() ||
          `Материалы по теме «${category.name}»: CRM, Битрикс24 и автоматизация продаж.`
        }
      />
      <BlogCategoryNav categories={categories} activeSlug={category.slug} />
      <BlogList posts={posts} emptyMessage={emptyMessage} />
    </BlogPageShell>
  );
}
