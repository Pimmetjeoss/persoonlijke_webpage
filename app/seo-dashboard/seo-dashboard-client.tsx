"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BarChartIcon, DashboardIcon, LightningBoltIcon, MagnifyingGlassIcon, ReaderIcon } from "@radix-ui/react-icons";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid";
import type { BotVisitSummary, DataSourceInfo, EventMetric, GscWorkflowRow, LandingPageMetric, SeoDashboardData, TimeSeriesPoint } from "@/lib/seo-dashboard-types";

type SortKey = "query" | "page" | "clicks" | "impressions" | "position" | "opportunity" | "sessions" | "users" | "engagementRate" | "conversions" | "botName" | "family" | "total" | "lastSeen";
type SortDirection = "asc" | "desc";

const workflowLabels: Array<[keyof SeoDashboardData["gsc"], string, string]> = [
  ["quickWins", "Quick wins", "Page-2 queries met hoge upside"],
  ["cannibalization", "Cannibalization", "Queries waar meerdere URL's concurreren"],
  ["compare", "Compare", "Current period vs previous period"],
  ["decaying", "Decaying", "Content met dalende trend"],
  ["newQueries", "New queries", "Nieuwe zoekvraag in de laatste periode"],
  ["cliff", "Cliff", "Abrupte traffic drops"],
  ["outliers", "Outliers", "Afwijkende CTR/prestatiepunten"],
  ["sitemapWatch", "Sitemap watch", "Sitemap-state veranderingen"],
  ["coverageDrift", "Coverage drift", "Index coverage wijzigingen"],
];

const dashboardFeatures = [
  {
    Icon: DashboardIcon,
    name: "Overzicht",
    description: "De belangrijkste SEO-metrics meteen in beeld.",
    href: "#overzicht",
    cta: "Bekijk overzicht",
    background: <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-200 opacity-60" />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: LightningBoltIcon,
    name: "Kansen",
    description: "Quick wins en waarschuwingen voor de komende acties.",
    href: "#kansen",
    cta: "Pak de kansen",
    background: <div className="absolute -right-12 -top-12 h-24 w-24 rotate-12 bg-yellow-200 opacity-70" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: BarChartIcon,
    name: "Traffic trend",
    description: "GA4 sessies en GSC clicks als visuele trend.",
    href: "#traffic-trend",
    cta: "Bekijk grafiek",
    background: <div className="absolute -bottom-8 -right-8 h-20 w-32 rounded-full bg-emerald-300 opacity-50" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: ReaderIcon,
    name: "Pagina's",
    description: "Welke landingspagina's organisch het meeste dragen.",
    href: "#landing-pages",
    cta: "Open pagina's",
    background: <div className="absolute -right-8 top-6 h-16 w-16 rounded-xl bg-white/70" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "Query intelligence",
    description: "GSC workflows voor queries, issues en URL's.",
    href: "#query-intelligence",
    cta: "Duik erin",
    background: <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full border-[16px] border-emerald-200 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
  {
    Icon: BarChartIcon,
    name: "Core Web Vitals",
    description: "CrUX, PageSpeed en Lighthouse scores per device.",
    href: "#technical-seo",
    cta: "Check techniek",
    background: <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-yellow-200 opacity-70" />,
    className: "col-span-1",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: DashboardIcon,
    name: "Historie",
    description: "Zie of scores per scan beter of slechter worden.",
    href: "#historie",
    cta: "Bekijk trend",
    background: <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full border-[14px] border-black/10" />,
    className: "col-span-1",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: ReaderIcon,
    name: "Local SEO",
    description: "Google Business Profile views, acties en reviews.",
    href: "#local-seo",
    cta: "Bekijk GBP",
    background: <div className="absolute -right-8 top-6 h-16 w-16 rounded-xl bg-emerald-200" />,
    className: "col-span-1",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "AI crawlers",
    description: "Welke chatbots en crawlers jouw pagina's echt ophalen.",
    href: "#ai-crawlers",
    cta: "Bekijk bots",
    background: <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-black/10" />,
    className: "col-span-1",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: LightningBoltIcon,
    name: "Clarity",
    description: "Installatie, consent en Microsoft Clarity status op één plek.",
    href: "#clarity",
    cta: "Check Clarity",
    background: <div className="absolute -right-10 top-2 h-20 w-20 rounded-full bg-sky-200 opacity-80" />,
    className: "col-span-1",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
];

function toneClass(tone: string) {
  if (tone === "positive") return "border-emerald-400 bg-emerald-200 text-emerald-950";
  if (tone === "negative") return "border-red-400 bg-red-100 text-red-950";
  if (tone === "warning") return "border-yellow-400 bg-yellow-100 text-yellow-950";
  return "border-black/20 bg-white/80 text-black";
}

function statusClass(status: string) {
  if (status === "ok") return "bg-emerald-300 text-emerald-950";
  if (status === "partial") return "bg-yellow-200 text-yellow-950";
  if (status === "error") return "bg-red-200 text-red-950";
  return "bg-zinc-200 text-zinc-700";
}

function formatNumber(value: number | undefined) {
  return (value ?? 0).toLocaleString("nl-NL");
}

function formatPercent(value: number | undefined) {
  const safe = value ?? 0;
  const normalized = safe <= 1 && safe > 0 ? safe * 100 : safe;
  return `${Math.round(normalized * 10) / 10}%`;
}

function compareValues(a: string | number | undefined, b: string | number | undefined, direction: SortDirection) {
  const multiplier = direction === "asc" ? 1 : -1;
  if (typeof a === "number" || typeof b === "number") return (((a as number) || 0) - ((b as number) || 0)) * multiplier;
  return String(a || "").localeCompare(String(b || ""), "nl-NL") * multiplier;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[2rem] border-[3px] border-dashed border-black/20 bg-white/60 p-8 text-black/70">
      <p className="text-2xl text-black">{title}</p>
      <p className="mt-2 font-mono text-sm leading-6">{detail}</p>
    </div>
  );
}

function SourcePill({ source }: { source: DataSourceInfo }) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border-[3px] border-black bg-white/80 p-4 shadow-[6px_6px_0_#000]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xl uppercase tracking-tight">{source.source}</span>
        <span className={`rounded-full px-3 py-1 font-mono text-xs uppercase ${statusClass(source.status)}`}>{source.status}</span>
      </div>
      <p className="font-mono text-xs text-black/60">Rows: {source.rows ?? 0}</p>
      {source.generatedAt ? <p className="font-mono text-xs text-black/60">Sync: {new Date(source.generatedAt).toLocaleString("nl-NL")}</p> : null}
      {source.detail ? <p className="font-mono text-xs leading-5 text-black/70">{source.detail}</p> : null}
    </div>
  );
}

