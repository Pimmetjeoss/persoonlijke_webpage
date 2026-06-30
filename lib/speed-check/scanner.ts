export type Strategy = "mobile" | "desktop"

export type Metric = {
  id: string
  label: string
  value: string
  score: number | null
}

export type SpeedOpportunity = {
  id: string
  title: string
  description: string
  savingsMs?: number
}

export type StrategyResult = {
  strategy: Strategy
  performance: number
  accessibility: number | null
  bestPractices: number | null
  metrics: Metric[]
  opportunities: SpeedOpportunity[]
  error?: string
}

export type SpeedLevel = {
  level: number
  name: string
  range: string
  description: string
  next?: string
  accent: string
}

export type SpeedScanResult = {
  url: string
  domain: string
  score: number
  level: SpeedLevel
  mobile: StrategyResult
  desktop: StrategyResult
  improvements: SpeedOpportunity[]
  cached?: boolean
}

type LighthouseAudit = {
  id?: string
  title?: string
  description?: string
  score?: number | null
  displayValue?: string
  numericValue?: number
  details?: {
    overallSavingsMs?: number
  }
}

type PageSpeedResponse = {
  lighthouseResult?: {
    categories?: Record<string, { score?: number | null }>
    audits?: Record<string, LighthouseAudit>
  }
}

const API_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
const REQUEST_TIMEOUT_MS = 90_000

const METRIC_LABELS: Record<string, string> = {
  "first-contentful-paint": "First Contentful Paint",
  "largest-contentful-paint": "Largest Contentful Paint",
  "speed-index": "Speed Index",
  "total-blocking-time": "Total Blocking Time",
  "cumulative-layout-shift": "Cumulative Layout Shift",
}

const OPPORTUNITY_LABELS: Record<string, string> = {
  "uses-optimized-images": "Afbeeldingen zijn te zwaar",
  "uses-responsive-images": "Afbeeldingen worden groter geladen dan nodig",
  "modern-image-formats": "Afbeeldingen kunnen moderner en kleiner",
  "offscreen-images": "Afbeeldingen buiten beeld laden te vroeg",
  "render-blocking-resources": "JavaScript of CSS blokkeert het laden",
  "unused-javascript": "Ongebruikte JavaScript vertraagt de pagina",
  "unused-css-rules": "Ongebruikte CSS vertraagt de pagina",
  "largest-contentful-paint": "Largest Contentful Paint is te langzaam",
  "server-response-time": "Server reageert te langzaam",
  "uses-long-cache-ttl": "Cache-instellingen kunnen beter",
  "unminified-javascript": "JavaScript kan kleiner gemaakt worden",
  "unminified-css": "CSS kan kleiner gemaakt worden",
  "third-party-summary": "Externe scripts vertragen de pagina",
  "total-byte-weight": "De pagina is te zwaar",
  "bootup-time": "JavaScript opstarttijd is te hoog",
  "mainthread-work-breakdown": "De browser is te lang bezig met scripts",
}

export const SPEED_LEVELS: SpeedLevel[] = [
  {
    level: 1,
    name: "Traag en lek",
    range: "0-39",
    description:
      "Je website voelt op mobiel waarschijnlijk traag. Bezoekers moeten wachten voordat ze iets kunnen doen, waardoor aanvragen kunnen weglekken.",
    next: "Begin met zware afbeeldingen, blokkerende scripts en de grootste LCP-vertrager.",
    accent: "hsl(0 72% 47%)",
  },
  {
    level: 2,
    name: "Kan sneller",
    range: "40-59",
    description:
      "De basis werkt, maar je website mist snelheid. Vooral mobiel kan dit merkbaar zijn voor bezoekers en Google.",
    next: "Pak de top 3 verbeterpunten op en test daarna opnieuw.",
    accent: "hsl(32 95% 44%)",
  },
  {
    level: 3,
    name: "Redelijke basis",
    range: "60-79",
    description:
      "Je website is bruikbaar, maar er zit nog duidelijke winst in laadtijd, stabiliteit of scriptgewicht.",
    next: "Optimaliseer de zwaarste onderdelen om richting groen te gaan.",
    accent: "hsl(48 96% 44%)",
  },
  {
    level: 4,
    name: "Snel genoeg",
    range: "80-89",
    description:
      "Je website staat er goed voor. Met gerichte optimalisaties kun je van snel naar écht strak.",
    next: "Focus op de laatste Lighthouse-waarschuwingen en Core Web Vitals details.",
    accent: "hsl(142.1 76.2% 36.3%)",
  },
  {
    level: 5,
    name: "Turbo",
    range: "90-100",
    description:
      "Je website is snel en geeft bezoekers weinig reden om af te haken door laadtijd.",
    accent: "hsl(142.4 71.8% 29.2%)",
  },
]

