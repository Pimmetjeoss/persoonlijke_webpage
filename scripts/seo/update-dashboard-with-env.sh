#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${SEO_ENV_FILE:-$ROOT_DIR/.env.local}"
LOG_DIR="$ROOT_DIR/data/seo"
LOG_FILE="$LOG_DIR/update-seo-dashboard.log"

cd "$ROOT_DIR"
mkdir -p "$LOG_DIR"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
else
  echo "Env bestand niet gevonden: $ENV_FILE" >&2
  echo "Maak hem eerst met: npm run seo:config:cloudflare" >&2
  exit 1
fi

{
  echo "===== SEO dashboard update $(date --iso-8601=seconds) ====="
  npm run seo:update
  echo "===== klaar $(date --iso-8601=seconds) ====="
} 2>&1 | tee -a "$LOG_FILE"
