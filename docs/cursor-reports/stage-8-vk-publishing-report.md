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

## Проверки (заполнить после прогона)

| Команда | Результат |
|---------|-----------|
| `npm run docker:db:up` | |
| `npm run db:generate` | |
| `npm run db:migrate` | |
| `npm run db:seed` | |
| `npm run lint` | |
| `npm run build` | |

## Smoke test (ручной)

- [ ] login admin
- [ ] published post + vkText
- [ ] dry-run → DRY_RUN + log
- [ ] no crash

## Следующий шаг

- Загрузка обложки в VK (photos.getWallUploadServer)
- Опционально: превью текста перед отправкой
- Production: задать env на VPS, оставить `VK_DRY_RUN=true` до приёмки
