# Blog / Admin CMS — Этап 2: session auth и защита /admin

## Что добавлено

- Модель `AdminSession` в Prisma (хеш токена, срок действия, связь с `AdminUser`).
- Утилиты auth: `constants`, `crypto`, `session`, `cookies`, `requireAdmin`, server actions.
- Страница входа `/admin/login` с noindex.
- Защищённый dashboard `/admin` через route group `(protected)`.
- Middleware: редирект на login при отсутствии cookie.
- Документация этапа 2.

**Не реализовано:** TipTap, CRUD статей, upload, VK API, RSS, публичный `/blog`.

## Как работает session auth

1. При успешном логине генерируется случайный token (`crypto.randomBytes`).
2. В БД сохраняется только SHA-256 хеш токена (`AdminSession.tokenHash`).
3. Plain token уходит в httpOnly cookie `crmflow24_admin_session`.
4. Срок сессии — 7 дней (`ADMIN_SESSION_MAX_AGE_DAYS`).
5. При запросе protected-страниц cookie читается server-side, токен хешируется и ищется в БД.
6. Истёкшие сессии удаляются; неактивный admin не допускается.
7. Logout удаляет запись сессии в БД и очищает cookie.

Auth.js / NextAuth **не используются**.

## Двухступенчатая защита

| Уровень | Где | Что проверяет |
|---------|-----|----------------|
| Middleware | Edge | Наличие cookie на `/admin/*` (кроме `/admin/login`) |
| Server layout | Node (SSR) | Валидность сессии в БД через `requireAdmin()` |

Middleware **не ходит в БД** и не импортирует Prisma — только cookie. Это избегает Prisma в Edge Runtime.

Глубокая проверка (срок, активность пользователя) — в `getAdminBySessionToken` / `requireAdmin`.

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `DATABASE_URL` | PostgreSQL |
| `ADMIN_EMAIL` | Email для seed |
| `ADMIN_PASSWORD` | Пароль для seed |
| `AUTH_SECRET` | Зарезервировано для будущих расширений auth |

## Создание admin и вход

```bash
npm run docker:db:up
npm run db:seed
npm run dev
```

Откройте `http://localhost:3000/admin/login` — учётные данные из `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

Выход — кнопка «Выйти» на `/admin` или повторный вызов logout action.

## Структура маршрутов

```
src/app/admin/
  login/page.tsx           → /admin/login
  (protected)/layout.tsx   → requireAdmin + noindex
  (protected)/page.tsx     → /admin (dashboard)
```

Route group `(protected)` не попадает в URL.

## Следующий этап

Этап 3: CRUD статей в админке (список, создание, редактирование) без TipTap или с минимальным редактором по плану.
