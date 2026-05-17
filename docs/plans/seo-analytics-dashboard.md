# SEO Analytics Dashboard Implementation Plan

> **For Hermes:** Implement in small, verified steps on `feat/seo-analytics-dashboard`. Do not deploy and do not print or commit credentials.

**Goal:** Add an interactive SEO/analytics dashboard to the Code Lieshout personal website that combines Google Search Console workflow exports and GA4 organic performance data.

**Architecture:** The website remains a Next.js App Router application. Data fetching is handled by cron-ready local Node scripts that write timestamped raw snapshots under ignored `data/seo/` directories, normalize them into safe public JSON under `public/data/seo-dashboard/`, and the `/seo-dashboard` route renders that JSON client-side with interactive SVG charts, filters, sortable tables, and responsive cards.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Node.js scripts using only built-in modules, Google Search Console Printing Press CLI, and a GA4 adapter prepared for the profile-local Analytics MCP/GA4 export command.

---

## Safety Boundaries

- Read-only data collection only.
- GSC commands are limited to `sync`, `quick-wins`, `cannibalization`, `compare`, `decaying`, `new-queries`, `cliff`, `outliers`, `sitemap-watch`, and `coverage-drift`.
- No GSC write/delete/index/import actions.
- Secrets are never read into logs intentionally and child process output is sanitized before reporting errors.
- `data/seo/raw`, `data/seo/snapshots`, `data/seo/processed`, and local script logs are ignored by git.
- Public dashboard JSON contains only aggregate SEO/analytics metrics and empty-state metadata when source data is unavailable.
- No deployment without explicit permission.

## Routes

- `app/seo-dashboard/page.tsx` — server page and metadata for the dashboard.
- `app/seo-dashboard/seo-dashboard-client.tsx` — client-side interactive dashboard.
- `public/data/seo-dashboard/dashboard.json` — generated dashboard payload loaded by the route.

## Dataflow

```text
GSC CLI read-only commands
  -> scripts/seo/fetch-gsc.mjs
  -> data/seo/raw/gsc/<workflow>/<timestamp>.json
  -> data/seo/snapshots/gsc-latest.json

GA4 MCP/export command
  -> scripts/seo/fetch-ga4.mjs
  -> data/seo/raw/ga4/organic/<timestamp>.json
  -> data/seo/snapshots/ga4-latest.json

Raw snapshots + optional historic snapshots
  -> scripts/seo/generate-dashboard-data.mjs
  -> data/seo/processed/dashboard.<timestamp>.json
  -> public/data/seo-dashboard/dashboard.json

One-shot cron wrapper
  -> scripts/seo/update-seo-dashboard.mjs
```

## Scripts

### `scripts/seo/config.mjs`

Centralizes defaults:

- `SEO_GSC_SITE` default: `sc-domain:code-lieshout.nl`
- `SEO_DAYS` default: `180`
- `SEO_PERIOD` default: `28d`
- `SEO_GSC_CLI` default: profile-local `google-search-console-pp-cli` with PATH fallback
- `SEO_GA4_PROPERTY` default: `526910157`
- `SEO_GA4_COMMAND` optional command template for Analytics MCP/GA4 export integration

### `scripts/seo/fetch-gsc.mjs`

Runs read-only GSC workflows and stores each workflow as a timestamped raw JSON snapshot. Missing commands/data produce safe status records rather than crashing the whole run.

### `scripts/seo/fetch-ga4.mjs`

Runs a configurable GA4 organic export command. The command can wrap the existing official Analytics MCP server or a local GA4 export script. If unavailable, it writes a clear unavailable snapshot so the dashboard shows empty states.

### `scripts/seo/generate-dashboard-data.mjs`

Normalizes raw snapshots into one stable `SeoDashboardData` payload: executive summary, GSC workflow tables, GA4 trend/landing page/events data, source status, warnings, and generated mock-free empty states.

### `scripts/seo/update-seo-dashboard.mjs`

Cron-ready orchestration script:

1. Fetch GSC data.
2. Fetch GA4 data.
3. Generate dashboard JSON.
4. Exit non-zero only for processing failures that would leave invalid dashboard data.

## Cron Proposal

System cron, daily 06:10:

```cron
10 6 * * * cd /home/pimmetje/workspace/persoonlijke_webpage && /usr/bin/env SEO_DAYS=180 npm run seo:update >> data/seo/seo-cron.log 2>&1
```

Weekly deeper refresh, Sundays 06:40:

```cron
40 6 * * 0 cd /home/pimmetje/workspace/persoonlijke_webpage && /usr/bin/env SEO_DAYS=480 SEO_PERIOD=90d npm run seo:update >> data/seo/seo-cron-weekly.log 2>&1
```

Hermes cron alternative, not enabled without permission:

```bash
hermes cron create '0 6 * * *' \
  --name 'Code Lieshout SEO Dashboard Refresh' \
  --workdir /home/pimmetje/workspace/persoonlijke_webpage \
  --script seo_dashboard_update.sh \
  --no-agent
```

## Test Plan

1. Install dependencies with `npm install`.
2. Run script unit tests with `npm run test`.
3. Run lint with `npm run lint`.
4. Run typecheck with `npm run typecheck`.
5. Generate dashboard data with `npm run seo:generate` and validate JSON.
6. If credentials/commands are available, run `npm run seo:fetch:gsc`, `npm run seo:fetch:ga4`, then `npm run seo:update`.
7. Build production app with `npm run build`.
8. Start local dev server with `npm run dev`.
9. Browser-check `/seo-dashboard`: visual layout, tables, hover tooltips, filters, sorting, responsive behavior, and console errors.
10. Confirm no secrets are present in git diff or generated public JSON.

## Implementation Tasks

1. Add `.gitignore` entries for local SEO raw/processed data and logs.
2. Add TypeScript dashboard data types and a checked-in safe starter payload.
3. Add Node data scripts for GSC fetch, GA4 fetch, normalization, and orchestration.
4. Add node:test coverage for normalization helpers and table sorting/filtering helpers where practical.
5. Add `seo:*`, `test`, and `typecheck` package scripts.
6. Build `/seo-dashboard` route using existing Code Lieshout typography, green/black palette, sticky header style, and responsive cards.
7. Run validation commands and browser verification.
