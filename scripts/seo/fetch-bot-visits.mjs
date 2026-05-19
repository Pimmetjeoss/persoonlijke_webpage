#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import path from "node:path";
import { SEO_DATA_DIR } from "./config.mjs";
import { writeJson } from "./lib.mjs";

const CLOUDFLARE_SQL_ENDPOINT = (accountId) => `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;
const SNAPSHOT_PATH = path.join(SEO_DATA_DIR, "snapshots", "bot-visits-latest.json");

function mockSnapshot() {
  const now = new Date();
  const recent = [
    { timestamp: now.toISOString(), botName: "GPTBot", family: "openai", path: "/robots.txt", userAgent: "GPTBot/1.2", country: "US", count: 7 },
    { timestamp: new Date(now.getTime() - 36e5).toISOString(), botName: "ClaudeBot", family: "anthropic", path: "/ai-agents", userAgent: "ClaudeBot/1.0", country: "US", count: 3 },
    { timestamp: new Date(now.getTime() - 7_200_000).toISOString(), botName: "PerplexityBot", family: "perplexity", path: "/blog", userAgent: "PerplexityBot/1.0", country: "NL", count: 5 },
  ];
  return {
    status: "ok",
    generatedAt: now.toISOString(),
    source: "mock",
    message: "Mock AI crawler data; vervang door live data.",
    data: { recent },
  };
}

function buildSql(dataset, days) {
  const safeDataset = dataset.replace(/[^a-zA-Z0-9_]/g, "");
  const safeDays = Math.max(1, Math.min(365, Number.parseInt(String(days), 10) || 30));
  return `
SELECT
  blob1 AS botName,
  blob2 AS family,
  blob3 AS path,
  blob5 AS country,
  blob6 AS userAgent,
  SUM(_sample_interval) AS count,
  MAX(timestamp) AS timestamp
