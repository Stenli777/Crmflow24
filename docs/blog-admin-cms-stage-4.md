# Blog / Admin CMS — Этап 4: TipTap и загрузка медиа

## Что добавлено

- TipTap WYSIWYG в форме статьи (только `/admin`).
- Сохранение `contentJson` и санитизированного `contentHtml`.
- `storageProvider` + `localStorageProvider`.
- API `POST /api/admin/media/upload` (только для admin).
- Страница `/admin/media` со списком изображений.
- Валидация MIME, расширения, размера (5 МБ).
- SVG и опасные типы запрещены.

## Зависимости

- `@tiptap/react`, `@tiptap/starter-kit`, extensions (link, image, placeholder, underline, text-align)
- `sanitize-html`, `@types/sanitize-html`

## TipTap

- Компоненты: `src/components/admin/editor/`
- Hidden inputs: `contentJson`, `contentHtml`
- H1 в теле статьи недоступен (только H2–H4)
- Вставка изображений через upload API

## Санитизация

- `src/lib/admin/posts/sanitize.ts`
- Server-side перед записью в БД
- Запрещены script, iframe, inline styles, `javascript:`, `data:` URI в img

## Storage

- Интерфейс: `src/lib/storage/storageProvider.ts`
- Локальная реализация: `localStorageProvider.ts`
- Физически: `public/uploads/media/YYYY/MM/<random>.<ext>`
- Публичный URL: `/uploads/media/...`
- Env: `UPLOADS_DIR`, `UPLOADS_PUBLIC_BASE_URL`

При переходе на S3 меняется только provider.

## Разрешённые MIME

- `image/jpeg`, `image/png`, `image/webp`, `image/avif`
- Максимум 5 МБ

## Ручная проверка

```bash
npm run dev
```

1. Войти в админку.
2. Создать/открыть статью, набрать текст в TipTap, сохранить, переоткрыть.
3. Вставить JPG/WebP через кнопку «Изображение».
4. Открыть `/admin/media` — файл в списке.
5. Проверить `public/uploads/media/...` на диске.
6. Upload без login → 401.
7. Upload `.svg` / `.txt` → 400.

## Следующий этап

Публичный `/blog`, RSS, sitemap для блога, VK API.
