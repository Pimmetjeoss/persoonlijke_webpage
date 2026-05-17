#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DEFAULTS, PUBLIC_DASHBOARD_DIR, SEO_DATA_DIR } from "./config.mjs";
import { latestByDate, numberFrom, pickNumber, pickString, readJsonIfExists, toArray, writeJson } from "./lib.mjs";

export function normalizeGscRows(value, workflowId) {
  return toArray(value).map((row, index) => {
    const query = pickString(row, ["query", "keys", "keyword", "name"], "");
    const page = pickString(row, ["page", "url", "landingPage", "landing_page"], "");
    const clicks = pickNumber(row, ["clicks", "current_clicks", "clicks_current", "click_delta_abs"], 0);
    const impressions = pickNumber(row, ["impressions", "imps", "current_impressions", "impressions_current"], 0);
    const ctr = pickNumber(row, ["ctr", "current_ctr", "ctr_current"], 0);
    const position = pickNumber(row, ["position", "avg_position", "current_position", "position_current"], 0);
    const deltaClicks = pickNumber(row, ["delta_clicks", "clicks_delta", "click_delta", "clicks_change"], 0);
    const deltaImpressions = pickNumber(row, ["delta_impressions", "impressions_delta", "impressions_change"], 0);
    const opportunity = pickNumber(row, ["opportunity", "upside", "score", "potential_clicks"], Math.max(0, impressions * Math.max(0, 0.08 - ctr)));
    return {
      id: `${workflowId}-${index}`,
      query: query || undefined,
      page: page || undefined,
      metric: pickString(row, ["metric", "type", "status"], workflowId),
      clicks,
      impressions,
      ctr,
      position,
      deltaClicks,
      deltaImpressions,
      opportunity: Math.round(opportunity * 100) / 100,
      issue: pickString(row, ["issue", "reason", "hint", "message", "state"], "") || undefined,
      date: pickString(row, ["date", "detected_at", "lastDownloaded"], "") || undefined,
    };
  });
}

function workflowData(gscSnapshot, id) {
  const workflow = gscSnapshot?.workflows?.[id];
  if (!workflow?.ok) return [];
  return normalizeGscRows(workflow.data, id);
}

function normalizeGa4Trend(ga4Snapshot) {
  const data = ga4Snapshot?.data;
  return toArray(data?.daily_data || data?.trend || data).map((row) => ({
    date: pickString(row, ["date"], ""),
    sessions: pickNumber(row, ["sessions"], 0),
    users: pickNumber(row, ["users", "totalUsers", "total_users"], 0),
    engagementRate: pickNumber(row, ["engagementRate", "engagement_rate"], 0),
    conversions: pickNumber(row, ["conversions", "keyEvents", "eventConversions"], 0),
  })).filter((row) => row.date);
}

function normalizeLandingPages(ga4Snapshot) {
  const data = ga4Snapshot?.data;
  return toArray(data?.top_pages || data?.landingPages || data?.landing_pages || data?.pages).map((row) => ({
    page: pickString(row, ["page", "landing_page", "landingPage"], "/"),
    sessions: pickNumber(row, ["sessions"], 0),
    users: pickNumber(row, ["users", "totalUsers"], 0),
    engagementRate: pickNumber(row, ["engagementRate", "engagement_rate"], 0),
    conversions: pickNumber(row, ["conversions", "keyEvents"], 0),
  }));
}

function normalizeEvents(ga4Snapshot) {
  const data = ga4Snapshot?.data;
  return toArray(data?.events || data?.event_data).map((row) => ({
    name: pickString(row, ["eventName", "name", "event"], "event"),
    count: pickNumber(row, ["eventCount", "count", "events"], 0),
    conversions: pickNumber(row, ["conversions", "keyEvents"], 0),
  }));
}

function buildDateRange(gscSnapshot, ga4Trend) {
  const dates = ga4Trend.map((row) => row.date).filter(Boolean).sort();
  if (dates.length) {
    return { start: dates[0], end: dates.at(-1), label: `${dates[0]} t/m ${dates.at(-1)}` };
  }
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - DEFAULTS.days);
  const startText = start.toISOString().slice(0, 10);
  const endText = end.toISOString().slice(0, 10);
  return { start: startText, end: endText, label: `Laatste ${DEFAULTS.days} dagen` };
}

function sourceInfo(source, snapshot, rowCount) {
  if (!snapshot) return { source, status: "unavailable", detail: "Nog geen snapshot gevonden.", rows: 0 };
  return {
    source,
    status: snapshot.status === "ok" ? "ok" : snapshot.status === "error" ? "error" : "unavailable",
    generatedAt: snapshot.generatedAt,
    detail: snapshot.message || snapshot.error || undefined,
    rows: rowCount,
  };
}

