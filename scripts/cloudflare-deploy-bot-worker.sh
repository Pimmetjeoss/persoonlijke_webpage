#!/usr/bin/env bash
set -euo pipefail

# Safely test and deploy the Cloudflare bot logger Worker without storing the token.
# The token is only kept in this shell process and is cleared when the script exits.

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

ENV_FILE="${SEO_ENV_FILE:-$PROJECT_ROOT/.env.local}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  printf '\nCloudflare API token plakken. Je ziet niets tijdens het typen/plakken; dat hoort zo.\n'
  printf 'Token: '
  IFS= read -r -s CLOUDFLARE_API_TOKEN
  printf '\n'
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Geen token ingevoerd en niet gevonden in $ENV_FILE. Gestopt."
  exit 1
fi

export CLOUDFLARE_API_TOKEN

echo "\n1/3 Cloudflare login/token check..."
npx wrangler whoami

echo "\n2/3 Dry-run deploy check..."
npx wrangler deploy --dry-run --config workers/bot-logger/wrangler.toml

printf '\n3/3 Live deploy uitvoeren? Typ exact DEPLOY en druk Enter: '
IFS= read -r CONFIRM
if [[ "$CONFIRM" != "DEPLOY" ]]; then
  echo "Live deploy overgeslagen. Token is niet opgeslagen."
  exit 0
fi

echo "\nDeployen naar Cloudflare..."
npm run cf:bot-worker:deploy

echo "\nKlaar. Token is niet opgeslagen en wordt nu uit deze shell verwijderd."