function LineChart({ data }: { data: TimeSeriesPoint[] }) {
  const [metric, setMetric] = useState<"sessions" | "users" | "clicks">("sessions");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const points = data.filter((item) => item.date);
  const width = 760;
  const height = 260;
  const pad = 28;
  const maxValue = Math.max(1, ...points.map((item) => Number(item[metric]) || 0));
  const toXY = (value: number, index: number) => {
    const x = pad + (index / Math.max(1, points.length - 1)) * (width - pad * 2);
    const y = height - pad - (value / maxValue) * (height - pad * 2);
    return { x, y };
  };
  const polyline = points.map((item, index) => {
    const { x, y } = toXY(Number(item[metric]) || 0, index);
    return `${x},${y}`;
  }).join(" ");
  const activePoint = activeIndex === null ? points.at(-1) : points[activeIndex];

  if (!points.length) return <EmptyState title="Nog geen trenddata" detail="Run de GA4/GSC fetch scripts om tijdreeksen te vullen." />;

  return (
    <div className="rounded-[2rem] border-[3px] border-black bg-black p-4 text-white shadow-[8px_8px_0_#86efac]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["sessions", "users", "clicks"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setMetric(item)} className={`rounded-full border-2 border-white px-3 py-1 font-mono text-xs uppercase transition ${metric === item ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-2 font-mono text-xs">
          {activePoint ? `${activePoint.date}: ${formatNumber(Number(activePoint[metric]) || 0)} ${metric}` : "Hover of tik op een punt"}
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-h-[260px] w-full min-w-[560px]" role="img" aria-label="Interactieve organic trend chart">
          <rect width={width} height={height} rx="24" fill="#020617" />
          {[0, 1, 2, 3].map((line) => (
            <line key={line} x1={pad} x2={width - pad} y1={pad + line * 58} y2={pad + line * 58} stroke="rgba(255,255,255,.12)" />
          ))}
          <polyline points={polyline} fill="none" stroke={metric === "clicks" ? "#fef08a" : metric === "users" ? "#93c5fd" : "#86efac"} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((item, index) => {
            const value = Number(item[metric]) || 0;
            const { x, y } = toXY(value, index);
            const active = activeIndex === index || (activeIndex === null && index === points.length - 1);
            return (
              <g key={`${item.date}-${index}`} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} tabIndex={0} className="cursor-pointer outline-none">
                <circle cx={x} cy={y} r={active ? "9" : "6"} fill={active ? "#fff" : "#86efac"} stroke="#020617" strokeWidth="2">
                  <title>{`${item.date}: ${formatNumber(value)} ${metric}`}</title>
                </circle>
                <circle cx={x} cy={y} r="18" fill="transparent" />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 font-mono text-xs">
        <span className="text-emerald-200">● Klik/hover punten voor detail</span>
        <span className="text-yellow-200">● Metric-knoppen wisselen de grafiek</span>
      </div>
    </div>
  );
}

function BarChart({ pages }: { pages: LandingPageMetric[] }) {
  const [metric, setMetric] = useState<"sessions" | "users" | "conversions">("sessions");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const rows = pages.slice(0, 8);
  const max = Math.max(1, ...rows.map((row) => Number(row[metric]) || 0));
  const selected = rows.find((row) => row.page === selectedPage) || rows[0];
  if (!rows.length) return <EmptyState title="Nog geen landing pages" detail="GA4 organic landing page data is nog niet beschikbaar." />;
  return (
    <div className="space-y-4 rounded-[2rem] border-[3px] border-black bg-emerald-100 p-5 shadow-[8px_8px_0_#000]">
      <div className="flex flex-wrap gap-2">
        {(["sessions", "users", "conversions"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setMetric(item)} className={`rounded-full border-2 border-black px-3 py-1 font-mono text-xs uppercase ${metric === item ? "bg-black text-white" : "bg-white hover:bg-yellow-100"}`}>{item}</button>
        ))}
      </div>
      {selected ? <p className="rounded-2xl bg-white/70 p-3 font-mono text-xs">Geselecteerd: <b>{selected.page}</b> · {formatNumber(Number(selected[metric]) || 0)} {metric}</p> : null}
      {rows.map((row) => {
        const value = Number(row[metric]) || 0;
        const active = selected?.page === row.page;
        return (
          <button key={row.page} type="button" onClick={() => setSelectedPage(row.page)} onMouseEnter={() => setSelectedPage(row.page)} className={`grid w-full gap-2 rounded-2xl p-2 text-left transition md:grid-cols-[minmax(120px,1fr)_2fr_90px] md:items-center ${active ? "bg-white shadow-[4px_4px_0_#000]" : "hover:bg-white/70"}`}>
            <div className="truncate font-mono text-sm" title={row.page}>{row.page}</div>
            <div className="h-8 overflow-hidden rounded-full border-2 border-black bg-white">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} title={`${value} ${metric}`} />
            </div>
            <div className="font-mono text-sm md:text-right">{formatNumber(value)}</div>
          </button>
        );
      })}
    </div>
  );
}

