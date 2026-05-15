# PostgreSQL на VPS для CRM Flow24

Staging-БД: `crmflow24_stage`, пользователь `crmflow24_stage_user`.

## Вариант A — PostgreSQL на хосте (без Docker)

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql
```

В `psql`:

```sql
CREATE DATABASE crmflow24_stage;
CREATE USER crmflow24_stage_user WITH ENCRYPTED PASSWORD 'CHANGE_ME';
GRANT ALL PRIVILEGES ON DATABASE crmflow24_stage TO crmflow24_stage_user;
\c crmflow24_stage
GRANT ALL ON SCHEMA public TO crmflow24_stage_user;
ALTER DATABASE crmflow24_stage OWNER TO crmflow24_stage_user;
```

`DATABASE_URL` в `.env`:

```env
DATABASE_URL="postgresql://crmflow24_stage_user:CHANGE_ME@localhost:5432/crmflow24_stage?schema=public"
```

Миграции на сервере (из каталога `site/`):

```bash
npm run db:deploy
```

Первичный admin (один раз, осознанно):

```bash
npm run db:seed
```

## Вариант B — PostgreSQL в Docker (позже)

Локально уже есть `docker-compose.yml` только для dev. Для staging на VPS можно поднять отдельный compose с volume — см. [docker-staging-plan.md](./docker-staging-plan.md).

Не выполнять на production без отдельного решения: `prisma migrate reset`, `dropdb`.
