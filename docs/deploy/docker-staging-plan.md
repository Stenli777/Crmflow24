# Docker на VPS — план (не обязателен для 7A)

Локально: `docker-compose.yml` — только PostgreSQL для разработки.

Production/staging сейчас рассчитаны на **Node + PM2 + nginx** (см. [staging-vps.md](./staging-vps.md)).

## Когда имеет смысл Docker на VPS

- единый способ поднять PostgreSQL + app;
- изоляция версий Node;
- будущий CI/CD с образом.

## Шаги (позже)

1. Установить Docker Engine + Compose plugin на VPS.
2. Вынести PostgreSQL в `docker-compose.staging.yml` с named volume.
3. Опционально multi-stage `Dockerfile` для Next.js (`output: standalone` — отдельное решение).
4. Не монтировать `.env` и uploads в образ; secrets через env-file на хосте.
5. nginx по-прежнему на хосте → proxy на контейнер `:3001`.

## Чего не делать без решения

- не останавливать текущий PM2 production;
- не переносить production uploads без backup;
- не коммитить реальные пароли в compose-файлы.

Пример имени файла для будущего: `docker-compose.staging.yml.example` (можно добавить при этапе Docker).
