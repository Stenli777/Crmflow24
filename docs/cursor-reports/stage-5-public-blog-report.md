# Cursor Report — Этап 5: публичный блог

## Контекст до этапа

- Этапы 1–4: PostgreSQL, auth, admin CRUD, TipTap, media uploads.
- Публичного вывода статей не было.

## Решения этапа 5

1. **Read-only queries** — `src/lib/blog/queries.ts`, без server actions на публичных страницах.
2. **Published filter** — единый `publishedWhere` (PUBLISHED + `publishedAt`).
3. **HTML** — только `BlogArticleContent` + комментарий о sanitize.
4. **Related posts fallback** — если связей нет, 3 последние published (документировано).
5. **SEO** — helpers в `src/lib/seo/`, canonical/OG/robots из полей CMS.
6. **Seed** — upsert тестовой статьи `/blog/testovaya-statya-dlya-publichnogo-bloga`.

## Routes

| URL | Файл |
|-----|------|
| `/blog` | `src/app/blog/page.tsx` |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` |
| `/blog/category/[slug]` | `src/app/blog/category/[slug]/page.tsx` |

## Компоненты

`src/components/blog/`: BlogCard, BlogList, BlogCategoryNav, BlogBreadcrumbs, BlogArticleContent, BlogArticleHeader, BlogArticleCta, BlogFaq, BlogRelatedPosts, BlogRelatedServices, BlogJsonLd, BlogPageShell.

## Draft/archived

Не попадают в выборки. Прямой URL draft/archived slug → `notFound()`.

## Metadata / JSON-LD

- `buildBlogIndexMetadata`, `buildBlogCategoryMetadata`, `buildBlogPostMetadata`.
- `robotsDirectiveToMetadata` — маппинг enum → Next Metadata robots.
- `BlogJsonLd` — schema.org BlogPosting/Article.

## Bundle safety

Grep по `src/app/blog` и `src/components/blog`: нет импортов `@tiptap/*`, `TiptapEditor`, `src/lib/admin/*` actions.

## Риски

- Cover/inline images с `/uploads` — нужны файлы на диске в prod.
- `metadataBase` на статье зависит от `NEXT_PUBLIC_SITE_URL`.
- Fallback related posts может показывать нерелевантные материалы.

## Проверено автоматически

- `npm run lint` — OK
- `npm run build` — OK (blog routes в сборке)
- `npm run db:seed` — тестовая статья `/blog/testovaya-statya-dlya-publichnogo-bloga`
- Smoke (`scripts/_stage5-smoke.mjs`, `next start` :3002): `/blog`, category, article → 200; draft → 404; JSON-LD/OG/canonical в HTML
- `db:generate` — EPERM на Windows (engine занят dev server); build и seed прошли

## Исправление при проверке

RSC: `component={Link}` в MUI Chip/Button из server components давал 500. Заменено на обёртку `<Link><Chip /></Link>`.

## Не проверено

- Визуальный прогон в Chrome (рекомендуется)
- archived 404 — нет archived-статьи в БД (skip)

## Следующие шаги

Этап 6: RSS, sitemap для постов, FAQPage JSON-LD, ссылка «Блог» в шапке (по согласованию).
