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
mkdir -p /var/www/shared/crmflow24/uploads
cd /var/www/crmflow24/site
rm -rf public/uploads
ln -sfn /var/www/shared/crmflow24/uploads public/uploads
```

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
mkdir -p "$SHARED_UPLOADS"
ln -sfn "$SHARED_UPLOADS" public/uploads
test -L public/uploads && test -d public/uploads/media || echo "WARN: uploads symlink check"
```

## Когда переходить на object storage (S3)

- несколько серверов;
- CDN для медиа;
- отдельный этап (новый `storageProvider`), не блокер для первого production deploy.
