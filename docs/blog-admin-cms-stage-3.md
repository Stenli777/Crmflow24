# Blog / Admin CMS — Этап 3: CRUD каркас в админке

## Что добавлено

- Навигация админки: Панель, Статьи, Категории, Теги.
- CRUD категорий, тегов и статей через server actions.
- Slug helper с транслитерацией кириллицы и уникализацией.
- Формы на MUI + `useActionState` для ошибок.
- SEO, OG, schema, CTA, VK-поля, FAQ (до 5), related services (до 5), related posts.
- Фильтры списка статей по статусу и категории.

## Admin routes

| URL | Назначение |
|-----|------------|
| `/admin` | Панель |
| `/admin/posts` | Список статей |
| `/admin/posts/new` | Новая статья |
| `/admin/posts/[id]` | Редактирование |
| `/admin/categories` | Список категорий |
| `/admin/categories/new` | Новая категория |
| `/admin/categories/[id]` | Редактирование |
| `/admin/tags` | Список тегов |
| `/admin/tags/new` | Новый тег |
| `/admin/tags/[id]` | Редактирование |

Route group `(protected)` не попадает в URL.

## CRUD actions

- `src/lib/admin/categories/actions.ts` — create, update, delete
- `src/lib/admin/tags/actions.ts` — create, update, delete
- `src/lib/admin/posts/actions.ts` — create, update, delete

Все mutations вызывают `await requireAdmin()`.

## Slug

- `src/lib/slug.ts` — `slugify()`
- `src/lib/admin/slug-unique.ts` — `ensureUniqueSlug()`, `resolveSlugFromForm()`

Примеры:

- «Внедрение Битрикс24 под ключ» → `vnedrenie-bitriks24-pod-klyuch`
- «CRM + телефония» → `crm-telefoniya`

При коллизии добавляется суффикс `-2`, `-3`, …

## Временные ограничения

- Контент: textarea `contentHtml` (без TipTap).
- Нет загрузки изображений / медиаменеджера.
- Нет публичного `/blog`, RSS, VK API.

## Ручная проверка

```bash
npm run docker:db:up
npm run db:migrate
npm run db:seed
npm run dev
```

1. Войти в `/admin/login`.
2. Создать категорию «Битрикс24», проверить slug.
3. Создать тег «CRM».
4. Создать статью (DRAFT) с FAQ и related service.
5. Опубликовать (PUBLISHED), проверить `publishedAt`.
6. Попробовать удалить категорию/тег со статьёй — должна быть ошибка.

## Следующий этап

Этап 4: TipTap, `contentJson`, загрузка изображений (storageProvider).
