# Этап 9 — VK: real publish и upload изображения

## Что добавлено

- Pipeline загрузки фото на стену VK: `getWallUploadServer` → multipart upload → `saveWallPhoto`
- Server-side скачивание изображения (не URL в VK): `downloadImage.ts`
- Выбор источника: обложка → OG → первое `<img>` в HTML (`resolveVkImage.ts`)
- Real `wall.post` с `attachments=photo{owner}_{id}`
- Dry-run: preview источника и attachment в `rawResponse`, без API
- Re-publish protection: повтор только кнопкой «Опубликовать повторно»
- UI: источник изображения, attachment в логах, warning при `PUBLISHED`

## Env

Без изменений от этапа 8:

```env
VK_ACCESS_TOKEN=""
VK_GROUP_ID=""
VK_API_VERSION="5.199"
VK_DRY_RUN="true"
```

Real publish только при `VK_DRY_RUN=false` и валидных token/group.

## Ограничения

- MIME: `image/jpeg`, `image/png`, `image/webp` — **SVG запрещён**
- Max size: 5 MB
- Скачивание только с хоста сайта / локального `uploads`
- Браузер не отправляет файл в VK напрямую

## Dry-run

- VK API не вызывается
- Upload не выполняется
- В логе: `image.source`, `image.url`, `attachmentPreview`

## Real publish

1. `resolveVkImage`
2. `downloadImageForVk` → buffer
3. `uploadVkImage` → attachment
4. `wall.post` с текстом и attachment
5. `vkPostUrl`, `vkStatus=PUBLISHED`

## Re-publish

Если `vkStatus=PUBLISHED` — основная кнопка скрыта, warning + «Опубликовать повторно» с `forceRepublish=1`.

## Проверка

```bash
npm run docker:db:up
npm run db:migrate
npm run dev
```

Dry-run: кнопка в админке → DRY_RUN + лог с image preview.

Real: только вручную с рабочим токеном на staging, не локально без необходимости.
