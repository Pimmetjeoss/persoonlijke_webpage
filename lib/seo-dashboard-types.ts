export type SourceStatus = "ok" | "partial" | "unavailable" | "error";

export interface MetricCard {
  label: string;
  value: string;
  delta?: string;
  tone: "positive" | "negative" | "neutral" | "warning";
}

export interface DataSourceInfo {
  source: "gsc" | "ga4" | "pagespeed" | "crux" | "gbp";
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

export interface WebVitalMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  displayValue: string;
  status: "good" | "needs-improvement" | "poor" | "unknown";
  p75?: number;
}

export interface PageSpeedResult {
  page: string;
  strategy: "mobile" | "desktop" | string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  coreWebVitals: WebVitalMetric[];
  fieldStatus: SourceStatus;
}

export interface CruxResult {
  formFactor: string;
  metrics: WebVitalMetric[];
  collectionPeriod?: string;
}

export interface TechnicalSeo {
  pagespeed: PageSpeedResult[];
  crux: CruxResult[];
}

export interface GbpMetric {
  label: string;
  value: number;
  delta?: number;
}

export interface GbpReview {
  author?: string;
  rating: number;
  comment?: string;
  date?: string;
}

export interface GbpLocalSeo {
  totals: {
    profileViews: number;
    searches: number;
    websiteClicks: number;
    calls: number;
    directionRequests: number;
    rating: number;
    reviewCount: number;
  };
  metrics: GbpMetric[];
  reviews: GbpReview[];
}

export interface SeoHistoryPoint {
  generatedAt: string;
  date: string;
  gscRows: number;
  quickWins: number;
  organicSessions: number;
  techScore: number;
  mobilePerformance: number;
  desktopPerformance: number;
  gbpWebsiteClicks: number;
  okSources: number;
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
  technical: TechnicalSeo;
  gbp: GbpLocalSeo;
  history: SeoHistoryPoint[];
}
