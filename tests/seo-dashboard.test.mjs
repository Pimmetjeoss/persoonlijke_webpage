import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { buildDashboardData, normalizeGscRows, summarizeHistoryPoint } from "../scripts/seo/generate-dashboard-data.mjs";

test("normalizeGscRows maps common GSC fields into stable dashboard rows", () => {
  const rows = normalizeGscRows([
    { query: "webdesign lieshout", page: "/", clicks: "4", impressions: "100", ctr: "0.04", position: "9.2" },
  ], "quickWins");

  assert.equal(rows.length, 1);
  assert.equal(rows[0].query, "webdesign lieshout");
  assert.equal(rows[0].clicks, 4);
  assert.equal(rows[0].impressions, 100);
  assert.equal(rows[0].position, 9.2);
  assert.ok(rows[0].opportunity >= 0);
});

test("buildDashboardData degrades safely when source snapshots are missing", () => {
  const dashboard = buildDashboardData({ gscSnapshot: null, ga4Snapshot: null });

  assert.equal(dashboard.site, "sc-domain:code-lieshout.nl");
  assert.equal(dashboard.sources[0].status, "unavailable");
  assert.equal(dashboard.sources[1].status, "unavailable");
  assert.deepEqual(dashboard.gsc.quickWins, []);
  assert.equal(dashboard.ga4.totals.sessions, 0);
  assert.deepEqual(dashboard.technical.pagespeed, []);
  assert.deepEqual(dashboard.technical.crux, []);
  assert.equal(dashboard.gbp.totals.websiteClicks, 0);
  assert.equal(dashboard.botAnalytics.totals.visits, 0);
  assert.equal(dashboard.clarity.status, process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ? "configured" : "missing");
  assert.deepEqual(dashboard.history, []);
  assert.ok(dashboard.executive.warnings.length >= 1);
});

test("buildDashboardData aggregates GA4 daily sessions and GSC opportunities", () => {
  const dashboard = buildDashboardData({
    gscSnapshot: {
      status: "ok",
      generatedAt: "2026-05-17T00:00:00Z",
      workflows: {
        quickWins: { ok: true, data: { rows: [{ query: "ai agent bouwen", impressions: 50, clicks: 2, position: 11 }] } },
      },
    },
    ga4Snapshot: {
      status: "ok",
      generatedAt: "2026-05-17T00:00:00Z",
      data: {
        daily_data: [
          { date: "2026-05-15", sessions: 3, users: 2, engagement_rate: 66.6 },
          { date: "2026-05-16", sessions: 5, users: 4, engagement_rate: 75 },
        ],
        top_pages: [{ landing_page: "/", sessions: 8, users: 6, engagement_rate: 70 }],
      },
    },
    pagespeedSnapshot: {
      status: "ok",
      generatedAt: "2026-05-17T00:00:00Z",
      results: [{
        ok: true,
        page: "https://code-lieshout.nl/",
        strategy: "mobile",
        data: { lighthouseResult: { categories: { performance: { score: 0.91 }, accessibility: { score: 1 }, "best-practices": { score: 0.96 }, seo: { score: 1 } }, audits: {} } },
      }],
    },
    gbpSnapshot: {
      status: "ok",
      generatedAt: "2026-05-17T00:00:00Z",
      data: { totals: { websiteClicks: 4, calls: 1, rating: 5, reviewCount: 2 } },
    },
    botSnapshot: {
      status: "ok",
      generatedAt: "2026-05-17T00:00:00Z",
      data: { recent: [
        { timestamp: "2026-05-16T10:00:00Z", botName: "GPTBot", family: "openai", path: "/robots.txt", count: 2 },
        { timestamp: "2026-05-16T11:00:00Z", botName: "ClaudeBot", family: "anthropic", path: "/ai-agents", count: 1 },
      ] },
    },
  });

  assert.equal(dashboard.gsc.quickWins.length, 1);
  assert.equal(dashboard.ga4.totals.sessions, 8);
  assert.equal(dashboard.ga4.landingPages[0].page, "/");
  assert.equal(dashboard.technical.pagespeed[0].performance, 91);
  assert.equal(dashboard.gbp.totals.websiteClicks, 4);
  assert.equal(dashboard.botAnalytics.totals.visits, 3);
  assert.equal(dashboard.botAnalytics.totals.uniqueBots, 2);
  assert.ok(dashboard.clarity.checks.length >= 2);
  assert.equal(summarizeHistoryPoint(dashboard).botVisits, 3);
  assert.equal(summarizeHistoryPoint(dashboard).techScore, 97);
  assert.equal(summarizeHistoryPoint(dashboard).mobilePerformance, 91);
  assert.equal(dashboard.dateRange.start, "2026-05-15");
  assert.equal(dashboard.dateRange.end, "2026-05-16");
});

test("SEO dashboard reuses the test page visual shell", () => {
  const source = fs.readFileSync(new URL("../app/seo-dashboard/seo-dashboard-client.tsx", import.meta.url), "utf8");

  assert.match(source, /import StickyHeader from "@\/app\/components\/sticky-header"/);
  assert.match(source, /import \{ StickyFooter \} from "@\/app\/components\/sticky-footer"/);
  assert.match(source, /import \{ BentoCard, BentoGrid \} from "@\/app\/test\/components\/bento-grid"/);
  assert.match(source, /<StickyHeader[\s\S]*title="SEO DASHBOARD"[\s\S]*startExpanded=\{true\}/);
  assert.match(source, /<BentoGrid className="lg:grid-rows-3"/);
  assert.match(source, /<HistoryTrendPanel history=\{data\.history\}/);
  assert.match(source, /<BotAnalyticsPanel botAnalytics=\{data\.botAnalytics\}/);
  assert.match(source, /<ClarityPanel clarity=\{data\.clarity\}/);
});
