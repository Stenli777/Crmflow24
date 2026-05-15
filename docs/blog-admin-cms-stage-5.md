# Blog CMS — Этап 5: публичный блог

## Что добавлено

- Публичные маршруты `/blog`, `/blog/[slug]`, `/blog/category/[slug]`.
- Слой чтения `src/lib/blog/queries.ts` (только published).
- Компоненты `src/components/blog/*`.
- SEO helpers: `src/lib/seo/siteUrl.ts`, `src/lib/seo/robots.ts`, `src/lib/seo/blogMetadata.ts`.
- JSON-LD `BlogPosting` / `Article` для статей.
- Seed: тестовая опубликованная статья для smoke test.

## Published-статьи

Условие в Prisma:

- `status: PUBLISHED`
- `publishedAt: not null`

Draft и Archived не отдаются; неизвестный slug → `notFound()` (404).

## Рендер contentHtml

Компонент `BlogArticleContent` — единственное место с `dangerouslySetInnerHTML`. HTML санитизируется при сохранении в `src/lib/admin/posts/sanitize.ts`.

## Metadata

- `/blog` — статический title/description.
- `/blog/category/[slug]` — из SEO-полей категории или fallback.
- `/blog/[slug]` — title, description, canonical, robots, Open Graph из полей статьи.

`getSiteUrl()` / `absoluteUrl()` — из `NEXT_PUBLIC_SITE_URL` с fallback dev/production.

## JSON-LD

`BlogJsonLd` на странице статьи: BlogPosting или Article по `schemaType`, publisher/author CRM Flow24.

## CTA / FAQ / related

- CTA: поля статьи или default → `/contacts`.
- FAQ: `PostFaqItem`, plain text.
- Related services: `PostServiceRelation`.
- Related posts: связи `PostRelation` или fallback — 3 последние published (кроме текущей).

## Не входит в этап

RSS, sitemap, robots.txt, llms.txt, VK API, комментарии.

## Ручная проверка

1. `npm run docker:db:up && npm run db:seed`
2. `npm run dev`
3. `/blog` — список, категории.
4. `/blog/category/bitrix24` — фильтр.
5. `/blog/testovaya-statya-dlya-publichnogo-bloga` — статья, CTA, FAQ, JSON-LD.
6. Draft/archived slug → 404.

## Следующий этап

RSS, sitemap entries для постов, FAQPage JSON-LD, публичный cover picker.
