#!/usr/bin/env node
import fs from "node:fs/promises";
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

function scoreFromCategory(category) {
  const score = Number(category?.score);
  return Number.isFinite(score) ? Math.round(score * 100) : 0;
}

function vitalStatus(id, value) {
  if (!Number.isFinite(value) || value <= 0) return "unknown";
  const limits = {
    LCP: [2500, 4000],
    INP: [200, 500],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  }[id] || [0, 0];
  if (!limits[0]) return "unknown";
  if (value <= limits[0]) return "good";
  if (value <= limits[1]) return "needs-improvement";
  return "poor";
}

function vitalDisplay(id, value) {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (id === "CLS") return String(Math.round(value * 1000) / 1000);
  if (value >= 1000) return `${Math.round(value / 100) / 10}s`;
  return `${Math.round(value)}ms`;
}

function normalizeVital(id, label, value, unit = id === "CLS" ? "score" : "ms") {
  const safe = numberFrom(value, 0);
  return { id, label, value: safe, unit, displayValue: vitalDisplay(id, safe), status: vitalStatus(id, safe), p75: safe };
}

function percentileFromMetric(metric) {
  return numberFrom(metric?.percentile ?? metric?.percentiles?.p75, 0);
}

function normalizePageSpeed(pagespeedSnapshot) {
  return toArray(pagespeedSnapshot?.results).filter((item) => item?.ok && item?.data?.lighthouseResult).map((item) => {
    const lighthouse = item.data.lighthouseResult;
    const categories = lighthouse.categories || {};
    const audits = lighthouse.audits || {};
    const loadingExperience = item.data.loadingExperience || item.data.originLoadingExperience || {};
    const metrics = loadingExperience.metrics || {};
    const vitals = [
      normalizeVital("LCP", "Largest Contentful Paint", percentileFromMetric(metrics.LARGEST_CONTENTFUL_PAINT_MS) || numberFrom(audits["largest-contentful-paint"]?.numericValue, 0)),
      normalizeVital("INP", "Interaction to Next Paint", percentileFromMetric(metrics.INTERACTION_TO_NEXT_PAINT) || numberFrom(audits["interaction-to-next-paint"]?.numericValue, 0)),
      normalizeVital("CLS", "Cumulative Layout Shift", percentileFromMetric(metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE) / 100 || numberFrom(audits["cumulative-layout-shift"]?.numericValue, 0), "score"),
      normalizeVital("FCP", "First Contentful Paint", percentileFromMetric(metrics.FIRST_CONTENTFUL_PAINT_MS) || numberFrom(audits["first-contentful-paint"]?.numericValue, 0)),
      normalizeVital("TTFB", "Time to First Byte", percentileFromMetric(metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE) || numberFrom(audits["server-response-time"]?.numericValue, 0)),
    ];
    return {
      page: item.page,
      strategy: item.strategy,
      performance: scoreFromCategory(categories.performance),
      accessibility: scoreFromCategory(categories.accessibility),
      bestPractices: scoreFromCategory(categories["best-practices"]),
      seo: scoreFromCategory(categories.seo),
      coreWebVitals: vitals,
      fieldStatus: loadingExperience.overall_category ? "ok" : "unavailable",
    };
  });
}

function normalizeCrux(cruxSnapshot) {
  return toArray(cruxSnapshot?.results).filter((item) => item?.ok && item?.data?.record).map((item) => {
    const record = item.data.record;
    const metrics = record.metrics || {};
    const period = record.collectionPeriod;
    return {
      formFactor: item.formFactor,
      collectionPeriod: period ? `${period.firstDate?.year}-${period.firstDate?.month}-${period.firstDate?.day} t/m ${period.lastDate?.year}-${period.lastDate?.month}-${period.lastDate?.day}` : undefined,
      metrics: [
        normalizeVital("LCP", "Largest Contentful Paint", percentileFromMetric(metrics.largest_contentful_paint)),
        normalizeVital("INP", "Interaction to Next Paint", percentileFromMetric(metrics.interaction_to_next_paint)),
        normalizeVital("CLS", "Cumulative Layout Shift", percentileFromMetric(metrics.cumulative_layout_shift), "score"),
        normalizeVital("FCP", "First Contentful Paint", percentileFromMetric(metrics.first_contentful_paint)),
        normalizeVital("TTFB", "Time to First Byte", percentileFromMetric(metrics.experimental_time_to_first_byte)),
      ],
    };
  });
}