export function buildDashboardData({ gscSnapshot, ga4Snapshot }) {
  const gsc = {
    quickWins: workflowData(gscSnapshot, "quickWins"),
    cannibalization: workflowData(gscSnapshot, "cannibalization"),
    compare: workflowData(gscSnapshot, "compare"),
    decaying: workflowData(gscSnapshot, "decaying"),
    newQueries: workflowData(gscSnapshot, "newQueries"),
    cliff: workflowData(gscSnapshot, "cliff"),
    outliers: workflowData(gscSnapshot, "outliers"),
    sitemapWatch: workflowData(gscSnapshot, "sitemapWatch"),
    coverageDrift: workflowData(gscSnapshot, "coverageDrift"),
  };

  const ga4Trend = latestByDate(normalizeGa4Trend(ga4Snapshot), (row) => row.date).reverse();
  const landingPages = normalizeLandingPages(ga4Snapshot);
  const events = normalizeEvents(ga4Snapshot);
  const totals = ga4Snapshot?.data?.totals || {};
  const totalSessions = numberFrom(totals.sessions, ga4Trend.reduce((sum, row) => sum + (row.sessions || 0), 0));
  const totalUsers = numberFrom(totals.users, ga4Trend.reduce((sum, row) => sum + (row.users || 0), 0));
  const totalConversions = numberFrom(totals.conversions, events.reduce((sum, row) => sum + (row.conversions || 0), 0));
  const avgEngagement = numberFrom(
    totals.engagementRate ?? totals.engagement_rate,
    ga4Trend.length ? ga4Trend.reduce((sum, row) => sum + (row.engagementRate || 0), 0) / ga4Trend.length : 0,
  );

  const gscRows = Object.values(gsc).flat();
  const warnings = [
    ...gsc.cliff.slice(0, 3).map((row) => `Traffic cliff: ${row.page || row.query || row.metric}`),
    ...gsc.decaying.slice(0, 3).map((row) => `Decay: ${row.page || row.query || row.metric}`),
    ...gsc.cannibalization.slice(0, 3).map((row) => `Cannibalization: ${row.query || row.page || row.metric}`),
  ];

  if (!gscSnapshot || gscSnapshot.status !== "ok") warnings.push("GSC-data ontbreekt of is gedeeltelijk beschikbaar.");
  if (!ga4Snapshot || ga4Snapshot.status !== "ok") warnings.push("GA4 organic data ontbreekt; configureer SEO_GA4_COMMAND voor live exports.");

  const opportunities = [
    ...gsc.quickWins.slice(0, 5).map((row) => `${row.query || row.page || "Quick win"}: positie ${row.position || "—"}, ${row.impressions} impressies`),
    ...gsc.newQueries.slice(0, 5).map((row) => `Nieuwe query: ${row.query || row.page || row.metric}`),
  ];

  return {
    generatedAt: new Date().toISOString(),
    site: DEFAULTS.site,
    dateRange: buildDateRange(gscSnapshot, ga4Trend),
    sources: [
      sourceInfo("gsc", gscSnapshot, gscRows.length),
      sourceInfo("ga4", ga4Snapshot, ga4Trend.length + landingPages.length + events.length),
    ],
    executive: {
      cards: [
        { label: "GSC workflow rows", value: String(gscRows.length), tone: gscRows.length ? "positive" : "warning" },
        { label: "Quick wins", value: String(gsc.quickWins.length), tone: gsc.quickWins.length ? "positive" : "neutral" },
        { label: "Organic sessions", value: totalSessions.toLocaleString("nl-NL"), tone: totalSessions ? "positive" : "warning" },
        { label: "Engagement", value: `${Math.round(avgEngagement * 10) / 10}%`, tone: avgEngagement ? "positive" : "neutral" },
        { label: "Conversions/events", value: totalConversions.toLocaleString("nl-NL"), tone: totalConversions ? "positive" : "neutral" },
      ],
      opportunities: opportunities.length ? opportunities : ["Nog geen quick-win of nieuwe-query data beschikbaar."],
      warnings: warnings.length ? warnings : ["Geen traffic cliffs, decay of coverage-waarschuwingen gedetecteerd in de huidige snapshots."],
    },
    gsc,
    ga4: {
      totals: {
        sessions: totalSessions,
        users: totalUsers,
        pageviews: numberFrom(totals.pageviews, 0),
        conversions: totalConversions,
        engagementRate: avgEngagement,
      },
      trend: ga4Trend,
      landingPages,
      events,
    },
  };
}

async function main() {
  const gscSnapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "gsc-latest.json"));
  const ga4Snapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "ga4-latest.json"));
  const dashboard = buildDashboardData({ gscSnapshot, ga4Snapshot });
  const stamp = new Date().toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
  await writeJson(path.join(SEO_DATA_DIR, "processed", `dashboard.${stamp}.json`), dashboard);
  await writeJson(path.join(PUBLIC_DASHBOARD_DIR, "dashboard.json"), dashboard);
  console.log(`Generated dashboard data for ${dashboard.site}: ${dashboard.sources.map((s) => `${s.source}=${s.status}`).join(", ")}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error?.message || error);
    process.exit(1);
  });
}
