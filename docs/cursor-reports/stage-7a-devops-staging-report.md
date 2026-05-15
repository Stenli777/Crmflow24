# Cursor Report — Этап 7A: DevOps / staging

## Контекст до этапа

- Этапы 1–6: CMS, auth, блог, RSS/sitemap/robots/llms.
- README описывал общий PM2+nginx deploy без staging-специфики, backup и uploads shared.
- Dockerfile / PM2 ecosystem в репозитории не было.
- `db:deploy` уже в package.json.

## Git (на старте этапа)

| Параметр | Значение |
|----------|----------|
| Ветка | `feature/blog-admin-cms` |
| Remote | up to date с `origin/feature/blog-admin-cms` |
| Последний коммит этапа 6 | `1da042c` feat: add rss sitemap robots and llms |
| Push этапа 6 | уже на GitHub |

## Доступ к VPS

**Прямого SSH-доступа у агента нет.** Этап выполнен как документация + безопасные скрипты/конфиги без секретов. Факты о production VPS нужно собрать вручную (read-only команды из ТЗ).

## Текущий подход в репозитории

| Элемент | Состояние |
|---------|-----------|
| Next.js | `next build` + `next start`, без `output: standalone` |
| Локальный Docker | `docker-compose.yml` — только Postgres dev |
| PM2 | описан в README; добавлен `ecosystem.config.cjs` (пример) |
| Env | `.env.example`, добавлен `.env.staging.example` |
| Uploads | `public/uploads`, gitignore |

## Что добавлено

| Файл | Назначение |
|------|------------|
| `.env.staging.example` | шаблон env для stage.crmflow24.ru |
| `src/app/api/health/route.ts` | GET JSON healthcheck |
| `ecosystem.config.cjs` | PM2 stage :3001, prod :3000 (пути-пример) |
| `scripts/backup/backup-postgres.sh` | pg_dump + retention |
| `scripts/backup/backup-uploads.sh` | tar.gz uploads + retention |
| `docs/deploy/staging-vps.md` | пошаговый staging deploy |
| `docs/deploy/postgres-vps.md` | PostgreSQL на VPS |
| `docs/deploy/uploads-vps.md` | shared uploads + symlink |
| `docs/deploy/nginx-stage.example.conf` | nginx proxy |
| `docs/deploy/staging-checklist.md` | чек-лист |
| `docs/deploy/docker-staging-plan.md` | план Docker позже |
| `docker-compose.staging.yml.example` | Postgres staging в Docker (опционально) |

## Staging plan (кратко)

- **Поддомен:** stage.crmflow24.ru
- **Каталог:** `/var/www/crmflow24-stage/site`
- **Порт:** 3001 (PM2 `crmflow24-stage`)
- **БД:** `crmflow24_stage` (отдельно от production)
- **Uploads:** `/var/www/shared/crmflow24/uploads` → symlink `public/uploads`
- **Backup:** `/var/backups/crmflow24`, retention 14 дней
- **SSL:** certbot + nginx

## Безопасные команды

- `git pull`, `npm ci`, `npm run build`, `npm run db:deploy`, `pm2 restart crmflow24-stage`
- `sudo nginx -t`, `certbot --nginx`
- backup scripts с env из `.env`

## Нельзя на VPS без решения

- `prisma migrate reset`, `dropdb`
- `rm -rf` production / shared uploads
- перезапись nginx production без backup
- деплой в production без отдельного согласования

## Проверено локально

(заполняется после lint/build/smoke)

## Риски

- EPERM `db:generate` на Windows при занятом engine
- Staging и production на одном VPS — разделить порты, БД и uploads
- `NEXT_PUBLIC_SITE_URL` на staging должен быть staging-домен

## Следующий шаг

- DNS + первый staging deploy по checklist
- Этап 7B: фактический deploy на VPS (по SSH пользователя)
- VK API — отдельный этап
