#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${SEO_ENV_FILE:-$ROOT_DIR/.env.local}"

backup_if_exists() {
  if [[ -f "$ENV_FILE" ]]; then
    local stamp
    stamp="$(date +%Y%m%d-%H%M%S)"
    cp "$ENV_FILE" "$ENV_FILE.backup-$stamp"
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

echo "Google SEO API key configureren voor: $ROOT_DIR"
echo "De key wordt verborgen ingevoerd en opgeslagen in: $ENV_FILE"
echo "Let op: plak de key hier in de terminal, niet in Discord."
echo

if [[ -n "${SEO_GOOGLE_API_KEY:-}" ]]; then
  API_KEY="$SEO_GOOGLE_API_KEY"
  echo "Gebruik SEO_GOOGLE_API_KEY uit huidige environment."
else
  read -r -s -p "Plak Google API key: " API_KEY
  echo
fi

if [[ -z "${API_KEY// }" ]]; then
  echo "Geen key ingevoerd; niets gewijzigd." >&2
  exit 1
fi

backup_if_exists
mkdir -p "$(dirname "$ENV_FILE")"

# Deze key wordt door de dashboard scripts gebruikt voor PageSpeed en CrUX.
upsert_env "SEO_PAGESPEED_API_KEY" "$API_KEY"
upsert_env "SEO_CRUX_API_KEY" "$API_KEY"

# Handig voor toekomstige Places/local SEO integratie; huidig dashboard gebruikt nog SEO_GBP_COMMAND voor GBP.
upsert_env "SEO_PLACES_API_KEY" "$API_KEY"

# Site defaults expliciet vastleggen, zonder secrets.
upsert_env "SEO_URL" "${SEO_URL:-https://code-lieshout.nl/}"
upsert_env "SEO_ORIGIN" "${SEO_ORIGIN:-https://code-lieshout.nl}"
upsert_env "SEO_PAGES" "${SEO_PAGES:-https://code-lieshout.nl/}"

echo
echo "Klaar. Geschreven naar $ENV_FILE met permissies 600."
echo "Ingestelde variabelen:"
echo "- SEO_PAGESPEED_API_KEY"
echo "- SEO_CRUX_API_KEY"
echo "- SEO_PLACES_API_KEY"
echo "- SEO_URL / SEO_ORIGIN / SEO_PAGES"
echo
echo "Testen kan met:"
echo "  set -a; source '$ENV_FILE'; set +a; npm run seo:fetch:pagespeed && npm run seo:fetch:crux && npm run seo:generate"