FROM ${safeDataset}
WHERE timestamp >= NOW() - INTERVAL '${safeDays}' DAY
GROUP BY botName, family, path, country, userAgent
ORDER BY timestamp DESC
LIMIT 1000`;
}

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function classifyFromPath(pathname = "") {
  if (/robots\.txt/i.test(pathname)) return { botName: "Robots.txt crawler", family: "crawler" };
  if (/sitemap\.xml/i.test(pathname)) return { botName: "Sitemap crawler", family: "crawler" };
  return { botName: "Vercel logged crawler", family: "vercel" };
}

function parseBotVisitMessage(log) {
  const candidates = [];
  if (typeof log.message === "string") candidates.push(log.message);
  for (const entry of Array.isArray(log.logs) ? log.logs : []) {
    if (typeof entry?.message === "string") candidates.push(entry.message);
  }

  for (const message of candidates) {
    const index = message.indexOf("[bot-visit]");
    if (index === -1) continue;
    const jsonStart = message.indexOf("{", index);
    if (jsonStart === -1) continue;
    try {
      const parsed = JSON.parse(message.slice(jsonStart));
      return {
        timestamp: new Date(log.timestamp || Date.now()).toISOString(),
        botName: parsed.botName || "Other crawler",
        family: parsed.family || "other",
        path: parsed.path || log.requestPath || "/",
        userAgent: parsed.userAgent || undefined,
        country: parsed.country || undefined,
        count: 1,
      };
    } catch {
      // Continue with other log fragments.
    }
  }
  return null;
}

function fetchVercelLogRows() {
  const since = process.env.SEO_BOT_SINCE || `${process.env.SEO_BOT_DAYS || process.env.SEO_DAYS || "30"}d`;
  const target = process.env.VERCEL_LOG_TARGET || process.env.SEO_DOMAIN || "code-lieshout.nl";
  const env = { ...process.env, HOME: process.env.VERCEL_HOME || "/home/pimmetje" };
  const output = execFileSync("vercel", ["logs", target, "--since", since, "--json", "--no-color"], {
    encoding: "utf8",
    env,
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 10 * 1024 * 1024,
  });

  const rows = [];
  for (const line of output.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("{")) continue;
    let log;
    try {
      log = JSON.parse(trimmed);
    } catch {
      continue;
    }

    const explicitBot = parseBotVisitMessage(log);
    if (explicitBot) {
      rows.push(explicitBot);
      continue;
    }

    // Vercel request logs do not expose user-agent. Until the middleware has
    // collected explicit bot logs, count crawler-only discovery endpoints as
    // useful crawl activity so the dashboard stays live without Cloudflare.
    if (/\/(robots\.txt|sitemap\.xml)$/i.test(log.requestPath || "")) {
      const classified = classifyFromPath(log.requestPath);
      rows.push({
        timestamp: new Date(log.timestamp || Date.now()).toISOString(),
        ...classified,
        path: log.requestPath,
        userAgent: undefined,
        country: undefined,
        count: 1,
      });
    }
  }

  return {
    status: "ok",
    generatedAt: new Date().toISOString(),
    source: "vercel-logs",
    message: rows.length
      ? "Bot/crawler activiteit opgehaald uit Vercel logs. User-agent details komen mee zodra de nieuwe middleware live is."
      : "Vercel logs opgehaald; nog geen bot/crawler hits gevonden in de gekozen periode.",
    data: { recent: rows },
  };
}

async function fetchAnalyticsEngineRows() {
  const accountId = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  const dataset = process.env.CF_AE_DATASET || process.env.CLOUDFLARE_AE_DATASET || "code_lieshout_bot_visits";
  const days = process.env.SEO_BOT_DAYS || process.env.SEO_DAYS || "30";

  if (!accountId || !apiToken) {
    return {
      status: "unavailable",
      generatedAt: new Date().toISOString(),
      source: "cloudflare-analytics-engine",
      message: "Cloudflare credentials ontbreken. Zet CF_ACCOUNT_ID en CF_API_TOKEN om live bot visits op te halen.",
      data: { recent: [] },
    };
  }

  const response = await fetch(CLOUDFLARE_SQL_ENDPOINT(accountId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "text/plain;charset=UTF-8",
    },
    body: buildSql(dataset, days),
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      status: "error",
      generatedAt: new Date().toISOString(),
      source: "cloudflare-analytics-engine",
      message: `Cloudflare Analytics Engine SQL faalde: ${response.status} ${text.slice(0, 240)}`,
      data: { recent: [] },
    };
  }

  return {
    status: "ok",
    generatedAt: new Date().toISOString(),
    source: "cloudflare-analytics-engine",
    data: { recent: parseNdjson(text) },
  };
}

async function fetchLiveSnapshot() {
  const preferredSource = process.env.SEO_BOT_SOURCE || "auto";
  if (preferredSource === "vercel") return fetchVercelLogRows();
  if (preferredSource === "cloudflare") return fetchAnalyticsEngineRows();

  const cloudflareSnapshot = await fetchAnalyticsEngineRows();
  if (cloudflareSnapshot.status === "ok") return cloudflareSnapshot;

  try {
    const vercelSnapshot = fetchVercelLogRows();
    return {
      ...vercelSnapshot,
      fallbackFrom: cloudflareSnapshot.source,
      message: `${vercelSnapshot.message} Cloudflare fallback reden: ${cloudflareSnapshot.message}`,
    };
  } catch (error) {
    return cloudflareSnapshot.status === "unavailable" ? {
      status: "unavailable",
      generatedAt: new Date().toISOString(),
      source: "vercel-logs",
      message: `Geen Cloudflare credentials en Vercel logs ophalen faalde: ${error?.message || error}`,
      data: { recent: [] },
    } : cloudflareSnapshot;
  }
}

async function main() {
  const snapshot = process.env.SEO_BOT_MOCK === "1" ? mockSnapshot() : await fetchLiveSnapshot();
  await writeJson(SNAPSHOT_PATH, snapshot);
  const rows = snapshot.data?.recent?.length || 0;
  console.log(`Bot visits snapshot: ${snapshot.status} (${rows} rows) via ${snapshot.source} -> ${SNAPSHOT_PATH}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