function normalizeGbp(gbpSnapshot) {
  const data = gbpSnapshot?.data || {};
  const totals = data.totals || data.summary || data;
  const profileViews = pickNumber(totals, ["profileViews", "profile_views", "views", "businessViews"], 0);
  const searches = pickNumber(totals, ["searches", "searchViews", "businessImpressions"], 0);
  const websiteClicks = pickNumber(totals, ["websiteClicks", "website_clicks", "websiteActions"], 0);
  const calls = pickNumber(totals, ["calls", "callClicks", "phoneCalls"], 0);
  const directionRequests = pickNumber(totals, ["directionRequests", "direction_requests", "directions"], 0);
  const rating = pickNumber(totals, ["rating", "averageRating", "average_rating"], 0);
  const reviewCount = pickNumber(totals, ["reviewCount", "reviews", "totalReviews"], 0);
  const metricRows = toArray(data.metrics || data.performance || data.insights).map((row) => ({
    label: pickString(row, ["label", "metric", "name"], "metric"),
    value: pickNumber(row, ["value", "count", "total"], 0),
    delta: pickNumber(row, ["delta", "change"], 0),
  }));
  const reviews = toArray(data.reviews).map((row) => ({
    author: pickString(row, ["author", "reviewer", "displayName"], "") || undefined,
    rating: pickNumber(row, ["rating", "starRating"], 0),
    comment: pickString(row, ["comment", "text", "review"], "") || undefined,
    date: pickString(row, ["date", "createTime", "updateTime"], "") || undefined,
  }));
  const metrics = metricRows.length ? metricRows : [
    { label: "Profielweergaven", value: profileViews },
    { label: "Zoekopdrachten", value: searches },
    { label: "Websitekliks", value: websiteClicks },
    { label: "Bellen", value: calls },
    { label: "Route-aanvragen", value: directionRequests },
  ];
  return { totals: { profileViews, searches, websiteClicks, calls, directionRequests, rating, reviewCount }, metrics, reviews };
}

function normalizeBotAnalytics(botSnapshot) {
  const rows = toArray(botSnapshot?.data?.recent || botSnapshot?.recent || botSnapshot?.data?.rows || botSnapshot?.rows)
    .map((row) => {
      const timestamp = pickString(row, ["timestamp", "lastSeen", "created_at", "date"], "");
      const botName = pickString(row, ["botName", "bot_name", "name", "blob1"], "Other crawler");
      const family = pickString(row, ["family", "bot_family", "blob2"], "other");
      const visitPath = pickString(row, ["path", "requestPath", "url_path", "blob3"], "/");
      return {
        timestamp,
        botName,
        family,
        path: visitPath || "/",
        userAgent: pickString(row, ["userAgent", "user_agent", "ua", "blob6"], "") || undefined,
        country: pickString(row, ["country", "cfCountry", "blob5"], "") || undefined,
        count: Math.max(1, pickNumber(row, ["count", "visits", "total"], 1)),
      };
    })
    .filter((row) => row.botName);

  const botMap = new Map();
  for (const row of rows) {
    const key = row.botName;
    const current = botMap.get(key) || { botName: row.botName, family: row.family, total: 0, lastSeen: "", pathCounts: new Map(), dayCounts: new Map() };
    current.total += row.count || 1;
    if (row.timestamp && (!current.lastSeen || row.timestamp > current.lastSeen)) current.lastSeen = row.timestamp;
    current.pathCounts.set(row.path, (current.pathCounts.get(row.path) || 0) + (row.count || 1));
    const day = row.timestamp ? row.timestamp.slice(0, 10) : "unknown";
    current.dayCounts.set(day, (current.dayCounts.get(day) || 0) + (row.count || 1));
    botMap.set(key, current);
  }

  const bots = [...botMap.values()].map((bot) => ({
    botName: bot.botName,
    family: bot.family,
    total: bot.total,
    lastSeen: bot.lastSeen || undefined,
    topPaths: [...bot.pathCounts.entries()].map(([pathValue, count]) => ({ path: pathValue, count })).sort((a, b) => b.count - a.count).slice(0, 5),
    daily: [...bot.dayCounts.entries()].filter(([date]) => date !== "unknown").map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
  })).sort((a, b) => b.total - a.total);

  const visits = rows.reduce((sum, row) => sum + (row.count || 1), 0);
  const lastSeen = rows.map((row) => row.timestamp).filter(Boolean).sort().at(-1);
  return {
    totals: { visits, uniqueBots: bots.length, lastSeen },
    bots,
    recent: rows.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp))).slice(0, 50),
  };
}

