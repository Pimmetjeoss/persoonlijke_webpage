#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${SEO_ENV_FILE:-$ROOT_DIR/.env.local}"
DEFAULT_DATASET="code_lieshout_bot_visits"

backup_if_exists() {
  if [[ -f "$ENV_FILE" ]]; then
    local stamp
    stamp="$(date +%Y%m%d-%H%M%S)"
    cp "$ENV_FILE" "$ENV_FILE.backup-$stamp"
    chmod 600 "$ENV_FILE.backup-$stamp"
    echo "Backup gemaakt: $ENV_FILE.backup-$stamp"
  fi
}

escape_env_value() {
  # Shell-safe single-quoted env value.
  printf "%s" "$1" | sed "s/'/'\\''/g"
}

upsert_env() {
  local key="$1"
  local value="$2"
  local escaped
  escaped="$(escape_env_value "$value")"
  touch "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  if grep -qE "^${key}=" "$ENV_FILE"; then
    python3 - "$ENV_FILE" "$key" "$escaped" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
key = sys.argv[2]
value = sys.argv[3]
lines = path.read_text().splitlines()
out = []
for line in lines:
    if line.startswith(f"{key}="):
        out.append(f"{key}='{value}'")
    else:
        out.append(line)
path.write_text("\n".join(out) + "\n")
PY
  else
    printf "%s='%s'\n" "$key" "$escaped" >> "$ENV_FILE"
  fi
}

echo "Cloudflare bot analytics configureren voor: $ROOT_DIR"
echo "De token wordt verborgen ingevoerd en opgeslagen in: $ENV_FILE"
echo "Dit bestand staat in .gitignore en krijgt permissies 600."
echo "Let op: plak de token hier in de terminal, niet in Discord."
echo

if [[ -n "${CLOUDFLARE_API_TOKEN:-${CF_API_TOKEN:-}}" ]]; then
  API_TOKEN="${CLOUDFLARE_API_TOKEN:-$CF_API_TOKEN}"
  echo "Gebruik Cloudflare token uit huidige environment."
else
  read -r -s -p "Plak Cloudflare API token: " API_TOKEN
  echo
fi

if [[ -z "${API_TOKEN// }" ]]; then
  echo "Geen token ingevoerd; niets gewijzigd." >&2
  exit 1
fi

DEFAULT_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-${CF_ACCOUNT_ID:-}}"
if [[ -n "$DEFAULT_ACCOUNT_ID" ]]; then
  read -r -p "Cloudflare Account ID [$DEFAULT_ACCOUNT_ID]: " ACCOUNT_ID
  ACCOUNT_ID="${ACCOUNT_ID:-$DEFAULT_ACCOUNT_ID}"
else
  read -r -p "Cloudflare Account ID: " ACCOUNT_ID
fi

if [[ -z "${ACCOUNT_ID// }" ]]; then
  echo "Geen Account ID ingevoerd; niets gewijzigd." >&2
  echo "Je vindt hem in Cloudflare rechts bij je domein onder Account ID." >&2
  exit 1
fi

read -r -p "Analytics Engine dataset [$DEFAULT_DATASET]: " DATASET
DATASET="${DATASET:-$DEFAULT_DATASET}"

backup_if_exists
mkdir -p "$(dirname "$ENV_FILE")"

upsert_env "CLOUDFLARE_API_TOKEN" "$API_TOKEN"
upsert_env "CF_API_TOKEN" "$API_TOKEN"
upsert_env "CLOUDFLARE_ACCOUNT_ID" "$ACCOUNT_ID"
upsert_env "CF_ACCOUNT_ID" "$ACCOUNT_ID"
upsert_env "CLOUDFLARE_AE_DATASET" "$DATASET"
upsert_env "CF_AE_DATASET" "$DATASET"
upsert_env "SEO_BOT_DAYS" "${SEO_BOT_DAYS:-30}"

chmod 600 "$ENV_FILE"

echo
echo "Klaar. Geschreven naar $ENV_FILE met permissies 600."
echo "Token wordt niet geprint. Ingestelde variabelen:"
echo "- CLOUDFLARE_API_TOKEN / CF_API_TOKEN"
echo "- CLOUDFLARE_ACCOUNT_ID / CF_ACCOUNT_ID"
echo "- CLOUDFLARE_AE_DATASET / CF_AE_DATASET"
echo "- SEO_BOT_DAYS"
echo
echo "Testen kan met:"
echo "  npm run seo:update:env"
