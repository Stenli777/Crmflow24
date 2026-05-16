# Отчёт Cursor — Этап 8: VK publishing

**Дата:** 2026-05-15  
**Ветка:** `feature/vk-publishing`  
**Среда:** Cursor Local only (VPS/production не трогались)

## Контекст

Реализована ручная публикация опубликованных статей блога во ВКонтакте из админки с dry-run по умолчанию, логированием в `VkPublicationLog` и защитой `requireAdmin`.

## Изменённые / новые файлы

| Путь | Назначение |
|------|------------|
| `prisma/schema.prisma` | enum `DRY_RUN` |
| `prisma/migrations/20260515180000_add_vk_dry_run_status/` | миграция |
| `src/lib/vk/config.ts` | env config |
| `src/lib/vk/client.ts` | VK API fetch client |
| `src/lib/vk/buildVkPost.ts` | текст поста |
| `src/lib/admin/posts/vkActions.ts` | server action |
| `src/components/admin/posts/VkPublishPanel.tsx` | UI + логи |
| `src/app/admin/(protected)/posts/[id]/page.tsx` | панель на edit |
| `src/lib/admin/labels.ts` | label DRY_RUN |
| `src/components/admin/PostForm.tsx` | vkText, без дубля статуса |
| `.env.example` | VK_* vars |
| `docs/blog-admin-cms-stage-8-vk.md` | документация |

## Env

- `VK_ACCESS_TOKEN` — опционально в dry-run
- `VK_GROUP_ID` — нужен для real publish
- `VK_API_VERSION` — default `5.199`
- `VK_DRY_RUN` — default dry-run (`!== "false"`)

## Prisma

- **DRY_RUN** добавлен в `VkPublicationStatus`
- Миграция: `20260515180000_add_vk_dry_run_status`

## VK client

- `vkApi`, `publishWallPost`, `resolveVkOwnerId`, `buildVkWallUrl`
- Token не логируется; в ответах VK токена нет

## Admin UI

- Кнопка и логи: `VkPublishPanel` под формой статьи `/admin/posts/[id]`
- Draft: сообщение «Сначала опубликуйте статью на сайте»

## Dry-run

- Real API не вызывается без `VK_DRY_RUN=false`
- Log: `DRY_RUN`, `vkPostId=dry-run`
- Post: `vkStatus=DRY_RUN`

## Ограничения

- Прямая загрузка картинки в VK **не реализована** (следующий этап)
- Real publish в отчёте **не тестировался** без токена

## Проверки (Docker поднят, 2026-05-16)

| Команда | Результат |
|---------|-----------|
| `npm run docker:db:up` | OK — `crmflow24-postgres` на **5434** |
| `npm run db:generate` | OK |
| `npm run db:migrate` (с хоста, `.env` → 5434) | OK |
| `npm run db:seed` | OK — admin из `ADMIN_EMAIL`, статья `testovaya-statya-dlya-publichnogo-bloga` |
| Enum в БД | OK — `NOT_PUBLISHED`, `DRY_RUN`, `PUBLISHED`, `FAILED` |
| `npm run lint` | OK |
| `npm run build` | OK |
| Prisma smoke `scripts/smoke/vk-dry-run.mts` | OK — `DRY_RUN` + log |
| UI smoke `scripts/smoke/vk-dry-run-ui.mts` (Playwright) | OK — см. ниже |

### Локальный PostgreSQL: порт **5434** (не 5433)

- **5432** — занят системным PostgreSQL (`127.0.0.1`).
- **5433** — занят другим Docker-контейнером `postgres` (проект whatsaper).
- **5434** — CRM Flow24 (`docker-compose.yml` + `.env.example`).

`DATABASE_URL`:

```env
postgresql://crmflow24:crmflow24_dev_password@localhost:5434/crmflow24_dev?schema=public
```

### UI smoke (Playwright, headless)

После `taskkill` зависшего процесса на `:3000` и одного `npm run dev`:

```json
{
  "ok": true,
  "statusVisible": true,
  "logTable": true,
  "vkStatus": "DRY_RUN",
  "logStatus": "DRY_RUN"
}
```

Сценарий: login → `/admin/posts/[id]` → vkText → Сохранить → «Проверить VK публикацию (dry-run)» → alert + статус + таблица логов. Real VK API не вызывался.

**Важно:** на Windows иногда на `:3000` остаётся «зависший» Node — админка показывает устаревшие id и edit 404. Решение: остановить все `node`, очистить `.next`, запустить один `npm run dev`.

### Admin cache

В `src/app/admin/(protected)/layout.tsx` добавлено `dynamic = "force-dynamic"` — админка не кэшируется статически.

## Smoke test (ручной в браузере)

- [x] Автоматизировано через `scripts/smoke/vk-dry-run-ui.mts`
- [ ] При желании повторить вручную в Chrome

## Следующий шаг

- Загрузка обложки в VK (photos.getWallUploadServer)
- Опционально: превью текста перед отправкой
- Production: задать env на VPS, оставить `VK_DRY_RUN=true` до приёмки
