import { absoluteUrl } from "@/lib/seo/siteUrl";
import { siteConfig } from "@/config/site";

type LlmsPost = {
  title: string;
  slug: string;
  summary: string | null;
  excerpt: string | null;
  publishedAt: Date | null;
};

const STATIC_PAGES: { label: string; path: string }[] = [
  { label: "Главная", path: "/" },
  { label: "Услуги", path: "/services" },
  { label: "Кейсы", path: "/cases" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
  { label: "Блог", path: "/blog" },
  { label: "Политика обработки персональных данных", path: "/privacy" },
  { label: "Политика cookie", path: "/cookies" },
  { label: "Согласие на обработку ПДн", path: "/consent" },
  { label: "Согласие на рекламные рассылки", path: "/marketing-consent" },
  { label: "Пользовательское соглашение", path: "/terms" },
];

function postLead(post: LlmsPost): string {
  return post.summary?.trim() || post.excerpt?.trim() || "";
}

export function buildLlmsTxt(posts: LlmsPost[]): string {
  const lines: string[] = [
    `# ${siteConfig.brandName}`,
    "",
    `${siteConfig.brandName} — независимая компания, которая помогает внедрять и настраивать Битрикс24 для продаж, коммуникаций, автоматизации и интеграций.`,
    "",
    "## Основные страницы",
    "",
  ];

  for (const page of STATIC_PAGES) {
    lines.push(`- ${page.label}: ${absoluteUrl(page.path)}`);
  }

  lines.push("", "## Блог", "");
  if (posts.length === 0) {
    lines.push("Пока нет опубликованных статей.");
  } else {
    for (const post of posts) {
      lines.push(`- ${post.title}: ${absoluteUrl(`/blog/${post.slug}`)}`);
    }
  }

  lines.push(
    "",
    "## RSS",
    "",
    `- Общая RSS-лента: ${absoluteUrl("/rss.xml")}`,
    `- RSS для Дзена: ${absoluteUrl("/rss/yandex-dzen.xml")}`,
    "",
    "## Ограничения",
    "",
    "Админка и API закрыты для индексации и не предназначены для чтения.",
    "",
  );

  return lines.join("\n");
}

export function buildLlmsFullTxt(posts: LlmsPost[]): string {
  const lines: string[] = [
    `# ${siteConfig.brandName}`,
    "",
    `${siteConfig.brandName} — независимая компания, которая помогает внедрять и настраивать Битрикс24 для продаж, коммуникаций, автоматизации и интеграций.`,
    "",
    "## Основные страницы",
    "",
  ];

  for (const page of STATIC_PAGES) {
    lines.push(`- ${page.label}: ${absoluteUrl(page.path)}`);
  }

  lines.push("", "## Статьи блога (краткие описания)", "");

  if (posts.length === 0) {
    lines.push("Пока нет опубликованных статей.");
  } else {
    for (const post of posts) {
      const lead = postLead(post);
      const date = post.publishedAt
        ? post.publishedAt.toISOString().slice(0, 10)
        : "";
      lines.push(`### ${post.title}`, "");
      lines.push(`- URL: ${absoluteUrl(`/blog/${post.slug}`)}`);
      if (date) lines.push(`- Дата: ${date}`);
      if (lead) lines.push(`- Кратко: ${lead}`);
      lines.push("");
    }
  }

  lines.push(
    "## RSS",
    "",
    `- Общая RSS-лента: ${absoluteUrl("/rss.xml")}`,
    `- RSS для Дзена: ${absoluteUrl("/rss/yandex-dzen.xml")}`,
    "",
    "## Ограничения",
    "",
    "Админка и API закрыты для индексации и не предназначены для чтения.",
    "",
  );

  return lines.join("\n");
}
