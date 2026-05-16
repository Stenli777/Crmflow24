# Blog / Admin CMS — Этап 1: Prisma и PostgreSQL

## Что добавлено

- Ветка `feature/blog-admin-cms` для разработки CMS без изменений в `main`.
- `docker-compose.yml` — локальный PostgreSQL 16 для разработки.
- Prisma ORM с базовой схемой для блога, SEO, FAQ, медиа, VK-логов и настроек сайта.
- `src/lib/db/prisma.ts` — singleton Prisma Client для Next.js.
- `prisma/seed.ts` — создание или обновление первого admin-пользователя.
- `.env.example` — шаблон переменных окружения (без секретов).
- npm-скрипты: `db:*`, `docker:db:*`.

Публичные страницы сайта на этом этапе **не изменялись**. UI `/admin`, TipTap, `/blog`, VK API — **ещё не реализованы**.

## Быстрый старт (локально)

Из каталога `site/`:

```bash
cp .env.example .env
```

Отредактируйте `.env`: задайте `ADMIN_PASSWORD` и `AUTH_SECRET` (случайная строка). Dev-пароль БД в примере совпадает с `docker-compose.yml`.

```bash
npm run docker:db:up
npm run db:generate
npm run db:migrate
npm run db:seed
```

Опционально — Prisma Studio:

```bash
npm run db:studio
```

Остановить PostgreSQL:

```bash
npm run docker:db:down
```

Логи контейнера:

```bash
npm run docker:db:logs
```

## Docker / PostgreSQL

| Параметр | Значение (dev) |
|----------|----------------|
| Файл | `site/docker-compose.yml` |
| Контейнер | `crmflow24-postgres` |
| Порт (хост) | `5434` (в контейнере `5432`; 5432/5433 часто заняты) |
| БД | `crmflow24_dev` |
| Пользователь | `crmflow24` |
| Пароль | `crmflow24_dev_password` (только для локальной разработки) |

На VPS/production используйте отдельные учётные данные и `DATABASE_URL` — не копируйте dev-пароль на сервер.

Healthcheck: `pg_isready -U crmflow24 -d crmflow24_dev`.

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `DATABASE_URL` | Строка подключения PostgreSQL |
| `ADMIN_EMAIL` | Email первого admin (seed) |
| `ADMIN_PASSWORD` | Пароль для seed (не коммитить) |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL сайта |
| `AUTH_SECRET` | Секрет сессий (будущая auth) |
| `BITRIX_WEBHOOK_URL` | Существующая интеграция формы (без изменений) |

Файлы `.env`, `.env.local`, `.env.*.local` в git не попадают.

## Модели БД

- **AdminUser** — администраторы CMS
- **Category**, **Tag**, **PostTag** — рубрикация
- **Post** — статьи (контент JSON/HTML, SEO, OG, CTA, VK-поля)
- **PostFaqItem**, **PostRelation**, **PostServiceRelation** — FAQ, связанные посты и услуги
- **MediaAsset** — медиафайлы (будущий storageProvider)
- **VkPublicationLog** — журнал публикаций ВКонтакте
- **SiteSetting** — key-value настройки (JSON)

Enums: `PostStatus`, `RobotsDirective`, `VkPublicationStatus`, `MediaAssetType`.

## Следующие этапы (план)

1. Аутентификация admin (сессии, middleware).
2. UI `/admin` (список постов, редактор).
3. TipTap и загрузка изображений.
4. Публичный `/blog`, RSS, sitemap, robots, llms.txt.
5. Интеграция публикации во ВКонтакте.

## Ограничения этапа 1

- Нет маршрута `/admin` и UI админки.
- Нет публичного блога `/blog`.
- Нет TipTap, storageProvider, VK API.
- Схема и инфраструктура готовы; бизнес-логика CMS — на следующих этапах.
