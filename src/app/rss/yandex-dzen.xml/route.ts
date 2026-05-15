import { getPostsForRss } from "@/lib/blog/seoQueries";
import { buildRssFeed } from "@/lib/rss/buildFeed";
import { absoluteUrl } from "@/lib/seo/siteUrl";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getPostsForRss();
  const xml = buildRssFeed(
    {
      title: "CRM Flow24 — Дзен",
      link: absoluteUrl("/blog"),
      description:
        "Публикации CRM Flow24 для Яндекс Дзена: Битрикс24, CRM и автоматизация продаж.",
    },
    posts,
  );

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
