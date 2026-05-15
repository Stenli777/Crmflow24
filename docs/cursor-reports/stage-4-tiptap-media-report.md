# Cursor Report — Этап 4: TipTap и media uploads

## Контекст до этапа

- Этапы 1–3: PostgreSQL, Prisma, session auth, CRUD категорий/тегов/статей.
- Контент статей — textarea `contentHtml` без редактора и без upload.

## Решения этапа 4

1. **TipTap только в admin** — client components в `src/components/admin/editor/`, не импортируются публичными страницами.
2. **Двойное сохранение контента** — `contentJson` (TipTap JSON) + `contentHtml` (санитизированный HTML).
3. **storageProvider** — абстракция для будущего S3; сейчас `LocalStorageProvider` → `public/uploads/`.
4. **Upload через route handler** — `POST /api/admin/media/upload`, проверка `getCurrentAdmin()`.
5. **MediaAsset в БД** — каждая загрузка создаёт запись для `/admin/media`.
6. **coverImage** — не реализован на этом этапе (приоритет — тело статьи).

## Зависимости

```
@tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
@tiptap/extension-placeholder @tiptap/extension-underline @tiptap/extension-text-align
sanitize-html @types/sanitize-html
```

## Изменённые / новые файлы

| Путь | Назначение |
|------|------------|
| `src/components/admin/editor/TiptapEditor.tsx` | Редактор + hidden inputs |
| `src/components/admin/editor/EditorToolbar.tsx` | Панель инструментов |
| `src/components/admin/editor/editorTypes.ts` | Типы |
| `src/lib/admin/posts/sanitize.ts` | Санитизация HTML, parse JSON |
| `src/lib/storage/*` | Provider + validation |
| `src/app/api/admin/media/upload/route.ts` | Upload API |
| `src/app/admin/(protected)/media/page.tsx` | Список медиа |
| `src/lib/admin/posts/actions.ts` | contentJson + sanitize |
| `src/components/admin/PostForm.tsx` | TipTap вместо textarea |
| `src/components/admin/AdminShell.tsx` | Пункт «Медиа» |
| `.env.example`, `.gitignore` | uploads |
| `docs/blog-admin-cms-stage-4.md` | Краткая документация |

Также закоммичены правки этапа 3: `ButtonLink.tsx`, замена `Button component={Link}` в server pages.

## Editor

- Старт: `contentJson` → иначе `contentHtml` → иначе пустой doc.
- Toolbar: H2/H3, bold/italic/underline, lists, quote, align, link, image, undo/redo.
- Image: POST multipart → insert `Image` node, prompt для alt.
- On update: sync hidden `contentJson` / `contentHtml`.

## Upload flow

```
Browser (admin) → POST /api/admin/media/upload
  → getCurrentAdmin() (401 if missing)
  → validateImageUpload()
  → storageProvider.uploadFile()
  → prisma.mediaAsset.create()
  → { id, url, alt }
```

## Безопасность

| Проверка | Реализация |
|----------|------------|
| Auth | getCurrentAdmin на upload route |
| MIME | whitelist jpeg/png/webp/avif |
| SVG | запрещён |
| Size | 5 MB |
| HTML | sanitize-html server-side |
| data: URI in img | filtered |
| storage key | random hex, not original filename |

## Env

```env
UPLOADS_DIR="./public/uploads"
UPLOADS_PUBLIC_BASE_URL="/uploads"
```

## Что проверено автоматически

- `npm run lint` — OK
- `npm run build` — OK (см. отчёт в чате)
- docker/migrate/seed — по результатам команд

## Что не проверено в браузере агентом

- Полный smoke: редактор, save/reopen, image in article, media page UI.
- Upload без login, forbidden file types — логика в коде, нужна ручная проверка.

## Риски

- `public/uploads` на VPS нужно бэкапить отдельно или перейти на object storage.
- TipTap bundle увеличивает размер admin routes (не публичных).
- EPERM Prisma generate на Windows при занятом dev server.
- Санитизация не заменяет CSP на публичном рендере (этап блога впереди).

## Следующие шаги

1. Этап 5: публичный `/blog` с рендером `contentHtml`.
2. RSS, sitemap entries для постов.
3. Опционально: cover image picker, delete media, S3 provider.

## Ручной чеклист

- [ ] TipTap: абзац, H2, H3, bold, list, link — save/reopen
- [ ] Upload JPG/WebP, картинка в статье после reopen
- [ ] `/admin/media` показывает asset
- [ ] Файл в `public/uploads/media/YYYY/MM/`
- [ ] SVG/txt upload → ошибка
- [ ] Upload без cookie → 401
