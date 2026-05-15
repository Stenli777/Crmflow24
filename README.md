# CRM Flow24 (crmflow24.ru)

Лендинг и сайт компании на **Next.js 16** (App Router) + **React 19** + **MUI (Emotion)** + **TypeScript**.

## Стек

| Технология | Назначение |
|------------|------------|
| Next.js    | SSR/SSG, маршруты `app/` |
| React      | UI |
| MUI        | Компоненты и тема |
| TypeScript | типизация |

Это **не** Vite SPA: деплой — Node.js-приложение (`next start`).

## Требования

- **Node.js** 20.x LTS (рекомендуется; совместимо с Next 16)
- **npm** 10+

## Установка

```bash
npm ci
```

Для локальной разработки можно использовать `npm install`.

## Переменные окружения

Секреты в репозиторий не кладём. Шаблон без значений:

```bash
cp .env.example .env.local
```

Сейчас код **не использует** `process.env`: домен и контакты задаются в `src/config/site.ts`. При добавлении интеграций пропишите переменные в `.env.example` и читайте их в коде.

## Локальный запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Production-сборка

```bash
npm run build
npm run start
```

`start` поднимает сервер Next.js (порт по умолчанию **3000**). Для продакшена задайте `PORT` при необходимости.

## Staging / VPS (блог + CMS)

Пошаговый staging: [docs/deploy/staging-vps.md](docs/deploy/staging-vps.md)  
Шаблон env: [.env.staging.example](.env.staging.example)  
Healthcheck: `GET /api/health`

## Деплой на сервер по SSH (Node + PM2)

Общая схема:

1. На сервере: Node 20, `npm`, опционально `pm2`.
2. Клонировать репозиторий (или `git pull`), зайти в каталог с `package.json`.
3. Установить зависимости и собрать:

   ```bash
   npm ci
   npm run build
   ```

4. Запуск под PM2 (пример):

   ```bash
   pm2 start npm --name crmflow24 -- run start
   pm2 save
   ```

5. Перед nginx/Caddy: проксировать на `127.0.0.1:3000` (или порт из `PORT`).

6. После обновлений:

   ```bash
   git pull
   npm ci
   npm run build
   pm2 restart crmflow24
   ```

**Статический export** (`output: 'export'`) в проекте не настроен: используется обычный серверный режим Next.js.

## Полезные команды

| Команда        | Действие        |
|----------------|-----------------|
| `npm run dev`  | разработка      |
| `npm run build`| production build|
| `npm run start`| запуск после build |
| `npm run lint` | ESLint          |

## GitHub

Удалённый репозиторий (пример):

```text
git@github.com:Stenli777/Crmflow24.git
```

Перед коммитами настройте имя и email Git (один раз глобально или только в этом репозитории):

```bash
git config user.name "Ваше имя"
git config user.email "your@email.com"
```

Первый пуш (после `git init` и коммита):

```bash
git remote add origin git@github.com:Stenli777/Crmflow24.git
git branch -M main
git push -u origin main
```

Для SSH-доступа к GitHub нужен добавленный в аккаунт **SSH key**. Если видите `Permission denied (publickey)`, создайте ключ (`ssh-keygen`) и добавьте публичную часть в GitHub → Settings → SSH keys.

## Лицензия

Приватный проект — по усмотрению владельца репозитория.
