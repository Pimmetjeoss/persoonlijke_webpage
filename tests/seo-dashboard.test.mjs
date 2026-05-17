import assert from "node:assert/strict";
import test from "node:test";
import { buildDashboardData, normalizeGscRows } from "../scripts/seo/generate-dashboard-data.mjs";

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
  });

  assert.equal(dashboard.gsc.quickWins.length, 1);
  assert.equal(dashboard.ga4.totals.sessions, 8);
  assert.equal(dashboard.ga4.landingPages[0].page, "/");
  assert.equal(dashboard.dateRange.start, "2026-05-15");
  assert.equal(dashboard.dateRange.end, "2026-05-16");
});
