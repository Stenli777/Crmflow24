# Scrap → CRMFlow24 inbound (article_v2)

Приём черновиков статей из проекта Scrap в CRMFlow24 без auto-publish.

## Endpoint

```http
POST /api/scrap/articles/import
Content-Type: application/json
Authorization: Bearer <SCRAP_IMPORT_TOKEN>
```

Только **POST**. Создаёт или обновляет **Post** со статусом `DRAFT` (`publishedAt = null`).

## Auth

| Переменная | Описание |
|------------|----------|
| `SCRAP_IMPORT_TOKEN` | Bearer secret (обязателен на сервере) |
| `SCRAP_MAX_BODY_BYTES` | Лимит тела запроса, default `1048576` |

| HTTP | Условие |
|------|---------|
| 503 | `SCRAP_IMPORT_TOKEN` не задан |
| 401 | Нет или неверный Bearer |
| 413 | Body слишком большой |
| 400 | Валидация payload (`retryable: false`) |
| 500 | Внутренняя ошибка (`retryable: true`) |

Токен сравнивается constant-time. `Authorization` и полный payload **не логируются**.

## Successful acknowledgment

```json
{
  "success": true,
  "external_id": "scrap:7:3",
  "draft_url": "https://crmflow24.ru/admin/posts/clxxx",
  "remote_status": "draft",
  "response_schema_version": "crmflow24_ack_v2"
}
```

| Поле | Описание |
|------|----------|
| `external_id` | `scrap:<document_id>:<revision_id>` |
| `draft_url` | Редактор в админке `/admin/posts/{id}` |
| `remote_status` | `draft`, `published` или `draft_locked` |
| `response_schema_version` | `crmflow24_ack_v2` |

## Payload (article_v2)

Минимально обязательные поля:

- `title`
- `source` с `document_id`
- `publication` с `status: "draft"`

Если указаны:

- `payload_version` — только `article_v2`
- `project_slug` — только `crmflow24`
- `publication.status` — только `draft`

`source.revision_id` — опционально (default `latest`).

Контент: `content_html` и/или `content_markdown` (MD → HTML + sanitize).  
Preview image **не скачивается**; `https` URL может попасть в `ogImageUrl`.

## Idempotency

Модель `ScrapArticleImport` с unique `(provider, documentId, revisionId)`.

| Ситуация | Поведение |
|----------|-----------|
| Первый import | Новый `Post` DRAFT + запись import |
| Повторный import, Post DRAFT | Обновление draft |
| Повторный import, Post PUBLISHED/ARCHIVED | Ack без перезаписи контента, `remote_status` = `published` / `draft_locked` |

## Пример curl

```bash
export SCRAP_IMPORT_TOKEN="your-secret"
export BASE="http://localhost:3000"

curl -sS -X POST "$BASE/api/scrap/articles/import" \
  -H "Authorization: Bearer $SCRAP_IMPORT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payload_version": "article_v2",
    "project_slug": "crmflow24",
    "title": "Test article",
    "content_markdown": "# Hello\n\nFrom Scrap.",
    "source": {
      "document_id": 42,
      "revision_id": 1,
      "source_url": "https://example.com/a",
      "source_domain": "example.com"
    },
    "publication": { "status": "draft" }
  }'
```

## Ошибки

```json
{
  "error": "VALIDATION_ERROR",
  "message": "publication.status is required",
  "retryable": false
}
```

```json
{
  "error": "INTERNAL_ERROR",
  "message": "Internal server error",
  "retryable": true
}
```

## Локальный smoke

```bash
# .env: SCRAP_IMPORT_TOKEN=...
npm run dev
# другой терминал:
npm run smoke:scrap-import
```

## Deploy checklist

1. Задать `SCRAP_IMPORT_TOKEN` в production/staging `.env` (тот же токен в Scrap publisher).
2. `npm run db:deploy`
3. `npm run build`
4. `pm2 restart crmflow24-prod` (или staging)
5. Smoke: `POST /api/scrap/articles/import` на staging
6. Убедиться: draft **не** на `/blog`, **не** в `/sitemap.xml` и `/rss.xml`

## Admin visibility

Импортированные черновики видны **только в админке** (`/admin`). На `/blog`, в sitemap и RSS они не появляются, пока статус поста не `PUBLISHED` с датой публикации.

### Список статей

`/admin/posts`

- Бейдж **Scrap** и компактный идентификатор `documentId:revisionId` у импортированных постов.
- Фильтр **Источник**: «Все» / «Scrap imports» / «Вручную».
- Query-параметр: `/admin/posts?source=scrap` (можно комбинировать с `status=DRAFT`).
- Тестовые smoke-черновики помечаются бейджем **Test draft**, если в заголовке есть `Smoke test` или `удалить`.

### Карточка статьи

`/admin/posts/{id}`

Блок **Scrap import** (read-only), если есть связанная запись `ScrapArticleImport`:

| Поле | Назначение |
|------|------------|
| `documentId` / `revisionId` | Ключ идемпотентности Scrap |
| `external_id` | `scrap:<documentId>:<revisionId>` — тот же формат, что в ack API |
| `sourceUrl` | Ссылка на исходный материал (открывается в новой вкладке) |
| `remoteStatus` | `draft`, `published`, `draft_locked` — состояние на стороне CRMFlow24 |
| `editorialJson` | Оценки/статус редакции из Scrap |
| `lastPayload` | Сырой payload в collapsible-блоке (только админка) |

### Idempotency в админке

Повторный POST с тем же `document_id` + `revision_id` не создаёт второй пост. В списке остаётся одна строка; при открытии редактора — тот же `postId` в URL.

### Удаление smoke / test draft

1. Откройте `/admin/posts?source=scrap&status=DRAFT` или найдите пост по заголовку (например «Smoke test Scrap to CRMFlow24 production - удалить»).
2. Откройте `/admin/posts/{id}`.
3. Нажмите **Удалить** (для тестовых черновиков — усиленное предупреждение).
4. `ScrapArticleImport` удаляется каскадом вместе с `Post`.

Альтернатива: Prisma Studio / SQL на VPS — только при необходимости, предпочтительно кнопка в админке.

## Staging first

Рекомендуется сначала настроить `https://stage.crmflow24.ru` и dry-run Scrap, затем production.

## Намеренно не реализовано

- Auto-publish
- Скачивание preview images (SSRF)
- HMAC / GraphQL / очереди
- Зависимость от runtime Scrap
