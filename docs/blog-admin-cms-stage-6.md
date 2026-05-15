# Blog CMS — Этап 6: RSS, sitemap, robots, llms

## Что добавлено

- `/rss.xml` — RSS 2.0, до 50 published-статей
- `/rss/yandex-dzen.xml` — лента для Дзена (тот же набор статей)
- Расширенный `/sitemap.xml` — статика, блог, категории, статьи
- Расширенный `/robots.txt` — Disallow `/admin`, `/api`; Sitemap
- `/llms.txt` и `/llms-full.txt` — plain text для LLM
- `BlogFaqJsonLd` — FAQPage на страницах статей с FAQ
- WebSite JSON-LD в глобальном `SiteJsonLd` (Organization уже был)
- Пункт «Блог» в шапке

## Data layer

`src/lib/blog/seoQueries.ts` — read-only запросы для sitemap, RSS, llms. Только `PUBLISHED` + `publishedAt`.

## Не входит в этап

VK API, deploy, backup uploads на VPS.

## Ручная проверка

```bash
npm run docker:db:up
npm run db:seed
npm run dev
```

- http://localhost:3000/rss.xml
- http://localhost:3000/sitemap.xml
- http://localhost:3000/robots.txt
- http://localhost:3000/llms.txt
- Статья с FAQ → FAQPage JSON-LD в исходном коде

## Следующий этап

DevOps: backup `public/uploads`, production env, мониторинг.
