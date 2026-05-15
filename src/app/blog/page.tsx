import type { Metadata } from "next";
import { PageHeading } from "@/components/PageHeading";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import { BlogCategoryNav } from "@/components/blog/BlogCategoryNav";
import { BlogList } from "@/components/blog/BlogList";
import {
  getActiveCategoriesWithCounts,
  getPublishedPosts,
} from "@/lib/blog/queries";
import { buildBlogIndexMetadata } from "@/lib/seo/blogMetadata";

export const metadata: Metadata = buildBlogIndexMetadata();

export default async function BlogIndexPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getActiveCategoriesWithCounts(),
  ]);

  return (
    <BlogPageShell>
      <PageHeading
        title="Блог CRM Flow24"
        subtitle="Практические материалы о внедрении Битрикс24, CRM, автоматизации продаж, интеграциях и управлении клиентской базой."
      />
      <BlogCategoryNav categories={categories} />
      <BlogList posts={posts} />
    </BlogPageShell>
  );
}
