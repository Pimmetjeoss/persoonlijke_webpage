#!/usr/bin/env node
import path from "node:path";
import { DEFAULTS, SEO_DATA_DIR } from "./config.mjs";
import { sanitizeText, timestamp, writeJson } from "./lib.mjs";

const API = "https://chromeuxreport.googleapis.com/v1/records:queryRecord";

async function queryCrux(formFactor) {
  const url = new URL(API);
  if (DEFAULTS.cruxApiKey) url.searchParams.set("key", DEFAULTS.cruxApiKey);
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ origin: DEFAULTS.origin, formFactor }),
  });
  const text = await response.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: sanitizeText(text).slice(0, 4000) }; }
  return { ok: response.ok, status: response.status, json, text };
}

async function main() {
  const runId = timestamp();
  const rawRoot = path.join(SEO_DATA_DIR, "raw", "crux");

  if (!DEFAULTS.cruxApiKey) {
    const snapshot = {
      source: "crux",
      status: "unavailable",
      generatedAt: new Date().toISOString(),
      origin: DEFAULTS.origin,
      message: "SEO_CRUX_API_KEY or SEO_PAGESPEED_API_KEY is not configured. PageSpeed may still expose limited field data when available.",
      results: [],
    };
    await writeJson(path.join(rawRoot, `${runId}.json`), snapshot);
    await writeJson(path.join(SEO_DATA_DIR, "snapshots", "crux-latest.json"), snapshot);
    console.log("CrUX unavailable: API key not configured");
    return;
  }

  const results = [];
  for (const formFactor of ["PHONE", "DESKTOP"]) {
    const result = await queryCrux(formFactor);
    const payload = {
      source: "crux",
      origin: DEFAULTS.origin,
      formFactor,
      generatedAt: new Date().toISOString(),
      ok: result.ok,
      statusCode: result.status,
      data: result.ok ? result.json : null,
      error: result.ok ? null : sanitizeText(result.json?.error?.message || result.text).slice(0, 1200),
    };
    results.push(payload);
    await writeJson(path.join(rawRoot, formFactor.toLowerCase(), `${runId}.json`), payload);
    console.log(`CrUX ${formFactor}: ${payload.ok ? "ok" : "unavailable"}`);
  }

  const okCount = results.filter((item) => item.ok).length;
  const snapshot = {
    source: "crux",
    status: okCount === results.length ? "ok" : okCount ? "partial" : "unavailable",
    generatedAt: new Date().toISOString(),
    origin: DEFAULTS.origin,
    results,
    message: okCount ? undefined : "CrUX API returned no usable field data for this origin.",
  };
  await writeJson(path.join(SEO_DATA_DIR, "snapshots", "crux-latest.json"), snapshot);
}

main().catch((error) => {
  console.error(sanitizeText(error?.message || error));
  process.exit(1);
});
