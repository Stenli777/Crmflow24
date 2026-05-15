#!/usr/bin/env bash
# Архив каталога uploads (медиа блога).
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/crmflow24}"
UPLOADS_DIR="${UPLOADS_DIR:-/var/www/shared/crmflow24/uploads}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
PREFIX="uploads-crmflow24"

if [[ ! -d "$UPLOADS_DIR" ]]; then
  echo "error: uploads directory not found: $UPLOADS_DIR" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
OUT_FILE="$BACKUP_DIR/${PREFIX}-${TIMESTAMP}.tar.gz"

tar -czf "$OUT_FILE" -C "$UPLOADS_DIR" .
echo "backup created: $OUT_FILE"

find "$BACKUP_DIR" -name "${PREFIX}-*.tar.gz" -type f -mtime +"$RETENTION_DAYS" -delete
