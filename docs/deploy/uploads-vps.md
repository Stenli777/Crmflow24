# Uploads на VPS

Медиа блога сохраняются в `public/uploads` (по умолчанию `UPLOADS_DIR=./public/uploads`).

## Риск

Если deploy **полностью перезаписывает** каталог релиза (`git pull` + `npm ci` + `build` в одной папке), папка `public/uploads` может быть удалена или опустошена.

## Вариант A — uploads внутри релиза

- Не удалять `public/uploads` в скрипте деплоя.
- Обязательно включить в backup: `scripts/backup/backup-uploads.sh`.

## Вариант B — shared + symlink (предпочтительно)

```bash
sudo mkdir -p /var/www/shared/crmflow24/uploads
sudo chown -R "$USER:$USER" /var/www/shared/crmflow24/uploads

cd /var/www/crmflow24-stage/site
rm -rf public/uploads
ln -s /var/www/shared/crmflow24/uploads public/uploads
```

В `.env`:

```env
UPLOADS_DIR="./public/uploads"
UPLOADS_PUBLIC_BASE_URL="/uploads"
```

Проверка:

```bash
ls -la public/uploads
ls -la /var/www/shared/crmflow24/uploads
```

## Backup

Cron (пример, раз в сутки):

```cron
0 3 * * * BACKUP_DIR=/var/backups/crmflow24 UPLOADS_DIR=/var/www/shared/crmflow24/uploads /var/www/crmflow24-stage/site/scripts/backup/backup-uploads.sh >> /var/log/crmflow24-backup.log 2>&1
```

## Права

Процесс PM2 должен иметь право записи в каталог uploads (владелец = пользователь деплоя).