function buildClarityAnalytics({ gsc = {}, landingPages = [], botAnalytics = { totals: { visits: 0 }, bots: [], recent: [] } } = {}) {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || process.env.CLARITY_PROJECT_ID || "";
  const configured = Boolean(projectId);
  const hasExportToken = Boolean(
    process.env.PP_CLARITY_API_TOKEN ||
    process.env.MICROSOFT_CLARITY_API_TOKEN ||
    process.env.CLARITY_API_TOKEN ||
    process.env.PP_CLARITY_API_TOKEN_FILE,
  );
  const base = configured ? `https://clarity.microsoft.com/projects/view/${projectId}` : "https://clarity.microsoft.com/";
  const fallbackPages = ["/", "/portfolio", "/contact", "/ai-agents", "/jouw-website"];
  const heatmapPages = (landingPages.length ? landingPages.map((page) => page.page) : fallbackPages).slice(0, 5);
  const quickQueries = toArray(gsc.quickWins).slice(0, 3).map((row) => row.query || row.page || row.metric).filter(Boolean);
  const botNames = toArray(botAnalytics.bots).slice(0, 3).map((bot) => bot.botName).filter(Boolean);
  const botDetail = botNames.length ? botNames.join(", ") : "nog weinig crawlerhits";

  const quickLinks = configured ? [
    { label: "Open Clarity dashboard", href: `${base}/dashboard`, detail: "Startpunt voor live sessions, rage/dead clicks en quick backs." },
    { label: "Heatmaps bekijken", href: `${base}/heatmaps`, detail: "Klik-, scroll- en attention-heatmaps per belangrijke pagina." },
    { label: "Recordings triagen", href: `${base}/recordings`, detail: "Bekijk echte sessies met frictie, terugklikken of snelle exits." },
    { label: "Insights", href: `${base}/insights`, detail: "AI-samenvattingen en patronen zodra Clarity genoeg verkeer heeft." },
  ] : [];

  const discoveryCards = [
    {
      title: "Heatmap focus",
      metric: `${heatmapPages.length} pagina's`,
      detail: heatmapPages.join(" · "),
      action: "Open Heatmaps en vergelijk click-depth met je belangrijkste CTA's.",
      href: configured ? `${base}/heatmaps` : undefined,
      tone: "positive",
    },
    {
      title: "Recording hunt",
      metric: "Frictie zoeken",
      detail: "Filter in Clarity op rage clicks, dead clicks, excessive scrolling en quick backs.",
      action: "Noteer per sessie: waar twijfelt de bezoeker, welke CTA mist, welke tekst blokkeert?",
      href: configured ? `${base}/recordings` : undefined,
      tone: "warning",
    },
    {
      title: "SEO → UX check",
      metric: quickQueries.length ? `${quickQueries.length} queries` : "Quick-win queries",
      detail: quickQueries.length ? quickQueries.join(" · ") : "Gebruik GSC quick wins om pagina-intentie in recordings terug te kijken.",
      action: "Zoek of bezoekers op deze intenties landen en daarna de juiste sectie/CTA vinden.",
      href: configured ? `${base}/dashboard` : undefined,
      tone: "neutral",
    },
    {
      title: "AI crawler context",
      metric: `${botAnalytics.totals?.visits || 0} bot hits`,
      detail: botDetail,
      action: "Combineer bot-crawls met heatmaps: pagina's die bots vinden moeten ook voor mensen duidelijk scannen.",
      href: "#ai-crawlers",
      tone: botAnalytics.totals?.visits ? "positive" : "neutral",
    },
  ];

  const eventIdeas = [
    { event: "cta_contact_click", where: "Contact/portfolio CTA's", why: "Segment recordings waarin iemand koopintentie toont." },
    { event: "portfolio_case_open", where: "Portfolio cases", why: "Zie welke cases aandacht krijgen vóór contact." },
    { event: "seo_dashboard_filter_used", where: "SEO dashboard filters", why: "Meet of het dashboard zelf onderzoek uitlokt." },
    { event: "clarity_discovery_opened", where: "Clarity Discovery Board", why: "Laat in Clarity zien wanneer jij vanuit dit dashboard analyse start." },
  ];

  return {
    projectId: configured ? projectId : undefined,
    status: configured ? "configured" : "missing",
    consentMode: "analytics-consent",
    tagUrl: configured ? `https://www.clarity.ms/tag/${projectId}` : undefined,
    dashboardUrl: configured ? `${base}/dashboard` : undefined,
    heatmapsUrl: configured ? `${base}/heatmaps` : undefined,
    recordingsUrl: configured ? `${base}/recordings` : undefined,
    insightsUrl: configured ? `${base}/insights` : undefined,
    exportApiStatus: hasExportToken ? "token-present" : "token-missing",
    quickLinks,
    discoveryCards,
    eventIdeas,
    checks: [
      {
        label: "Data Export API",
        status: hasExportToken ? "ok" : "warning",
        detail: hasExportToken
          ? "Clarity API-token is aanwezig; pp-clarity kan live insights ophalen."
          : "Geen Clarity Data Export API-token gevonden. Heatmaps/recordings open je in Clarity; live insight-metrics kunnen later via token.",
      },
      {
        label: "Consent gate",
        status: "ok",
        detail: "Clarity wordt pas geladen na analytics/cookie toestemming.",
      },
      {
        label: "Tracking events",
        status: "warning",
        detail: "Volgende stap: custom Clarity events toevoegen aan CTA's zodat recordings beter te segmenteren zijn.",
      },
    ],
    signals: [
      { label: "Heatmap targets", value: String(heatmapPages.length), tone: "positive", detail: heatmapPages.slice(0, 3).join(" · ") },
      { label: "Recordings", value: "Triageren", tone: "warning", detail: "Rage clicks, dead clicks, scroll depth en quick backs." },
      { label: "pp-clarity", value: hasExportToken ? "Live insights" : "Token nodig", tone: hasExportToken ? "positive" : "warning", detail: "CLI kan insights ophalen, geen heatmapbeelden embedden." },
    ],
  };
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
    status: ["ok", "partial", "error", "unavailable"].includes(snapshot.status) ? snapshot.status : "unavailable",
    generatedAt: snapshot.generatedAt,
    detail: snapshot.message || snapshot.error || undefined,
    rows: rowCount,
  };
}

