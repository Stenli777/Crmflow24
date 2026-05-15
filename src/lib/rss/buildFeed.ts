import { absoluteUrl } from "@/lib/seo/siteUrl";
import { siteConfig } from "@/config/site";
import { cdata, escapeXml } from "@/lib/rss/xml";
import type { RssPost } from "@/lib/blog/seoQueries";

export type RssChannelConfig = {
  title: string;
  link: string;
  description: string;
};

function resolveImageUrl(post: RssPost): string | undefined {
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

function resolveDescription(post: RssPost): string {
  return (
    post.seoDescription?.trim() ||
    post.summary?.trim() ||
    post.excerpt?.trim() ||
    post.title
  );
}

function resolveAuthor(post: RssPost): string {
  if (post.author?.name?.trim()) return post.author.name.trim();
  if (post.author?.email?.trim()) return post.author.email.trim();
  return siteConfig.brandName;
}

function buildItemXml(post: RssPost): string {
  const link = absoluteUrl(`/blog/${post.slug}`);
  const pubDate = post.publishedAt
    ? new Date(post.publishedAt).toUTCString()
    : new Date().toUTCString();
  const description = escapeXml(resolveDescription(post));
  const author = escapeXml(resolveAuthor(post));
  const category = post.category?.name
    ? `<category>${escapeXml(post.category.name)}</category>`
    : "";
  const imageUrl = resolveImageUrl(post);
  const enclosure =
    imageUrl && post.coverImage?.mimeType
      ? `<enclosure url="${escapeXml(imageUrl)}" type="${escapeXml(post.coverImage.mimeType)}" />`
      : imageUrl
        ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" />`
        : "";
  const contentEncoded = post.contentHtml?.trim()
    ? `<content:encoded>${cdata(post.contentHtml)}</content:encoded>`
    : "";

  return `<item>
<title>${escapeXml(post.title)}</title>
<link>${escapeXml(link)}</link>
<guid isPermaLink="true">${escapeXml(link)}</guid>
<description>${description}</description>
<pubDate>${escapeXml(pubDate)}</pubDate>
<author>${author}</author>
${category}
${enclosure}
${contentEncoded}
</item>`;
}

export function buildRssFeed(
  channel: RssChannelConfig,
  posts: RssPost[],
): string {
  const items = posts.map(buildItemXml).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${escapeXml(channel.title)}</title>
<link>${escapeXml(channel.link)}</link>
<description>${escapeXml(channel.description)}</description>
<language>ru-RU</language>
<lastBuildDate>${escapeXml(new Date().toUTCString())}</lastBuildDate>
${items}
</channel>
</rss>`;
}
