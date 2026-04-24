import type {
  CheckRecord,
  IsItAgentReadyResponse,
} from "./schemas"

export type CategoryKey =
  | "discoverability"
  | "contentAccessibility"
  | "botAccessControl"
  | "discovery"
  | "commerce"

export type CategorySummary = {
  key: CategoryKey
  label: string
  pass: number
  fail: number
  neutral: number
  total: number
  percentage: number
}

export type IssueEntry = {
  id: string
  category: CategoryKey
  categoryLabel: string
  checkKey: string
  title: string
  status: "pass" | "fail" | "neutral" | "unableToCheck"
  message: string
}

export type ScanSummary = {
  score: number
  level: number
  levelName: string
  categories: CategorySummary[]
  issues: IssueEntry[]
  passCount: number
  failCount: number
  totalScored: number
}

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  discoverability: "Vindbaarheid",
  contentAccessibility: "Content",
  botAccessControl: "Bot-toegang",
  discovery: "Protocol-ontdekking",
  commerce: "Commerce",
}

const CHECK_LABELS_NL: Record<string, string> = {
  robotsTxt: "robots.txt",
  sitemap: "sitemap.xml",
  linkHeaders: "Link headers (RFC 8288)",
  markdownNegotiation: "Markdown voor agents",
  llmsTxt: "llms.txt",
  robotsTxtAiRules: "AI-bot regels",
  contentSignals: "Content Signals",
  webBotAuth: "Web Bot Auth",
  apiCatalog: "API Catalog",
  oauthDiscovery: "OAuth discovery",
  oauthProtectedResource: "OAuth Protected Resource",
  mcpServerCard: "MCP Server Card",
  a2aAgentCard: "A2A Agent Card",
  agentSkills: "Agent Skills",
  webMcp: "WebMCP",
  x402: "x402 (Payment Required)",
  mpp: "MPP",
  ucp: "Universal Commerce Protocol",
  acp: "Agentic Commerce Protocol",
  ap2: "AP2",
}

export function checkLabel(key: string): string {
  return CHECK_LABELS_NL[key] ?? key
}

export function categoryLabel(key: CategoryKey | string): string {
  return CATEGORY_LABELS[key as CategoryKey] ?? key
}

const SCORING_CATEGORIES: CategoryKey[] = [
  "discoverability",
  "contentAccessibility",
  "botAccessControl",
  "discovery",
]

export function summarize(response: IsItAgentReadyResponse): ScanSummary {
  const categories: CategorySummary[] = []
  const issues: IssueEntry[] = []
  let passCount = 0
  let failCount = 0
  let totalScored = 0

  const allCategories = Object.keys(response.checks ?? {}) as CategoryKey[]

  for (const catKey of allCategories) {
    const checks = response.checks[catKey] ?? {}
    let pass = 0
    let fail = 0
    let neutral = 0
    const total = Object.keys(checks).length

    for (const [checkKey, check] of Object.entries(checks)) {
      const c = check as CheckRecord
      if (c.status === "pass") pass += 1
      else if (c.status === "fail") fail += 1
      else neutral += 1

      issues.push({
        id: `${catKey}.${checkKey}`,
        category: catKey,
        categoryLabel: categoryLabel(catKey),
        checkKey,
        title: checkLabel(checkKey),
        status: c.status,
        message: c.message ?? "",
      })
    }

    const scored = pass + fail
    const percentage = scored === 0 ? 0 : Math.round((pass / scored) * 100)
    categories.push({
      key: catKey,
      label: categoryLabel(catKey),
      pass,
      fail,
      neutral,
      total,
      percentage,
    })

    if (SCORING_CATEGORIES.includes(catKey)) {
      passCount += pass
      failCount += fail
      totalScored += pass + fail
    }
  }

  const score =
    totalScored === 0 ? 0 : Math.round((passCount / totalScored) * 100)

  issues.sort((a, b) => {
    const order = { fail: 0, unableToCheck: 1, neutral: 2, pass: 3 } as const
    return order[a.status] - order[b.status]
  })

  return {
    score,
    level: response.level,
    levelName: response.levelName,
    categories,
    issues,
    passCount,
    failCount,
    totalScored,
  }
}