function averageTechnicalScore(pagespeed) {
  const scores = toArray(pagespeed).flatMap((row) => [row.performance, row.accessibility, row.bestPractices, row.seo]).filter(Boolean);
  return scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
}

export function summarizeHistoryPoint(dashboard) {
  const pagespeed = toArray(dashboard?.technical?.pagespeed);
  const mobile = pagespeed.find((row) => row.strategy === "mobile");
  const desktop = pagespeed.find((row) => row.strategy === "desktop");
  return {
    generatedAt: dashboard.generatedAt,
    date: String(dashboard.generatedAt || "").slice(0, 10),
    gscRows: Object.values(dashboard.gsc || {}).flat().length,
    quickWins: toArray(dashboard.gsc?.quickWins).length,
    organicSessions: numberFrom(dashboard.ga4?.totals?.sessions, 0),
    techScore: averageTechnicalScore(pagespeed),
    mobilePerformance: numberFrom(mobile?.performance, 0),
    desktopPerformance: numberFrom(desktop?.performance, 0),
    gbpWebsiteClicks: numberFrom(dashboard.gbp?.totals?.websiteClicks, 0),
    botVisits: numberFrom(dashboard.botAnalytics?.totals?.visits, 0),
    okSources: toArray(dashboard.sources).filter((source) => source.status === "ok").length,
  };
}

async function buildHistory(currentDashboard) {
  const processedDir = path.join(SEO_DATA_DIR, "processed");
  const points = new Map();
  try {
    const files = await fs.readdir(processedDir);
    for (const file of files.filter((name) => /^dashboard\..+\.json$/.test(name)).sort().slice(-180)) {
      const dashboard = await readJsonIfExists(path.join(processedDir, file));
      if (!dashboard?.generatedAt) continue;
      const point = summarizeHistoryPoint(dashboard);
      points.set(point.generatedAt, point);
    }
  } catch {
    // No processed history yet.
  }
  const currentPoint = summarizeHistoryPoint(currentDashboard);
  points.set(currentPoint.generatedAt, currentPoint);
  return [...points.values()].sort((a, b) => a.generatedAt.localeCompare(b.generatedAt)).slice(-180);
}

