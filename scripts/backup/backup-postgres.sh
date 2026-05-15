#!/usr/bin/env bash
# Резервная копия PostgreSQL для CRM Flow24.
# Пароль не хранить в скрипте — задайте DATABASE_URL или PGPASSWORD в окружении/cron.
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/crmflow24}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
PREFIX="postgres-crmflow24"

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "error: pg_dump not found. Install postgresql-client." >&2
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "error: DATABASE_URL is not set." >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
OUT_FILE="$BACKUP_DIR/${PREFIX}-${TIMESTAMP}.sql.gz"

pg_dump "$DATABASE_URL" | gzip -9 > "$OUT_FILE"
echo "backup created: $OUT_FILE"

find "$BACKUP_DIR" -name "${PREFIX}-*.sql.gz" -type f -mtime +"$RETENTION_DAYS" -delete
