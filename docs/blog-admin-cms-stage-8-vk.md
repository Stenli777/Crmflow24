# Этап 8 — ручная публикация во ВКонтакте

## Что добавлено

- Server-side VK API client (`src/lib/vk/client.ts`)
- Конфиг из env (`src/lib/vk/config.ts`)
- Сборка текста поста (`src/lib/vk/buildVkPost.ts`)
- Server action `publishPostToVkAction` (`src/lib/admin/posts/vkActions.ts`)
- Панель в админке на странице редактирования статьи (`VkPublishPanel`)
- Enum `DRY_RUN` в `VkPublicationStatus` + логи `VkPublicationLog`

Автопубликации при смене статуса статьи **нет** — только кнопка в админке.

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `VK_ACCESS_TOKEN` | Токен сообщества/пользователя с правом `wall` в группе |
| `VK_GROUP_ID` | ID группы **без** минуса (например `123456`) |
| `VK_API_VERSION` | Версия API (по умолчанию `5.199`) |
| `VK_DRY_RUN` | `true` по умолчанию; реальный API только если `false` |

Реальные значения — только в `.env` на сервере, **не в git**.

## Dry-run

- `VK_DRY_RUN` всё, кроме строки `false`, считается dry-run.
- Токен **не требуется**.
- `wall.post` **не вызывается**.
- Создаётся `VkPublicationLog` со статусом `DRY_RUN`.
- У статьи: `vkStatus=DRY_RUN`, `vkPublishedAt=null`, `vkPostUrl=null`.

## Реальная публикация

1. Задать `VK_ACCESS_TOKEN`, `VK_GROUP_ID`.
2. Установить `VK_DRY_RUN=false`.
3. Статья должна быть `PUBLISHED` с `publishedAt` и публичным URL (`NEXT_PUBLIC_SITE_URL`).
4. Нажать «Опубликовать во ВКонтакте» в админке.

При успехе: `vkStatus=PUBLISHED`, ссылка `https://vk.com/wall-{ownerId}_{postId}`.

## Ограничения

- Draft / archived → отклоняется action.
- Пустой текст поста → ошибка.
- **Загрузка изображения в VK отложена** — в пост идёт текст + ссылка на статью (VK может подтянуть preview).
- Токен не логируется и не попадает в `rawResponse`.

## Проверка локально

```bash
npm run docker:db:up
npm run db:migrate
npm run db:seed
```

В `.env`:

```env
VK_DRY_RUN=true
VK_ACCESS_TOKEN=""
VK_GROUP_ID="123456"
```

1. `/admin/login` → опубликованная статья.
2. Заполнить `vkText`, сохранить.
3. «Проверить VK публикацию (dry-run)».
4. Проверить `vkStatus=DRY_RUN` и запись в логах.

## Риски VK API

- Лимиты и блокировки при частых вызовах.
- Истечение токена → `FAILED` в логе.
- Неверный `VK_GROUP_ID` → ошибка API.
- Не тестировать real publish без явного решения и рабочего токена.