export function buildDashboardData({ gscSnapshot, ga4Snapshot, pagespeedSnapshot, cruxSnapshot, gbpSnapshot, botSnapshot }) {
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
  const pagespeed = normalizePageSpeed(pagespeedSnapshot);
  const crux = normalizeCrux(cruxSnapshot);
  const gbp = normalizeGbp(gbpSnapshot);
  const botAnalytics = normalizeBotAnalytics(botSnapshot);
  const clarity = buildClarityAnalytics({ gsc, landingPages, botAnalytics });
  const gbpRowCount = gbpSnapshot?.status === "ok" ? gbp.metrics.length + gbp.reviews.length : 0;
  const avgTechnicalScore = averageTechnicalScore(pagespeed);
  const poorVitals = [...pagespeed.flatMap((row) => row.coreWebVitals), ...crux.flatMap((row) => row.metrics)].filter((metric) => metric.status === "poor");
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
  if (!pagespeedSnapshot || pagespeedSnapshot.status !== "ok") warnings.push("PageSpeed/Lighthouse data ontbreekt of is gedeeltelijk beschikbaar.");
  if (!cruxSnapshot || cruxSnapshot.status !== "ok") {
    const cruxDetail = cruxSnapshot?.detail || cruxSnapshot?.message || "Nog geen CrUX snapshot gevonden.";
    const cruxMessage = /no usable field data|not found|geen usable field data/i.test(cruxDetail)
      ? "CrUX field data is nog niet beschikbaar voor dit domein; PageSpeed/Lighthouse labdata wordt wel gebruikt."
      : "CrUX field data ontbreekt; controleer SEO_CRUX_API_KEY of gebruik PageSpeed field data.";
    warnings.push(cruxMessage);
  }
  if (!gbpSnapshot || gbpSnapshot.status !== "ok") warnings.push("Google Business Profile data ontbreekt; configureer SEO_GBP_COMMAND voor read-only local SEO exports.");
  if (!botSnapshot || botSnapshot.status !== "ok") warnings.push("AI crawler data ontbreekt; Vercel-log fallback of Cloudflare Analytics Engine moet nog data leveren.");
  if (clarity.status !== "configured") warnings.push("Microsoft Clarity project-id ontbreekt; zet NEXT_PUBLIC_CLARITY_PROJECT_ID voor installatiecontrole.");
  if (poorVitals.length) warnings.push(`Core Web Vitals met poor-status: ${poorVitals.slice(0, 3).map((metric) => metric.id).join(", ")}.`);

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
      sourceInfo("pagespeed", pagespeedSnapshot, pagespeed.length),
      sourceInfo("crux", cruxSnapshot, crux.length),
      sourceInfo("gbp", gbpSnapshot, gbpRowCount),
      sourceInfo("bots", botSnapshot, botAnalytics.recent.length),
      {
        source: "clarity",
        status: clarity.status === "configured" ? "ok" : "unavailable",
        generatedAt: new Date().toISOString(),
        detail: clarity.status === "configured" ? `Discovery board klaar voor project ${clarity.projectId}.` : "NEXT_PUBLIC_CLARITY_PROJECT_ID ontbreekt.",
        rows: clarity.checks.length,
      },
    ],
    executive: {
      cards: [
        { label: "GSC workflow rows", value: String(gscRows.length), tone: gscRows.length ? "positive" : "warning" },
        { label: "Quick wins", value: String(gsc.quickWins.length), tone: gsc.quickWins.length ? "positive" : "neutral" },
        { label: "Organic sessions", value: totalSessions.toLocaleString("nl-NL"), tone: totalSessions ? "positive" : "warning" },
        { label: "Engagement", value: `${Math.round(avgEngagement * 10) / 10}%`, tone: avgEngagement ? "positive" : "neutral" },
        { label: "Conversions/events", value: totalConversions.toLocaleString("nl-NL"), tone: totalConversions ? "positive" : "neutral" },
        { label: "Tech score", value: avgTechnicalScore ? String(avgTechnicalScore) : "—", tone: avgTechnicalScore >= 90 ? "positive" : avgTechnicalScore ? "warning" : "neutral" },
        { label: "GBP clicks", value: gbp.totals.websiteClicks.toLocaleString("nl-NL"), tone: gbp.totals.websiteClicks ? "positive" : "neutral" },
        { label: "AI crawlers", value: botAnalytics.totals.visits.toLocaleString("nl-NL"), tone: botAnalytics.totals.visits ? "positive" : "neutral" },
        { label: "Clarity", value: clarity.status === "configured" ? "Actief" : "—", tone: clarity.status === "configured" ? "positive" : "warning" },
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
    technical: {
      pagespeed,
      crux,
    },
    gbp,
    botAnalytics,
    clarity,
    history: [],
  };
}

async function main() {
  const gscSnapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "gsc-latest.json"));
  const ga4Snapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "ga4-latest.json"));
  const pagespeedSnapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "pagespeed-latest.json"));
  const cruxSnapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "crux-latest.json"));
  const gbpSnapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "gbp-latest.json"));
  const botSnapshot = await readJsonIfExists(path.join(SEO_DATA_DIR, "snapshots", "bot-visits-latest.json"));
  const dashboard = buildDashboardData({ gscSnapshot, ga4Snapshot, pagespeedSnapshot, cruxSnapshot, gbpSnapshot, botSnapshot });
  dashboard.history = await buildHistory(dashboard);
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
