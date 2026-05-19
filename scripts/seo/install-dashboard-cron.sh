#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MODE="${1:-daily}"
TIME_OF_DAY="${2:-03:15}"
ENV_FILE="${SEO_ENV_FILE:-$ROOT_DIR/.env.local}"
JOB_CMD="cd '$ROOT_DIR' && /usr/bin/env bash scripts/seo/update-dashboard-with-env.sh"
MARKER_START="# code-lieshout seo dashboard cron start"
MARKER_END="# code-lieshout seo dashboard cron end"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env bestand ontbreekt: $ENV_FILE" >&2
  echo "Maak hem eerst met: npm run seo:config:cloudflare" >&2
  exit 1
fi

if [[ ! "$TIME_OF_DAY" =~ ^[0-2][0-9]:[0-5][0-9]$ ]]; then
  echo "Tijd moet HH:MM zijn, bijvoorbeeld 03:15" >&2
  exit 1
fi

HOUR="${TIME_OF_DAY%%:*}"
MINUTE="${TIME_OF_DAY##*:}"
HOUR="$((10#$HOUR))"
MINUTE="$((10#$MINUTE))"

case "$MODE" in
  daily)
    SCHEDULE="$MINUTE $HOUR * * *"
    ;;
  every-2-days)
    SCHEDULE="$MINUTE $HOUR */2 * *"
    ;;
  every-3-days)
    SCHEDULE="$MINUTE $HOUR */3 * *"
    ;;
  weekly)
    SCHEDULE="$MINUTE $HOUR * * 1"
    ;;
  *)
    echo "Onbekende mode: $MODE" >&2
    echo "Gebruik: daily | every-2-days | every-3-days | weekly" >&2
    exit 1
    ;;
esac

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

# Haal vorige code-lieshout block weg en zet nieuwe block neer.
(crontab -l 2>/dev/null || true) | awk \
  -v start="$MARKER_START" \
  -v end="$MARKER_END" \
  'BEGIN { skip=0 } $0 == start { skip=1; next } $0 == end { skip=0; next } skip == 0 { print }' > "$TMP_FILE"

{
  echo "$MARKER_START"
  echo "$SCHEDULE $JOB_CMD"
  echo "$MARKER_END"
} >> "$TMP_FILE"

crontab "$TMP_FILE"

echo "Cron ingesteld: $MODE om $TIME_OF_DAY"
echo "Command: $JOB_CMD"
echo "Log: $ROOT_DIR/data/seo/update-seo-dashboard.log"
