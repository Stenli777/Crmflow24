# Отчёт Cursor — Этап 9: VK real publish

**Дата:** 2026-05-16  
**Ветка:** `feature/vk-real-publish`  
**Среда:** Cursor Local (VPS/production не трогались)

## 1. Branch

- `feature/vk-real-publish` от `main` (`88a0b31`)

## 2. Upload pipeline

| Шаг | Метод / модуль |
|-----|----------------|
| 1 | `photos.getWallUploadServer` — `client.getWallUploadServer` |
| 2 | POST multipart на `upload_url` — `client.uploadPhotoToWallServer` |
| 3 | `photos.saveWallPhoto` — `client.saveWallPhoto` |
| 4 | `photo{owner_id}_{id}` — `uploadVkImage.ts` |

## 3. Image resolve

`resolveVkImage.ts`:

1. `coverImage` (не SVG)
2. `ogImageUrl`
3. Первое `<img src>` в `contentHtml`

`downloadImage.ts`: локальный `uploads` или fetch с того же host, max 5 MB.

## 4. Dry-run

- Без upload и без VK API
- `rawResponse.image`: source, url, `attachmentPreview`
- Сообщение в UI о пропуске upload

## 5. Real publish

- `uploadVkImage` → attachment (если есть изображение)
- `wall.post` с `attachments`
- Ошибки по стадиям: download / getWallUploadServer / upload / saveWallPhoto / wall.post → `FAILED` + log

**Real publish не тестировался** (нет токена в env, `VK_DRY_RUN=true` по умолчанию).

## 6. UI

`VkPublishPanel`: источник изображения, dry-run/real подпись, warning re-publish, кнопка «Опубликовать повторно», колонка Attachment в логах.

## 7. Checks

| Команда | Результат |
|---------|-----------|
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run docker:db:up` | OK |
| `npx prisma migrate deploy` | OK |

## 8. Smoke

| Сценарий | Результат |
|----------|-----------|
| Dry-run (`vk-dry-run.mts` / UI) | OK — API не вызывается, image preview в rawResponse при наличии обложки |
| Real publish | не выполнялся (нет токена, `VK_DRY_RUN=true`) |

## 9. Risks

- VK API лимиты и права `photos`, `wall`
- Большие изображения / медленный upload
- Re-publish создаёт дубликат на стене
- Токен только на сервере, не в git

## 10. Next step

- Staging: `VK_DRY_RUN=false` + токен, одна тестовая статья с обложкой
- Production deploy с миграциями (если не применены) и `VK_DRY_RUN=true` до приёмки
