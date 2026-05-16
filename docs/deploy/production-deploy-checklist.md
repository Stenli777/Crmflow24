# Production deploy checklist — CRM Flow24

**Не выполнять на production без явного решения.** Использовать как runbook.

## Перед deploy

- [ ] Ветка `feature/blog-admin-cms` (или release) смержена и протестирована на staging
- [ ] `STAGE=production` и `NEXT_PUBLIC_SITE_URL=https://crmflow24.ru` в production `.env`
- [ ] Backup PostgreSQL: `scripts/backup/backup-postgres.sh`
- [ ] Backup `.env`: `cp .env /var/backups/crmflow24/env-$(date +%Y%m%d).bak`
- [ ] Backup uploads: `scripts/backup/backup-uploads.sh`
- [ ] Git tag: `git tag -a vYYYY.MM.DD-HHMM -m "production deploy"` && `git push origin <tag>`
- [ ] Symlink uploads проверен (см. [uploads-architecture.md](./uploads-architecture.md))
- [ ] Ownership: `.next` и shared `uploads` принадлежат пользователю процесса PM2 (`www-data`) — см. раздел ниже
- [ ] nginx config + `sudo nginx -t`
- [ ] Диск: `df -h` (запас > 20%)

## Deploy (в каталоге production `site/`)

```bash
git fetch
git checkout <release-branch-or-tag>
git pull

# uploads symlink — не пропускать
ln -sfn /var/www/shared/crmflow24/uploads public/uploads

npm ci
npm run db:deploy
npm run build

# Права после build (если сборка шла от root/deploy-user, а PM2 — www-data)
sudo chown -R www-data:www-data .next
sudo chown -R www-data:www-data /var/www/shared/crmflow24/uploads

pm2 restart crmflow24-prod
```

`npm run db:seed` — **только** при первом запуске CMS на пустой БД.

## Права доступа (ownership)

На VPS Next.js и загрузка медиа выполняются от имени **`www-data`** (или того же UNIX-пользователя, под которым запущен PM2). Если `npm run build` выполняется от `root` или отдельного deploy-пользователя, а приложение стартует как `www-data`, возможны ошибки **`EACCES`**:

| Путь | Зачем нужны права `www-data` |
|------|------------------------------|
| `site/.next/` | runtime, кэш, ISR/sitemap revalidate, запись при работе приложения |
| `/var/www/shared/crmflow24/uploads/` | запись новых файлов через admin upload API |

**Симптомы при неверном owner:**

- upload изображения в админке → 500 / `EACCES` в логах PM2;
- `/sitemap.xml` или страницы блога → 500 при генерации/кэше;
- `Permission denied` при записи в `.next/cache`.

**Рекомендация после каждого `npm run build`:**

```bash
sudo chown -R www-data:www-data /var/www/crmflow24/site/.next
sudo chown -R www-data:www-data /var/www/shared/crmflow24/uploads
```

Проверка:

```bash
ls -la .next | head
ls -la /var/www/shared/crmflow24/uploads | head
pm2 describe crmflow24-prod | grep -i user
```

Пользователь в `pm2 describe` и owner каталогов **должны совпадать**. Альтернатива: выполнять `npm run build` сразу от `www-data` (`sudo -u www-data npm run build`), тогда отдельный `chown` для `.next` не нужен (uploads shared всё равно проверить).

## Smoke tests (production)

- [ ] `GET https://crmflow24.ru/api/health` → `status: ok`
- [ ] `/`, `/services`, `/contacts`, `/blog`
- [ ] `/admin/login` (без индексации в Google)
- [ ] `/robots.txt` — allow `/`, disallow `/admin`, `/api`; есть Sitemap
- [ ] `/sitemap.xml` — есть `/blog` и published-статьи
- [ ] `/rss.xml` — items published
- [ ] Загрузка изображения в статью → URL `/uploads/...` открывается (200)
- [ ] Опубликованная статья на `/blog/[slug]`

## Rollback

```bash
git checkout <previous-tag>
npm ci
npm run db:deploy   # только если миграции обратимы; иначе restore DB из backup
npm run build
pm2 restart crmflow24-prod
```

При failed migration — **остановиться**, восстановить БД из `postgres-*.sql.gz`, не делать `migrate reset`.

## После deploy

- [ ] Проверить `pm2 logs crmflow24-prod --lines 50`
- [ ] Убедиться, что staging по-прежнему `STAGE=staging` и noindex
