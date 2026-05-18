#!/usr/bin/env node
import path from "node:path";
import { DEFAULTS, SEO_DATA_DIR } from "./config.mjs";
import { sanitizeText, timestamp, writeJson } from "./lib.mjs";

const API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const STRATEGIES = ["mobile", "desktop"];

async function fetchJson(url) {
  const response = await fetch(url);
  const text = await response.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: sanitizeText(text).slice(0, 4000) }; }
  return { ok: response.ok, status: response.status, json, text };
}

function endpoint(page, strategy) {
  const url = new URL(API);
  url.searchParams.set("url", page);
  url.searchParams.set("strategy", strategy);
  for (const category of CATEGORIES) url.searchParams.append("category", category);
  if (DEFAULTS.pagespeedApiKey) url.searchParams.set("key", DEFAULTS.pagespeedApiKey);
  return url;
}

async function main() {
  const runId = timestamp();
  const rawRoot = path.join(SEO_DATA_DIR, "raw", "pagespeed");
  const pages = DEFAULTS.pages.length ? DEFAULTS.pages : [DEFAULTS.url];
  const results = [];

  for (const page of pages) {
    for (const strategy of STRATEGIES) {
      const requestUrl = endpoint(page, strategy);
      const result = await fetchJson(requestUrl);
      const payload = {
        source: "pagespeed",
        page,
        strategy,
        generatedAt: new Date().toISOString(),
        ok: result.ok,
        statusCode: result.status,
        data: result.ok ? result.json : null,
        error: result.ok ? null : sanitizeText(result.json?.error?.message || result.text).slice(0, 1200),
      };
      results.push(payload);
      await writeJson(path.join(rawRoot, strategy, `${encodeURIComponent(page)}.${runId}.json`), payload);
      console.log(`PageSpeed ${strategy} ${page}: ${payload.ok ? "ok" : "unavailable"}`);
    }
  }

  const okCount = results.filter((item) => item.ok).length;
  const snapshot = {
    source: "pagespeed",
    status: okCount === results.length ? "ok" : okCount ? "partial" : "unavailable",
    generatedAt: new Date().toISOString(),
    pages,
    rows: results.length,
    results,
    message: okCount ? undefined : "PageSpeed Insights data is unavailable. Set SEO_PAGESPEED_API_KEY if quota/auth is required.",
  };
  await writeJson(path.join(SEO_DATA_DIR, "snapshots", "pagespeed-latest.json"), snapshot);
}

main().catch((error) => {
  console.error(sanitizeText(error?.message || error));
  process.exit(1);
});