export function speedLevel(score: number): SpeedLevel {
  if (score >= 90) return SPEED_LEVELS[4]
  if (score >= 80) return SPEED_LEVELS[3]
  if (score >= 60) return SPEED_LEVELS[2]
  if (score >= 40) return SPEED_LEVELS[1]
  return SPEED_LEVELS[0]
}

function toScore(value: number | null | undefined): number | null {
  if (typeof value !== "number") return null
  return Math.round(value * 100)
}

function categoryScore(payload: PageSpeedResponse, key: string): number | null {
  return toScore(payload.lighthouseResult?.categories?.[key]?.score)
}

function metricFromAudit(id: string, audit?: LighthouseAudit): Metric | null {
  if (!audit) return null
  return {
    id,
    label: METRIC_LABELS[id] ?? audit.title ?? id,
    value: audit.displayValue ?? "-",
    score: toScore(audit.score),
  }
}

function cleanDescription(description: string | undefined): string {
  return (description ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`/g, "")
    .trim()
}

function opportunitiesFromAudits(audits: Record<string, LighthouseAudit> | undefined): SpeedOpportunity[] {
  if (!audits) return []
  const items: SpeedOpportunity[] = []

  for (const [id, fallbackTitle] of Object.entries(OPPORTUNITY_LABELS)) {
    const audit = audits[id]
    if (!audit) continue
    const failed = typeof audit.score === "number" ? audit.score < 0.9 : false
    const savingsMs = audit.details?.overallSavingsMs
    const meaningfulSavings = typeof savingsMs === "number" && savingsMs > 100
    if (!failed && !meaningfulSavings) continue

    const item: SpeedOpportunity = {
      id,
      title: fallbackTitle,
      description: cleanDescription(audit.description) || audit.title || fallbackTitle,
    }
    if (meaningfulSavings) item.savingsMs = Math.round(savingsMs)
    items.push(item)
  }

  return items.sort((a, b) => (b.savingsMs ?? 0) - (a.savingsMs ?? 0)).slice(0, 8)
}

async function fetchPageSpeed(url: string, strategy: Strategy): Promise<StrategyResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const apiUrl = new URL(API_ENDPOINT)
  apiUrl.searchParams.set("url", url)
  apiUrl.searchParams.set("strategy", strategy)
  apiUrl.searchParams.append("category", "performance")
  apiUrl.searchParams.append("category", "accessibility")
  apiUrl.searchParams.append("category", "best-practices")

  const key = process.env.PAGESPEED_INSIGHTS_API_KEY || process.env.GOOGLE_API_KEY
  if (key) apiUrl.searchParams.set("key", key)

  try {
    const res = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      return {
        strategy,
        performance: 0,
        accessibility: null,
        bestPractices: null,
        metrics: [],
        opportunities: [],
        error: `PageSpeed gaf status ${res.status} terug. ${body.slice(0, 120)}`.trim(),
      }
    }

    const json = (await res.json()) as PageSpeedResponse
    const audits = json.lighthouseResult?.audits
    const metrics = Object.keys(METRIC_LABELS)
      .map((id) => metricFromAudit(id, audits?.[id]))
      .filter((metric): metric is Metric => Boolean(metric))

    return {
      strategy,
      performance: categoryScore(json, "performance") ?? 0,
      accessibility: categoryScore(json, "accessibility"),
      bestPractices: categoryScore(json, "best-practices"),
      metrics,
      opportunities: opportunitiesFromAudits(audits).slice(0, 8),
    }
  } catch (err) {
    const message = (err as Error)?.name === "AbortError"
      ? "PageSpeed duurde te lang en is gestopt."
      : "Kon PageSpeed niet bereiken."
    return {
      strategy,
      performance: 0,
      accessibility: null,
      bestPractices: null,
      metrics: [],
      opportunities: [],
      error: message,
    }
  } finally {
    clearTimeout(timer)
  }
}

function mergeImprovements(mobile: StrategyResult, desktop: StrategyResult): SpeedOpportunity[] {
  const seen = new Set<string>()
  const merged: SpeedOpportunity[] = []
  for (const item of [...mobile.opportunities, ...desktop.opportunities]) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    merged.push(item)
  }
  return merged.slice(0, 5)
}

export async function runSpeedScan(params: {
  url: string
  domain: string
}): Promise<SpeedScanResult> {
  const [mobile, desktop] = await Promise.all([
    fetchPageSpeed(params.url, "mobile"),
    fetchPageSpeed(params.url, "desktop"),
  ])

  const score = Math.round(mobile.performance * 0.7 + desktop.performance * 0.3)

  return {
    url: params.url,
    domain: params.domain,
    score,
    level: speedLevel(score),
    mobile,
    desktop,
    improvements: mergeImprovements(mobile, desktop),
  }
}
