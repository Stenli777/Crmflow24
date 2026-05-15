# Production security & ops — рекомендации (7B-4)

Зафиксировано без тяжёлых изменений в коде. Внедрять по приоритету на VPS.

## CSP / security headers

**Сейчас в `next.config.ts`:** X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS (production).

**Рекомендации:**

- Добавить `Content-Security-Policy` после аудита inline-стилей MUI/Metrika (отдельная задача).
- Дублировать ключевые заголовки в nginx `add_header ... always` для статики `/uploads`.

## Upload body size

| Слой | Лимит |
|------|-------|
| Приложение | 5 MB (`validateImageUpload`) |
| nginx | `client_max_body_size 10M` |
| PM2 | не ограничивает body |

Согласовано: 10M nginx ≥ 5M app.

## nginx timeouts

```nginx
proxy_read_timeout 120s;
proxy_connect_timeout 60s;
proxy_send_timeout 120s;
```

Достаточно для upload + SSR. Увеличать только при доказанных таймаутах.

## PM2 / systemd

- `max_memory_restart: 512M` (см. `ecosystem.config.cjs`) — ок для старта
- `pm2 save` + `pm2 startup`
- Лимиты systemd (опционально): `MemoryMax=768M`, `LimitNOFILE=65535`

## Disk usage

```bash
df -h
du -sh /var/www/shared/crmflow24/uploads
du -sh /var/backups/crmflow24
```

Алерт при > 85% диска. Retention backup: 14 дней (скрипты).

## Log rotation

- PM2: `pm2 install pm2-logrotate` или logrotate для `~/.pm2/logs/`
- nginx: стандартный logrotate в `/var/log/nginx/`

## Индексация staging

| Механизм | Где |
|----------|-----|
| `robots.txt` Disallow `/` | `deployEnvironment` + `robots.ts` |
| Пустой sitemap | `sitemap.ts` |
| RSS/llms 404 | `seoFeeds.ts` |
| `X-Robots-Tag` | `middleware.ts` + nginx staging |
| `STAGE=staging` | `.env` |

Production: `STAGE=production` + `NEXT_PUBLIC_SITE_URL=https://crmflow24.ru`.
