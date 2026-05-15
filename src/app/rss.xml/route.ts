import { getPostsForRss } from "@/lib/blog/seoQueries";
import { buildRssFeed } from "@/lib/rss/buildFeed";
import { absoluteUrl } from "@/lib/seo/siteUrl";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getPostsForRss();
  const xml = buildRssFeed(
    {
      title: "CRM Flow24 — блог",
      link: absoluteUrl("/blog"),
      description:
        "Практические статьи о Битрикс24, CRM, автоматизации продаж и интеграциях.",
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
