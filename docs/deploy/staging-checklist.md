# Staging checklist — CRM Flow24

## Before deploy

- [ ] Ветка `feature/blog-admin-cms` запушена в origin
- [ ] DNS: `stage.crmflow24.ru` → IP VPS
- [ ] `.env` создан из `.env.staging.example` (секреты не в git)
- [ ] PostgreSQL: БД `crmflow24_stage` и пользователь созданы
- [ ] Uploads: shared-каталог + symlink (см. uploads-vps.md)
- [ ] `BACKUP_DIR` создан (`/var/backups/crmflow24`)
- [ ] nginx config проверен: `sudo nginx -t`
- [ ] SSL: certbot для `stage.crmflow24.ru`

## After deploy

- [ ] `GET /api/health` → `{"status":"ok",...}`
- [ ] `/` открывается
- [ ] `/contacts` открывается
- [ ] `/admin/login` открывается
- [ ] login / logout работают
- [ ] черновик статьи создаётся
- [ ] upload изображения в редакторе
- [ ] `/admin/media` показывает asset
- [ ] publish → статья на `/blog/[slug]`
- [ ] `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`

## Security

- [ ] `.env` не доступен извне (не в `public/`)
- [ ] пароль admin сменён после seed (при необходимости)
- [ ] HTTPS включён
- [ ] `/admin` не в sitemap; robots Disallow `/admin`
- [ ] cron backup БД и uploads настроен
