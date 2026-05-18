import fs from "node:fs";
import path from "node:path";

export const REPO_ROOT = process.cwd();

function loadLocalEnv() {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadLocalEnv();

export const SEO_DATA_DIR = process.env.SEO_DATA_DIR || path.join(REPO_ROOT, "data", "seo");
export const PUBLIC_DASHBOARD_DIR = path.join(REPO_ROOT, "public", "data", "seo-dashboard");

export const DEFAULTS = {
  site: process.env.SEO_GSC_SITE || "sc-domain:code-lieshout.nl",
  url: process.env.SEO_URL || "https://code-lieshout.nl/",
  origin: process.env.SEO_ORIGIN || "https://code-lieshout.nl",
  pages: (process.env.SEO_PAGES || "https://code-lieshout.nl/")
    .split(",")
    .map((page) => page.trim())
    .filter(Boolean),
  days: Number.parseInt(process.env.SEO_DAYS || "180", 10),
  period: process.env.SEO_PERIOD || "28d",
  limit: Number.parseInt(process.env.SEO_LIMIT || "50", 10),
  ga4Property: process.env.SEO_GA4_PROPERTY || "526910157",
  gscCli:
    process.env.SEO_GSC_CLI ||
    "/home/pimmetje/.hermes/profiles/seo/home/.local/bin/google-search-console-pp-cli",
  gscHome: process.env.SEO_GSC_HOME || "/home/pimmetje/.hermes/profiles/seo/home",
  ga4Command: process.env.SEO_GA4_COMMAND || "",
  pagespeedApiKey: process.env.SEO_PAGESPEED_API_KEY || process.env.PAGESPEED_API_KEY || "",
  cruxApiKey: process.env.SEO_CRUX_API_KEY || process.env.CRUX_API_KEY || process.env.SEO_PAGESPEED_API_KEY || process.env.PAGESPEED_API_KEY || "",
  gbpCommand: process.env.SEO_GBP_COMMAND || "",
  gbpLocation: process.env.SEO_GBP_LOCATION || "",
};

export const GSC_WORKFLOWS = [
  {
    id: "sync",
    label: "Sync",
    args: ({ site, days }) => [
      "sync",
      "--site",
      site,
      "--last",
      `${days}d`,
      "--dimensions",
      "date,query,page",
      "--with-sitemaps",
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "quickWins",
    label: "Quick wins",
    args: ({ site, limit }) => [
      "quick-wins",
      site,
      "--position",
      "8-20",
      "--min-imps",
      "1",
      "--top",
      String(limit),
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "cannibalization",
    label: "Cannibalization",
    args: ({ site, limit }) => [
      "cannibalization",
      site,
      "--min-imps",
      "1",
      "--top",
      String(limit),
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "compare",
    label: "Compare",
    args: ({ site, period, limit }) => [
      "compare",
      site,
      "--period",
      period,
      "--vs",
      "prev-period",
      "--dim",
      "query",
      "--top",
      String(limit),
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "decaying",
    label: "Decaying",
    args: ({ site, limit }) => [
      "decaying",
      site,
      "--window",
      "90d",
      "--min-imps",
      "1",
      "--top",
      String(limit),
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "newQueries",
    label: "New queries",
    args: ({ site, period, limit }) => [
      "new-queries",
      site,
      "--since",
      period,
      "--min-imps",
      "1",
      "--top",
      String(limit),
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "cliff",
    label: "Traffic cliffs",
    args: ({ site }) => [
      "cliff",
      site,
      "--metric",
      "clicks",
      "--threshold",
      "-20%",
      "--window",
      "14d",
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "outliers",
    label: "CTR outliers",
    args: ({ site, limit }) => [
      "outliers",
      site,
      "--top",
      String(limit),
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "sitemapWatch",
    label: "Sitemap watch",
    args: ({ site }) => [
      "sitemap-watch",
      site,
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
  {
    id: "coverageDrift",
    label: "Coverage drift",
    args: ({ site, period }) => [
      "coverage-drift",
      site,
      "--days",
      String(Math.max(1, Number.parseInt(period, 10) || 30)),
      "--json",
      "--no-input",
      "--no-color",
      "--yes",
    ],
  },
];
