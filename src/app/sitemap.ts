import type { MetadataRoute } from "next";
import {
  getCategoriesForSitemap,
  getPostsForSitemap,
} from "@/lib/blog/seoQueries";
import { isIndexableEnvironment } from "@/lib/seo/deployEnvironment";
import { absoluteUrl } from "@/lib/seo/siteUrl";

/** Обновление sitemap при новых статьях без полного rebuild. */
export const revalidate = 3600;

const STATIC_PAGES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/cases", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contacts", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/consent", changeFrequency: "yearly", priority: 0.3 },
  { path: "/marketing-consent", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexableEnvironment()) {
    return [];
  }

  const [posts, categories] = await Promise.all([
    getPostsForSitemap(),
    getCategoriesForSitemap(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogCategories: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: absoluteUrl(`/blog/category/${cat.slug}`),
    lastModified: cat.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogCategories, ...blogPosts];
}