function WorkflowTable({ rows }: { rows: GscWorkflowRow[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const filteredRows = useMemo(() => {
    const needle = query.toLowerCase();
    return rows
      .filter((row) => `${row.query ?? ""} ${row.page ?? ""} ${row.issue ?? ""}`.toLowerCase().includes(needle))
      .sort((a, b) => compareValues(a[sortKey as keyof GscWorkflowRow] as string | number | undefined, b[sortKey as keyof GscWorkflowRow] as string | number | undefined, direction));
  }, [direction, query, rows, sortKey]);

  const sort = (key: SortKey) => {
    if (sortKey === key) setDirection(direction === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setDirection("desc");
    }
  };

  if (!rows.length) return <EmptyState title="Geen rows" detail="Deze workflow heeft nog geen beschikbare data of de CLI gaf een lege dataset terug." />;

  return (
    <div className="rounded-[2rem] border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="border-b-[3px] border-black p-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter op query, URL of issue…"
          className="w-full rounded-full border-[3px] border-black bg-emerald-50 px-5 py-3 font-mono text-sm outline-none transition focus:bg-white"
        />
      </div>
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-left font-mono text-sm">
          <thead className="sticky top-0 bg-black text-white">
            <tr>
              {["query", "page", "clicks", "impressions", "position", "opportunity"].map((key) => (
                <th key={key} className="cursor-pointer px-4 py-3 uppercase" onClick={() => sort(key as SortKey)}>
                  {key} {sortKey === key ? (direction === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th className="px-4 py-3 uppercase">Issue</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="border-b border-black/10 hover:bg-emerald-100">
                <td className="max-w-[260px] px-4 py-3" title={row.query}>{row.query || "—"}</td>
                <td className="max-w-[320px] truncate px-4 py-3" title={row.page}>{row.page || "—"}</td>
                <td className="px-4 py-3">{formatNumber(row.clicks)}</td>
                <td className="px-4 py-3">{formatNumber(row.impressions)}</td>
                <td className="px-4 py-3">{row.position ? Math.round(row.position * 10) / 10 : "—"}</td>
                <td className="px-4 py-3">{formatNumber(row.opportunity)}</td>
                <td className="max-w-[260px] px-4 py-3" title={row.issue}>{row.issue || row.metric || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LandingPageTable({ pages }: { pages: LandingPageMetric[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("sessions");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const rows = useMemo(() => pages
    .filter((row) => row.page.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => compareValues(a[sortKey as keyof LandingPageMetric] as string | number | undefined, b[sortKey as keyof LandingPageMetric] as string | number | undefined, direction)), [direction, pages, query, sortKey]);

  const sort = (key: SortKey) => {
    if (sortKey === key) setDirection(direction === "asc" ? "desc" : "asc");
    else setSortKey(key);
  };

  if (!pages.length) return <EmptyState title="Geen GA4 landing-page data" detail="Configureer SEO_GA4_COMMAND en run npm run seo:update." />;

  return (
    <div className="rounded-[2rem] border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="border-b-[3px] border-black p-4">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter landing pages…" className="w-full rounded-full border-[3px] border-black bg-emerald-50 px-5 py-3 font-mono text-sm outline-none focus:bg-white" />
      </div>
      <div className="overflow-auto">
        <table className="w-full min-w-[760px] font-mono text-sm">
          <thead className="bg-black text-left text-white">
            <tr>
              {["page", "sessions", "users", "engagementRate", "conversions"].map((key) => (
                <th key={key} onClick={() => sort(key as SortKey)} className="cursor-pointer px-4 py-3 uppercase">{key} {sortKey === key ? (direction === "asc" ? "↑" : "↓") : ""}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.page} className="border-b border-black/10 hover:bg-emerald-100">
                <td className="max-w-[360px] truncate px-4 py-3" title={row.page}>{row.page}</td>
                <td className="px-4 py-3">{formatNumber(row.sessions)}</td>
                <td className="px-4 py-3">{formatNumber(row.users)}</td>
                <td className="px-4 py-3">{formatPercent(row.engagementRate)}</td>
                <td className="px-4 py-3">{formatNumber(row.conversions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventList({ events }: { events: EventMetric[] }) {
  if (!events.length) return <EmptyState title="Geen event/conversion data" detail="GA4 events worden getoond zodra de export ze bevat." />;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {events.slice(0, 9).map((event) => (
        <div key={event.name} className="rounded-3xl border-[3px] border-black bg-yellow-100 p-4 shadow-[5px_5px_0_#000]">
          <p className="truncate text-2xl" title={event.name}>{event.name}</p>
          <p className="mt-2 font-mono text-sm">{formatNumber(event.count)} events</p>
          <p className="font-mono text-sm">{formatNumber(event.conversions)} conversions</p>
        </div>
      ))}
    </div>
  );
}

function vitalClass(status: string) {
  if (status === "good") return "bg-emerald-200 text-emerald-950";
  if (status === "needs-improvement") return "bg-yellow-100 text-yellow-950";
  if (status === "poor") return "bg-red-100 text-red-950";
  return "bg-zinc-100 text-zinc-700";
}

function TechnicalSeoPanel({ technical }: { technical: SeoDashboardData["technical"] }) {
  if (!technical.pagespeed.length && !technical.crux.length) {
    return <EmptyState title="Nog geen CrUX/PageSpeed data" detail="Run npm run seo:fetch:pagespeed en configureer optioneel SEO_CRUX_API_KEY voor Chrome UX Report field data." />;
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {technical.pagespeed.map((row) => (
          <div key={`${row.page}-${row.strategy}`} className="rounded-[2rem] border-[3px] border-black bg-white p-5 shadow-[7px_7px_0_#000]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest">{row.strategy} · Lighthouse</p>
                <p className="max-w-[420px] truncate text-2xl" title={row.page}>{row.page}</p>
              </div>
              <div className="rounded-full border-[3px] border-black bg-emerald-200 px-4 py-2 text-3xl">{row.performance || "—"}</div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 font-mono text-xs">
              <div className="rounded-2xl bg-emerald-50 p-3">Perf<br /><b>{row.performance}</b></div>
              <div className="rounded-2xl bg-emerald-50 p-3">A11y<br /><b>{row.accessibility}</b></div>
              <div className="rounded-2xl bg-emerald-50 p-3">BP<br /><b>{row.bestPractices}</b></div>
              <div className="rounded-2xl bg-emerald-50 p-3">SEO<br /><b>{row.seo}</b></div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {row.coreWebVitals.map((metric) => (
                <div key={metric.id} className={`rounded-2xl p-3 font-mono text-sm ${vitalClass(metric.status)}`}>
                  <span className="font-bold">{metric.id}</span> {metric.displayValue} <span className="text-xs uppercase opacity-70">{metric.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {technical.crux.length ? (
        <div className="rounded-[2rem] border-[3px] border-black bg-black p-5 text-white shadow-[8px_8px_0_#86efac]">
          <h3 className="text-4xl">CrUX field data</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {technical.crux.map((row) => (
              <div key={row.formFactor} className="rounded-3xl bg-white/10 p-4">
                <p className="font-mono text-sm uppercase text-emerald-200">{row.formFactor}</p>
                {row.collectionPeriod ? <p className="font-mono text-xs text-white/60">{row.collectionPeriod}</p> : null}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {row.metrics.map((metric) => <div key={metric.id} className="rounded-2xl bg-white/10 p-3 font-mono text-sm">{metric.id}: {metric.displayValue} · {metric.status}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GbpPanel({ gbp }: { gbp: SeoDashboardData["gbp"] }) {
  const hasData = gbp.metrics.some((metric) => metric.value > 0) || gbp.reviews.length || gbp.totals.rating > 0;
  if (!hasData) return <EmptyState title="Nog geen Google Business Profile data" detail="Configureer SEO_GBP_COMMAND met een read-only export voor views, zoekopdrachten, websitekliks, calls, route-aanvragen en reviews." />;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {gbp.metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border-[3px] border-black bg-white p-5 shadow-[5px_5px_0_#000]">
            <p className="font-mono text-xs uppercase tracking-widest">{metric.label}</p>
            <p className="mt-3 text-5xl">{formatNumber(metric.value)}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[2rem] border-[3px] border-black bg-yellow-100 p-5 shadow-[8px_8px_0_#000]">
        <h3 className="text-4xl">Reviews</h3>
        <p className="mt-2 font-mono text-sm">Rating: {gbp.totals.rating || "—"} · {formatNumber(gbp.totals.reviewCount)} reviews</p>
        <div className="mt-4 space-y-3">
          {gbp.reviews.slice(0, 5).map((review, index) => (
            <div key={`${review.author}-${index}`} className="rounded-2xl bg-white/70 p-3 font-mono text-sm">
              <p>{"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating))))} {review.author || "Review"}</p>
              {review.comment ? <p className="mt-1 text-black/70">{review.comment}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function clarityStatusClass(status: string) {
  if (status === "ok") return "bg-emerald-200 text-emerald-950";
  if (status === "warning") return "bg-yellow-100 text-yellow-950";
  return "bg-red-100 text-red-950";
}

function ClarityPanel({ clarity }: { clarity: SeoDashboardData["clarity"] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <div className="rounded-[2rem] border-[3px] border-black bg-black p-6 text-white shadow-[8px_8px_0_#86efac]">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-200">Microsoft Clarity</p>
        <h3 className="mt-3 text-5xl">{clarity.status === "configured" ? "Actief" : "Nog niet actief"}</h3>
        <p className="mt-4 font-mono text-sm leading-6 text-white/70">Project: {clarity.projectId || "—"}<br />Consent mode: {clarity.consentMode}<br />{clarity.tagUrl || "Geen tag-url zolang Project ID ontbreekt."}</p>
        {clarity.tagUrl ? <a href={clarity.tagUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border-2 border-white px-4 py-2 font-mono text-xs uppercase hover:bg-white hover:text-black">Open tag</a> : null}
      </div>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {clarity.signals.map((signal) => (
            <div key={signal.label} className={`rounded-3xl border-[3px] border-black p-4 shadow-[5px_5px_0_#000] ${signal.tone === "positive" ? "bg-emerald-100" : signal.tone === "warning" ? "bg-yellow-100" : "bg-white"}`}>
              <p className="font-mono text-xs uppercase tracking-widest">{signal.label}</p>
              <p className="mt-2 text-3xl">{signal.value}</p>
              {signal.detail ? <p className="mt-2 font-mono text-xs leading-5 text-black/60">{signal.detail}</p> : null}
            </div>
          ))}
        </div>
        <div className="rounded-[2rem] border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
          {clarity.checks.map((check) => (
            <div key={check.label} className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 p-4 last:border-b-0">
              <div>
                <p className="text-2xl">{check.label}</p>
                <p className="mt-1 font-mono text-xs leading-5 text-black/60">{check.detail}</p>
              </div>
              <span className={`rounded-full px-3 py-1 font-mono text-xs uppercase ${clarityStatusClass(check.status)}`}>{check.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function botFamilyClass(family: string) {
  if (["openai", "anthropic", "perplexity"].includes(family)) return "bg-black text-white";
  if (["google", "apple"].includes(family)) return "bg-emerald-200 text-emerald-950";
  if (family === "common-crawl") return "bg-yellow-100 text-yellow-950";
  return "bg-zinc-100 text-zinc-800";
}

function BotSparkline({ bot }: { bot: BotVisitSummary }) {
  const points = bot.daily.slice(-14);
  const max = Math.max(1, ...points.map((point) => point.count));
  if (!points.length) return <span className="text-black/50">—</span>;
  return (
    <div className="flex h-9 items-end gap-1" aria-label={`${bot.botName} crawler trend`}>
      {points.map((point) => (
        <div key={point.date} title={`${point.date}: ${point.count}`} className="w-3 rounded-t bg-emerald-500" style={{ height: `${Math.max(18, (point.count / max) * 36)}px` }} />
      ))}
    </div>
  );
}

function BotAnalyticsPanel({ botAnalytics }: { botAnalytics: SeoDashboardData["botAnalytics"] }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const families = useMemo(() => ["all", ...Array.from(new Set((botAnalytics?.bots || []).map((bot) => bot.family)))], [botAnalytics]);
  const bots = useMemo(() => {
    const needle = query.toLowerCase();
    return [...(botAnalytics?.bots || [])]
      .filter((bot) => family === "all" || bot.family === family)
      .filter((bot) => `${bot.botName} ${bot.family} ${bot.topPaths.map((path) => path.path).join(" ")}`.toLowerCase().includes(needle))
      .sort((a, b) => compareValues(a[sortKey as keyof BotVisitSummary] as string | number | undefined, b[sortKey as keyof BotVisitSummary] as string | number | undefined, direction));
  }, [botAnalytics, direction, family, query, sortKey]);
  const sort = (key: SortKey) => {
    if (sortKey === key) setDirection(direction === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setDirection("desc");
    }
  };

  if (!botAnalytics?.totals?.visits) {
    return <EmptyState title="Nog geen AI crawler data" detail="Vercel-log fallback staat klaar. Zodra middleware/logs bot user-agents zien, vult deze tabel met live crawlerhits." />;
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border-[3px] border-black bg-black p-6 text-white shadow-[8px_8px_0_#86efac]">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-200">Botbezoeken</p>
          <p className="mt-3 text-6xl">{formatNumber(botAnalytics.totals.visits)}</p>
        </div>
        <div className="rounded-[2rem] border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_#000]">
          <p className="font-mono text-xs uppercase tracking-widest">Unieke bots</p>
          <p className="mt-3 text-6xl">{formatNumber(botAnalytics.totals.uniqueBots)}</p>
        </div>
        <div className="rounded-[2rem] border-[3px] border-black bg-yellow-100 p-6 shadow-[8px_8px_0_#000]">
          <p className="font-mono text-xs uppercase tracking-widest">Laatst gezien</p>
          <p className="mt-3 font-mono text-lg">{botAnalytics.totals.lastSeen ? new Date(botAnalytics.totals.lastSeen).toLocaleString("nl-NL") : "—"}</p>
        </div>
      </div>

      <div className="rounded-[2rem] border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
        <div className="grid gap-3 border-b-[3px] border-black p-4 md:grid-cols-[1fr_auto]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter bots, families of paden…" className="w-full rounded-full border-[3px] border-black bg-emerald-50 px-5 py-3 font-mono text-sm outline-none focus:bg-white" />
          <div className="flex max-w-full gap-2 overflow-x-auto">
            {families.map((item) => <button key={item} type="button" onClick={() => setFamily(item)} className={`shrink-0 rounded-full border-[3px] border-black px-4 py-2 font-mono text-xs uppercase ${family === item ? "bg-black text-white" : "bg-white hover:bg-emerald-100"}`}>{item}</button>)}
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] font-mono text-sm">
            <thead className="bg-black text-left text-white">
              <tr>
                {[["botName", "Bot"], ["family", "Family"], ["total", "Bezoeken"], ["lastSeen", "Laatst"]].map(([key, label]) => (
                  <th key={key} onClick={() => sort(key as SortKey)} className="cursor-pointer px-4 py-3 uppercase">{label} {sortKey === key ? (direction === "asc" ? "↑" : "↓") : ""}</th>
                ))}
                <th className="px-4 py-3 uppercase">Toppaden</th>
                <th className="px-4 py-3 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot) => (
                <tr key={bot.botName} className="border-b border-black/10 hover:bg-emerald-50">
                  <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 ${botFamilyClass(bot.family)}`}>{bot.botName}</span></td>
                  <td className="px-4 py-3">{bot.family}</td>
                  <td className="px-4 py-3 text-xl">{formatNumber(bot.total)}</td>
                  <td className="px-4 py-3">{bot.lastSeen ? new Date(bot.lastSeen).toLocaleString("nl-NL") : "—"}</td>
                  <td className="max-w-[320px] px-4 py-3">{bot.topPaths.map((path) => `${path.path} (${path.count})`).join(", ")}</td>
                  <td className="px-4 py-3"><BotSparkline bot={bot} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[2rem] border-[3px] border-black bg-emerald-100 p-5 shadow-[8px_8px_0_#000]">
        <h3 className="text-4xl">Recente hits</h3>
        <div className="mt-4 grid gap-3">
          {botAnalytics.recent.slice(0, 8).map((visit, index) => (
            <div key={`${visit.timestamp}-${visit.botName}-${index}`} className="rounded-2xl bg-white/80 p-3 font-mono text-sm">
              <b>{visit.botName}</b> · {visit.path} · {visit.timestamp ? new Date(visit.timestamp).toLocaleString("nl-NL") : "tijd onbekend"}
              {visit.country ? ` · ${visit.country}` : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryTrendPanel({ history }: { history: SeoDashboardData["history"] }) {
  const points = (history || []).filter((point) => point.generatedAt).slice(-30);
  if (points.length < 2) return <EmptyState title="Nog te weinig historie" detail="Na twee of meer scans verschijnt hier automatisch een trendgrafiek met beter/slechter-signalen." />;

  const width = 760;
  const height = 260;
  const pad = 30;
  const max = Math.max(100, ...points.map((point) => Math.max(point.techScore, point.mobilePerformance, point.desktopPerformance, point.gscRows)));
  const toPoint = (value: number, index: number) => {
    const x = pad + (index / Math.max(1, points.length - 1)) * (width - pad * 2);
    const y = height - pad - (value / max) * (height - pad * 2);
    return `${x},${y}`;
  };
  const line = (key: keyof SeoDashboardData["history"][number]) => points.map((point, index) => toPoint(Number(point[key]) || 0, index)).join(" ");
  const first = points[0];
  const last = points.at(-1) || first;
  const delta = (key: keyof SeoDashboardData["history"][number]) => (Number(last[key]) || 0) - (Number(first[key]) || 0);
  const trendClass = (value: number) => value > 0 ? "text-emerald-700" : value < 0 ? "text-red-700" : "text-black/60";

  return (
    <div className="rounded-[2rem] border-[3px] border-black bg-white p-5 shadow-[8px_8px_0_#000]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-4xl">Historische trend</h3>
          <p className="font-mono text-sm text-black/60">Laatste {points.length} dashboard snapshots · {new Date(first.generatedAt).toLocaleDateString("nl-NL")} t/m {new Date(last.generatedAt).toLocaleDateString("nl-NL")}</p>
        </div>
        <div className="grid gap-2 font-mono text-xs sm:grid-cols-3">
          <span className={trendClass(delta("techScore"))}>Tech score {delta("techScore") >= 0 ? "+" : ""}{delta("techScore")}</span>
          <span className={trendClass(delta("mobilePerformance"))}>Mobile perf {delta("mobilePerformance") >= 0 ? "+" : ""}{delta("mobilePerformance")}</span>
          <span className={trendClass(delta("quickWins"))}>Quick wins {delta("quickWins") >= 0 ? "+" : ""}{delta("quickWins")}</span>
        </div>
      </div>
      <div className="overflow-x-auto rounded-[1.5rem] bg-black p-4 text-white">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-h-[260px] w-full min-w-[560px]" role="img" aria-label="SEO historische trendgrafiek">
          <rect width={width} height={height} rx="24" fill="#020617" />
          {[0, 1, 2, 3].map((tick) => <line key={tick} x1={pad} x2={width - pad} y1={pad + tick * 58} y2={pad + tick * 58} stroke="rgba(255,255,255,.12)" />)}
          <polyline points={line("techScore")} fill="none" stroke="#86efac" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={line("mobilePerformance")} fill="none" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={line("desktopPerformance")} fill="none" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={line("quickWins")} fill="none" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point, index) => {
            const [x, y] = toPoint(point.techScore, index).split(",").map(Number);
            return <circle key={point.generatedAt} cx={x} cy={y} r="5" fill="#86efac"><title>{`${new Date(point.generatedAt).toLocaleString("nl-NL")}: tech ${point.techScore}, mobile ${point.mobilePerformance}, desktop ${point.desktopPerformance}, quick wins ${point.quickWins}`}</title></circle>;
          })}
        </svg>
        <div className="mt-3 flex flex-wrap gap-4 font-mono text-xs">
          <span className="text-emerald-200">● Tech score</span>
          <span className="text-yellow-200">● Mobile performance</span>
          <span className="text-blue-200">● Desktop performance</span>
          <span className="text-rose-300">● Quick wins</span>
        </div>
      </div>
    </div>
  );
}

export default function SeoDashboardClient({ initialData }: { initialData: SeoDashboardData }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(initialData);
  const [activeWorkflow, setActiveWorkflow] = useState<keyof SeoDashboardData["gsc"]>("quickWins");

  useEffect(() => {
    fetch("/data/seo-dashboard/dashboard.json", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : initialData))
      .then((payload: SeoDashboardData) => setData(payload))
      .catch(() => setData(initialData));
  }, [initialData]);

  const activeRows = data.gsc[activeWorkflow];

  return (
    <div
      ref={pageRef}
      className="min-h-screen pb-20 text-black"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="SEO DASHBOARD"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <main>
        <section id="overzicht" className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
          <div>
            <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.35em]">sc-domain:code-lieshout.nl</p>
                <h1 className="mt-4 text-5xl font-black leading-[0.85] tracking-tight md:text-7xl lg:text-8xl">SEO / ANALYTICS</h1>
              </div>
              <div className="rounded-xl border-[3px] border-black bg-white p-5 font-mono text-xs leading-6 shadow-xl">
                <p>Laatste dashboard build: {new Date(data.generatedAt).toLocaleString("nl-NL")}</p>
                <p>Periode: {data.dateRange.label}</p>
                <p>Route: /seo-dashboard</p>
              </div>
            </div>
            <BentoGrid className="lg:grid-rows-3">
              {dashboardFeatures.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
              ))}
            </BentoGrid>
          </div>

          <div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {data.executive.cards.map((card) => (
                <div key={card.label} className={`rounded-xl border-[3px] p-5 shadow-xl ${toneClass(card.tone)}`}>
                  <p className="font-mono text-xs uppercase tracking-widest">{card.label}</p>
                  <p className="mt-4 text-4xl md:text-5xl">{card.value}</p>
                  {card.delta ? <p className="mt-2 font-mono text-sm">{card.delta}</p> : null}
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {data.sources.map((source) => <SourcePill key={source.source} source={source} />)}
            </div>
          </div>
        </section>

        <section id="kansen" className="mx-auto grid max-w-5xl gap-6 px-6 pb-12 lg:grid-cols-2 lg:px-10">
        <div className="rounded-[2rem] border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_#000]">
          <h2 className="text-4xl">Belangrijkste kansen</h2>
          <ul className="mt-5 space-y-3 font-mono text-sm leading-6">
            {data.executive.opportunities.map((item) => <li key={item} className="rounded-2xl bg-emerald-100 p-3">↗ {item}</li>)}
          </ul>
        </div>
        <div className="rounded-[2rem] border-[3px] border-black bg-black p-6 text-white shadow-[8px_8px_0_#86efac]">
          <h2 className="text-4xl">Waarschuwingen</h2>
          <ul className="mt-5 space-y-3 font-mono text-sm leading-6">
            {data.executive.warnings.map((item) => <li key={item} className="rounded-2xl bg-white/10 p-3">⚠ {item}</li>)}
          </ul>
        </div>
      </section>

        <section id="traffic-trend" className="mx-auto max-w-5xl px-6 pb-12 lg:px-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em]">GA4 Organic</p>
            <h2 className="text-5xl md:text-7xl">Traffic trend</h2>
          </div>
          <div className="rounded-full border-[3px] border-black bg-white px-5 py-2 font-mono text-sm shadow-[4px_4px_0_#000]">
            {formatNumber(data.ga4.totals.sessions)} sessions · {formatNumber(data.ga4.totals.users)} users
          </div>
        </div>
        <LineChart data={data.ga4.trend} />
      </section>

        <section id="landing-pages" className="mx-auto grid max-w-5xl gap-8 px-6 pb-12 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em]">Landing pages</p>
          <h2 className="mb-5 text-5xl md:text-6xl">Organic top pages</h2>
          <BarChart pages={data.ga4.landingPages} />
        </div>
        <LandingPageTable pages={data.ga4.landingPages} />
      </section>

        <section id="query-intelligence" className="mx-auto max-w-5xl px-6 pb-12 lg:px-10">
        <div className="mb-5">
          <p className="font-mono text-sm uppercase tracking-[0.3em]">GSC Advanced workflows</p>
          <h2 className="text-5xl md:text-7xl">Query & URL intelligence</h2>
        </div>
        <div className="mb-5 flex gap-3 overflow-x-auto pb-2">
          {workflowLabels.map(([id, label, detail]) => (
            <button key={id} type="button" onClick={() => setActiveWorkflow(id)} title={detail} className={`shrink-0 rounded-full border-[3px] border-black px-5 py-3 text-left font-mono text-sm shadow-[4px_4px_0_#000] transition hover:-translate-y-1 ${activeWorkflow === id ? "bg-black text-white" : "bg-white text-black"}`}>
              {label} <span className="opacity-60">({data.gsc[id].length})</span>
            </button>
          ))}
        </div>
        <WorkflowTable rows={activeRows} />
      </section>

        <section id="engagement" className="mx-auto max-w-5xl px-6 pb-16 lg:px-10">
        <div className="mb-5">
          <p className="font-mono text-sm uppercase tracking-[0.3em]">GA4 events & conversions</p>
          <h2 className="text-5xl md:text-7xl">Engagement signals</h2>
        </div>
        <EventList events={data.ga4.events} />
      </section>

        <section id="technical-seo" className="mx-auto max-w-5xl px-6 pb-16 lg:px-10">
        <div className="mb-5">
          <p className="font-mono text-sm uppercase tracking-[0.3em]">CrUX · PageSpeed · Lighthouse</p>
          <h2 className="text-5xl md:text-7xl">Technical SEO</h2>
        </div>
        <TechnicalSeoPanel technical={data.technical} />
      </section>

        <section id="clarity" className="mx-auto max-w-5xl px-6 pb-16 lg:px-10">
        <div className="mb-5">
          <p className="font-mono text-sm uppercase tracking-[0.3em]">Consent · Heatmaps · Recordings</p>
          <h2 className="text-5xl md:text-7xl">Clarity status</h2>
        </div>
        <ClarityPanel clarity={data.clarity} />
      </section>

        <section id="ai-crawlers" className="mx-auto max-w-5xl px-6 pb-16 lg:px-10">
        <div className="mb-5">
          <p className="font-mono text-sm uppercase tracking-[0.3em]">Cloudflare edge logs</p>
          <h2 className="text-5xl md:text-7xl">AI crawler bezoeken</h2>
        </div>
        <BotAnalyticsPanel botAnalytics={data.botAnalytics} />
      </section>

        <section id="historie" className="mx-auto max-w-5xl px-6 pb-16 lg:px-10">
        <div className="mb-5">
          <p className="font-mono text-sm uppercase tracking-[0.3em]">Snapshots door de tijd</p>
          <h2 className="text-5xl md:text-7xl">Beter of slechter?</h2>
        </div>
        <HistoryTrendPanel history={data.history} />
      </section>

        <section id="local-seo" className="mx-auto max-w-5xl px-6 pb-16 lg:px-10">
        <div className="mb-5">
          <p className="font-mono text-sm uppercase tracking-[0.3em]">Google Business Profile</p>
          <h2 className="text-5xl md:text-7xl">Local SEO</h2>
        </div>
        <GbpPanel gbp={data.gbp} />
      </section>
      </main>
      <StickyFooter />
    </div>
  );
}
