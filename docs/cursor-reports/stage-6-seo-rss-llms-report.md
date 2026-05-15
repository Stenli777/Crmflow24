# Cursor Report — Этап 6: RSS, sitemap, robots, llms

## Контекст до этапа

- Этапы 1–5: CMS, auth, CRUD, TipTap, публичный блог, metadata, BlogPosting JSON-LD.
- Было: базовый `sitemap.ts` (без блога), `robots.ts` (без Disallow admin/api), Organization JSON-LD в layout.

## Решения

1. **seoQueries.ts** — отдельный файл от UI `queries.ts`.
2. **RSS** — общий `buildRssFeed` + `xml.ts` (escapeXml, cdata).
3. **Sitemap** — async, Prisma для постов/категорий; `absoluteUrl`.
4. **FAQPage** — отдельный `BlogFaqJsonLd`, не смешивать с BlogPosting.
5. **WebSite** — добавлен в существующий `SiteJsonLd`, Organization не дублировался.
6. **llms-full.txt** — краткие summary статей, без полного HTML.

## Routes

| URL | Файл |
|-----|------|
| `/rss.xml` | `src/app/rss.xml/route.ts` |
| `/rss/yandex-dzen.xml` | `src/app/rss/yandex-dzen.xml/route.ts` |
| `/llms.txt` | `src/app/llms.txt/route.ts` |
| `/llms-full.txt` | `src/app/llms-full.txt/route.ts` |
| `/sitemap.xml` | `src/app/sitemap.ts` (обновлён) |
| `/robots.txt` | `src/app/robots.ts` (обновлён) |

## Фильтрация published

`status: PUBLISHED`, `publishedAt: not null` — во всех seoQueries.

## Защита admin/API

- robots: `Disallow: /admin`, `/api`
- sitemap: только публичные пути
- llms: текстовое предупреждение, без admin URL

## Bundle safety

Grep: RSS/sitemap/llms/seoQueries — нет `@tiptap`, нет `lib/admin` actions.

## SEO-инфраструктура до этапа

| Артефакт | Было |
|----------|------|
| `sitemap.ts` | Статика без `/blog` |
| `robots.ts` | Allow `/`, без Disallow admin/api |
| JSON-LD | Organization + Breadcrumb в `SiteJsonLd` |
| Header | Без «Блог» |

## Проверено автоматически

- `npm run lint` / `npm run build` — OK
- `db:generate` — EPERM (Windows, engine занят)
- Smoke (`next start` :3004): RSS, Dzen RSS, sitemap, robots, llms, llms-full, FAQPage JSON-LD, «Блог» в HTML
- Grep: нет TipTap/admin в seo/rss/llms routes

## Риски

- RSS `content:encoded` — HTML уже санитизирован при сохранении.
- Sitemap `lastModified` статики — `new Date()` при генерации.
- `/uploads` на production — файлы должны быть на диске.

## Следующие шаги

Deploy, backup uploads, VK API (отдельный этап).
