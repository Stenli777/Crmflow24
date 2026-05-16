# Архитектура uploads (CRM Flow24)

## Текущая реализация

- Код: `LocalStorageProvider` → `UPLOADS_DIR` (по умолчанию `./public/uploads`)
- Публичный URL: `UPLOADS_PUBLIC_BASE_URL` (по умолчанию `/uploads`)
- Файлы: `media/YYYY/MM/<random>.<ext>`

## Решение: **оставить symlink на shared storage**

| Критерий | Symlink на `/var/www/shared/crmflow24/uploads` |
|----------|-----------------------------------------------|
| После `git pull` | Не затрагивает shared, если symlink пересоздаётся скриптом deploy |
| После `npm run build` | Build не удаляет `public/uploads`, если это symlink вне `.next` |
| После `npm ci` | `node_modules` не трогает `public/uploads` |
| 404 в бою | Снимается nginx `alias` + проверкой symlink в checklist |

Альтернатива «только путь в проекте» (`public/uploads` без symlink) **не рекомендуется** на VPS: риск потери медиа при полной перезаписи релиза.

## Рекомендуемая схема на VPS

```
/var/www/shared/crmflow24/uploads/   ← реальные файлы (backup)
/var/www/crmflow24/site/public/uploads → symlink на shared
```

Создание (один раз):

```bash
sudo mkdir -p /var/www/shared/crmflow24/uploads
sudo chown -R www-data:www-data /var/www/shared/crmflow24/uploads
cd /var/www/crmflow24/site
rm -rf public/uploads
ln -sfn /var/www/shared/crmflow24/uploads public/uploads
```

## Ownership (`www-data`)

Каталог uploads должен принадлежать **тому же пользователю, что и процесс Node/PM2** (на типичном VPS с nginx — `www-data`).

| Ресурс | Owner | Почему |
|--------|-------|--------|
| `/var/www/shared/crmflow24/uploads` | `www-data:www-data` | `LocalStorageProvider` пишет файлы при upload из админки |
| `site/.next/` | `www-data:www-data` | кэш Next.js, revalidate sitemap, runtime-запись |

Если shared uploads создан от `root`, а PM2 работает как `www-data`, upload в TipTap даст **`EACCES`**. Если `.next` после build принадлежит deploy-user, а PM2 — `www-data`, возможны **`EACCES`** при отдаче sitemap, блога и кэша.

После `npm run build` (см. [production-deploy-checklist.md](./production-deploy-checklist.md)):

```bash
sudo chown -R www-data:www-data /var/www/crmflow24/site/.next
sudo chown -R www-data:www-data /var/www/shared/crmflow24/uploads
```

Права каталога uploads: `755` (или `775`, если несколько пользователей в одной группе). Не использовать `root:root` на production для рабочих каталогов приложения.

В `.env` production:

```env
UPLOADS_DIR="./public/uploads"
UPLOADS_PUBLIC_BASE_URL="/uploads"
STAGE=production
NEXT_PUBLIC_SITE_URL=https://crmflow24.ru
```

## Deploy script (фрагмент)

После `git pull` и до `npm run build`:

```bash
SHARED_UPLOADS="/var/www/shared/crmflow24/uploads"
sudo mkdir -p "$SHARED_UPLOADS"
sudo chown -R www-data:www-data "$SHARED_UPLOADS"
ln -sfn "$SHARED_UPLOADS" public/uploads
test -L public/uploads && test -d public/uploads || echo "WARN: uploads symlink check"
# после build:
sudo chown -R www-data:www-data .next
```

## Когда переходить на object storage (S3)

- несколько серверов;
- CDN для медиа;
- отдельный этап (новый `storageProvider`), не блокер для первого production deploy.
