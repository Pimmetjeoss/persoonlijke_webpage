export type SourceStatus = "ok" | "partial" | "unavailable" | "error";

export interface MetricCard {
  label: string;
  value: string;
  delta?: string;
  tone: "positive" | "negative" | "neutral" | "warning";
}

export interface DataSourceInfo {
  source: "gsc" | "ga4";
  status: SourceStatus;
  generatedAt?: string;
  detail?: string;
  rows?: number;
}

export interface GscWorkflowRow {
  id: string;
  query?: string;
  page?: string;
  metric?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  deltaClicks?: number;
  deltaImpressions?: number;
  opportunity?: number;
  issue?: string;
  date?: string;
}

export interface GscWorkflows {
  quickWins: GscWorkflowRow[];
  cannibalization: GscWorkflowRow[];
  compare: GscWorkflowRow[];
  decaying: GscWorkflowRow[];
  newQueries: GscWorkflowRow[];
  cliff: GscWorkflowRow[];
  outliers: GscWorkflowRow[];
  sitemapWatch: GscWorkflowRow[];
  coverageDrift: GscWorkflowRow[];
}

export interface TimeSeriesPoint {
  date: string;
  clicks?: number;
  impressions?: number;
  sessions?: number;
  users?: number;
  engagementRate?: number;
  conversions?: number;
}

export interface LandingPageMetric {
  page: string;
  sessions: number;
  users: number;
  engagementRate: number;
  conversions: number;
  gscClicks?: number;
  gscImpressions?: number;
}

export interface EventMetric {
  name: string;
  count: number;
  conversions?: number;
}

export interface Ga4Organic {
  totals: {
    sessions: number;
    users: number;
    pageviews: number;
    conversions: number;
    engagementRate: number;
  };
  trend: TimeSeriesPoint[];
  landingPages: LandingPageMetric[];
  events: EventMetric[];
}

export interface SeoDashboardData {
  generatedAt: string;
  site: string;
  dateRange: { start: string; end: string; label: string };
  sources: DataSourceInfo[];
  executive: {
    cards: MetricCard[];
    opportunities: string[];
    warnings: string[];
  };
  gsc: GscWorkflows;
  ga4: Ga4Organic;
}
