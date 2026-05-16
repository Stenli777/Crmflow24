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
| `npm run docker:db:up` | OK — контейнер `crmflow24-postgres` Running |
| `npm run db:generate` | OK |
| `npm run db:migrate` (с хоста) | FAIL — P1000: на `127.0.0.1:5432` слушает **локальный PostgreSQL**, не Docker |
| `prisma migrate deploy` (через `--network container:crmflow24-postgres`) | OK — применена `20260515180000_add_vk_dry_run_status` |
| `npm run db:seed` (через docker network) | OK — admin `info@crmflow24.ru`, smoke-статья `/blog/testovaya-statya-dlya-publichnogo-bloga` |
| Enum в БД | OK — `NOT_PUBLISHED`, `DRY_RUN`, `PUBLISHED`, `FAILED` |
| `npm run lint` | OK |
| `npm run build` | OK (Prisma P1000 при SSG с хоста — из‑за того же конфликта порта) |

### Конфликт порта 5432 (важно)

На машине одновременно слушают порт 5432 Docker и локальный PostgreSQL (`127.0.0.1`). Prisma с хоста подключается к **локальному** инстансу → P1000.

**Рекомендация:** в `.env` выровнять `DATABASE_URL` с `docker-compose.yml` **или** сменить порт Docker на `5433:5432` и обновить URL **или** остановить локальный PostgreSQL на 5432.

### Smoke dry-run (скрипт)

`scripts/smoke/vk-dry-run.mts` (через docker network):

```json
{
  "dryRun": true,
  "slug": "testovaya-statya-dlya-publichnogo-bloga",
  "vkStatus": "DRY_RUN",
  "logStatus": "DRY_RUN"
}
```

Real VK API не вызывался. UI в браузере не проверялся.

## Smoke test (UI, ручной)

После исправления `DATABASE_URL` на хосте:

- [ ] `npm run dev` → `/admin/login`
- [ ] опубликованная статья → vkText → кнопка dry-run
- [ ] vkStatus=DRY_RUN, лог в панели

## Следующий шаг

- Загрузка обложки в VK (photos.getWallUploadServer)
- Опционально: превью текста перед отправкой
- Production: задать env на VPS, оставить `VK_DRY_RUN=true` до приёмки
