import { NextResponse } from "next/server"
import { ScanRequestSchema } from "@/lib/agent-ready/schemas"
import type { IsItAgentReadyResponse } from "@/lib/agent-ready/schemas"
import { validateScanTarget } from "@/lib/agent-ready/url"
import { runScan } from "@/lib/agent-ready/isitagentready"
import { summarize } from "@/lib/agent-ready/scoring"
import {
  countRecentScansByIp,
  getCachedScan,
  hashIp,
  RATE_LIMIT_MAX,
  saveScanResult,
} from "@/lib/agent-ready/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type FailingCheck = { check: string; category: string; message: string }

type ScanData = {
  domain: string
  cached: boolean
  score: number
  level: number
  levelName: string
  reportUrl: string
  failing: FailingCheck[]
}

type ApiResponse = {
  success: boolean
  data?: ScanData
  error?: string
}

/**
 * Bouwt de publieke samenvatting voor de API-response uit een ruwe scan.
 * Alleen de kern-checks (niet-commerce) die gezakt zijn worden als "failing"
 * teruggegeven — dat zijn de checks die de score drukken.
 */
function buildScanData(
  domain: string,
  cached: boolean,
  raw: IsItAgentReadyResponse,
): ScanData {
  const summary = summarize(raw)
  const failing: FailingCheck[] = summary.issues
    .filter((i) => i.status === "fail" && i.category !== "commerce")
    .map((i) => ({ check: i.checkKey, category: i.category, message: i.message }))
  return {
    domain,
    cached,
    score: summary.score,
    level: summary.level,
    levelName: summary.levelName,
    reportUrl: `https://code-lieshout.nl/agent-ready/${domain}`,
    failing,
  }
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  const real = req.headers.get("x-real-ip")
  if (real) return real.trim()
  return "anon"
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Ongeldige JSON body." },
      { status: 400 },
    )
  }

  const parsed = ScanRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Geen URL meegegeven." },
      { status: 400 },
    )
  }

  const validated = validateScanTarget(parsed.data.url)
  if (!validated.ok) {
    return NextResponse.json(
      { success: false, error: validated.error },
      { status: 400 },
    )
  }

  const { url, domain } = validated
  const ipHash = hashIp(clientIp(req))

  try {
    const cached = await getCachedScan(domain)
    if (cached && cached.raw) {
      return NextResponse.json({
        success: true,
        data: buildScanData(domain, true, cached.raw),
      })
    }

    const recent = await countRecentScansByIp(ipHash)
    if (recent >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Je hebt de limiet van scans per uur bereikt. Probeer het later opnieuw.",
        },
        { status: 429 },
      )
    }

    const outcome = await runScan(url.toString())
    if (!outcome.ok) {
      return NextResponse.json(
        { success: false, error: outcome.error.message },
        { status: 502 },
      )
    }

    const saved = await saveScanResult({
      domain,
      url: url.toString(),
      ipHash,
      response: outcome.data,
    })

    if (!saved) {
      return NextResponse.json(
        {
          success: false,
          error: "Scan gelukt, maar opslaan mislukte. Probeer opnieuw.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: buildScanData(domain, false, outcome.data),
    })
  } catch (err) {
    console.error("[agent-ready] scan route failed:", err)
    return NextResponse.json(
      { success: false, error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 },
    )
  }
}
