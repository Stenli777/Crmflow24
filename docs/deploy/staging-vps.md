# Staging deploy на VPS (CRM Flow24)

Поддомен: **stage.crmflow24.ru** → A-запись на IP VPS (DNS настраивает владелец домена).

Production **не трогаем**: отдельный каталог, порт **3001**, PM2-процесс `crmflow24-stage`.

## 1. Пакеты на сервере

```bash
# Node 20 LTS (пример через NodeSource или nvm)
node -v   # v20.x
npm -v

sudo apt install -y nginx certbot python3-certbot-nginx postgresql-client
npm install -g pm2
```

## 2. Каталог и код

```bash
sudo mkdir -p /var/www/crmflow24-stage
sudo chown -R "$USER:$USER" /var/www/crmflow24-stage
cd /var/www/crmflow24-stage
git clone git@github.com:Stenli777/Crmflow24.git .
cd site
git checkout feature/blog-admin-cms
git pull
```

## 3. Env

```bash
cp .env.staging.example .env
nano .env   # STAGE=staging, DATABASE_URL, AUTH_SECRET, ADMIN_*, BITRIX_WEBHOOK_URL
```

## 4. PostgreSQL

См. [postgres-vps.md](./postgres-vps.md).

## 5. Uploads (symlink)

См. [uploads-vps.md](./uploads-vps.md).

## 6. Сборка

```bash
npm ci
npm run db:deploy
# Первый раз: npm run db:seed
npm run build
```

## 7. PM2

Отредактируйте `cwd` в `ecosystem.config.cjs` при необходимости:

```bash
pm2 start ecosystem.config.cjs --only crmflow24-stage
pm2 save
pm2 startup
```

## 8. Nginx + SSL

```bash
sudo cp docs/deploy/nginx-staging-example.conf /etc/nginx/sites-available/crmflow24-stage
sudo ln -s /etc/nginx/sites-available/crmflow24-stage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d stage.crmflow24.ru
```

## 9. Проверки

| URL | Ожидание |
|-----|----------|
| https://stage.crmflow24.ru/api/health | JSON `status: ok` |
| / | 200 |
| /blog | 200 |
| /admin/login | 200 |
| /rss.xml | RSS XML |
| /sitemap.xml | sitemap |

Чек-лист: [staging-checklist.md](./staging-checklist.md).

## 10. Backup (cron)

```bash
sudo mkdir -p /var/backups/crmflow24
chmod +x scripts/backup/*.sh
```

```cron
15 3 * * * cd /var/www/crmflow24-stage/site && set -a && . ./.env && set +a && BACKUP_DIR=/var/backups/crmflow24 ./scripts/backup/backup-postgres.sh
30 3 * * * BACKUP_DIR=/var/backups/crmflow24 UPLOADS_DIR=/var/www/shared/crmflow24/uploads /var/www/crmflow24-stage/site/scripts/backup/backup-uploads.sh
```

## 11. Обновление (deploy)

```bash
cd /var/www/crmflow24-stage/site
git pull
npm ci
npm run db:deploy
npm run build
pm2 restart crmflow24-stage
```

## 12. Rollback

```bash
git log --oneline -5
git checkout <previous-commit>
npm ci && npm run build
pm2 restart crmflow24-stage
```

Не выполнять: `prisma migrate reset`, `dropdb`, `rm -rf` production-каталогов.
