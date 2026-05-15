# Nginx: production uploads для CRM Flow24

Цель: отдавать `/uploads/*` напрямую с диска (без Next.js), с кэшем и без выполнения скриптов.

## Предпосылки

- Shared storage: `/var/www/shared/crmflow24/uploads`
- Symlink в релизе: `public/uploads` → shared (см. [uploads-architecture.md](./uploads-architecture.md))
- `UPLOADS_PUBLIC_BASE_URL=/uploads`

## Snippet (в server block crmflow24.ru)

```nginx
client_max_body_size 10M;
proxy_read_timeout 120s;

location ^~ /uploads/ {
    alias /var/www/shared/crmflow24/uploads/;

    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
    add_header X-Content-Type-Options "nosniff" always;

    types {
        image/jpeg jpg jpeg;
        image/png png;
        image/webp webp;
        image/avif avif;
    }
    default_type application/octet-stream;

    # Запрет скрытых и исполняемых
    location ~ /\. {
        deny all;
    }
    location ~* \.(php|pl|py|jsp|asp|aspx|sh|cgi|exe|bat|cmd)$ {
        return 403;
    }
}

location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Проверка после настройки

```bash
curl -I https://crmflow24.ru/uploads/media/YYYY/MM/<file>.png
# Ожидание: 200, Content-Type: image/*, Cache-Control с max-age
```

## Типичная ошибка 404

- symlink `public/uploads` сломан после deploy;
- `alias` указывает не на тот каталог;
- trailing slash в `location ^~ /uploads/` и `alias .../uploads/` обязателен.
