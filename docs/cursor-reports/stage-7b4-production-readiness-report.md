# Cursor Report — Этап 7B-4: production-ready infra (local)

## Цель

Убрать staging-хаки из «магии», сделать production deploy воспроизводимым, не получить 404 на uploads, не проиндексировать staging.

**Deploy на production не выполнялся.**

## Git

| Параметр | Значение |
|----------|----------|
| Ветка | `feature/blog-admin-cms` |
| Коммит этапа 7A | `ee19e06` (на origin) |
| Коммит 7B-4 | (после commit в этой задаче) |

## Changed files (код)

| Файл | Изменение |
|------|-----------|
| `src/lib/seo/deployEnvironment.ts` | NEW — production/staging/dev |
| `src/lib/seo/seoFeeds.ts` | NEW — блок RSS/llms на non-prod |
| `src/app/robots.ts` | staging → Disallow `/` |
| `src/app/sitemap.ts` | пустой sitemap на non-prod |
| `src/middleware.ts` | `X-Robots-Tag` на non-prod |
| `src/app/layout.tsx` | `generateMetadata` + `getSiteUrl()` + robots |
| `src/app/rss.xml/route.ts` | 404 на non-prod |
| `src/app/rss/yandex-dzen.xml/route.ts` | 404 на non-prod |
| `src/app/llms*.txt/route.ts` | 404 на non-prod |
| `src/lib/seo/blogMetadata.ts` | metadataBase, twitter og image |

## Changed files (docs)

| Файл |
|------|
| `docs/deploy/nginx-staging-example.conf` |
| `docs/deploy/nginx-production-uploads.md` |
| `docs/deploy/uploads-architecture.md` |
| `docs/deploy/production-deploy-checklist.md` |
| `docs/deploy/production-security-recommendations.md` |
| `.env.staging.example`, `.env.example` (STAGE) |

## Логика окружений

```
STAGE=production + NEXT_PUBLIC_SITE_URL=https://crmflow24.ru → indexable
STAGE=staging или stage.* в URL → noindex, disallow /, no feeds
localhost / dev → noindex (как staging для SEO)
Неизвестный prod NODE_ENV без crmflow24.ru → noindex (safe default)
```

## Uploads — решение

**Оставить symlink** на `/var/www/shared/crmflow24/uploads`.  
`npm run build` / `git pull` не удаляют shared. Проверка symlink в deploy checklist.

## CMS SEO (проверка)

| Элемент | Статус |
|---------|--------|
| canonical | OK (metadataBase из `getSiteUrl()`) |
| og:image | OK (+ twitter card на статьях) |
| BlogPosting JSON-LD | OK |
| RSS metadata | OK (description, enclosure, pubDate) |
| sitemap blog posts | OK на production |
| robots staging | OK (многослойно) |

## Проверено локально

(после lint/build)

## Unresolved risks

| Риск | Критичность |
|------|-------------|
| Production `.env` без `STAGE=production` | Критично — noindex на бою |
| Symlink uploads не в deploy script | Критично — 404 медиа |
| nginx uploads alias не настроен | Критично — 404 или медленно |
| CSP не настроен | Желательно |
| Нет мониторинга диска/backups cron | Желательно |
| EPERM prisma generate на Windows | Локально |

## Production deploy readiness

**NO** — код и документация готовы; **первый production deploy CMS ещё не выполнен** на VPS.

После на VPS:

1. `STAGE=production`, `NEXT_PUBLIC_SITE_URL=https://crmflow24.ru`
2. PostgreSQL + migrate deploy
3. Shared uploads + symlink + nginx alias
4. Checklist: [production-deploy-checklist.md](../deploy/production-deploy-checklist.md)

## Файлы для переноса на VPS

- Весь `site/` из ветки `feature/blog-admin-cms`
- `.env` (не из git) из `.env.staging.example` / production template
- `ecosystem.config.cjs`
- `docs/deploy/nginx-staging-example.conf` или production nginx snippets
- `scripts/backup/*.sh`

## Следующий шаг

Этап 7B-5: staging deploy на VPS по SSH, затем production по checklist после приёмки.
