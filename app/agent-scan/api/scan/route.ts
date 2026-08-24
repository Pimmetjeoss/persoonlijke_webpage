import { NextResponse } from "next/server"
import { ScanRequestSchema } from "@/lib/agent-scan/schemas"
import { validateScanTarget } from "@/lib/agent-ready/url"
import {
  canonicalTarget,
  getReport,
  triggerScan,
  ScanError,
} from "@/lib/agent-scan/is-agentic"
import {
  countRecentByIp,
  getDoneByDomain,
  hashIp,
  RATE_LIMIT_MAX,
  savePending,
  saveReport,
} from "@/lib/agent-scan/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

type ApiResponse = {
  success: boolean
  data?: { domain: string; scanning?: boolean }
  error?: string
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

  const domain = validated.domain
  const target = canonicalTarget(domain)
  const ipHash = hashIp(clientIp(req))

  try {
    // 1. Serveer een recent gecacht resultaat wanneer beschikbaar.
    const cached = await getDoneByDomain(domain)
    if (cached && cached.raw) {
      return NextResponse.json({ success: true, data: { domain } })
    }

    // 2. Rate-limit per bezoeker-IP (de scanservice zelf is ook begrensd).
    const recent = await countRecentByIp(ipHash)
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

    // 3. Bestaand rapport ophalen (geen verse scan nodig).
    const report = await getReport(target)
    if (report) {
      await saveReport({ domain, url: target, report })
      return NextResponse.json({ success: true, data: { domain } })
    }

    // 4. Nog geen rapport — start een verse scan en geef direct een
    //    "pending" status terug. De detailpagina pollt tot het klaar is.
    await triggerScan(target)
    await savePending({ domain, url: target, ipHash })

    return NextResponse.json({
      success: true,
      data: { domain, scanning: true },
    })
  } catch (err) {
    if (err instanceof ScanError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 502 },
      )
    }
    console.error("[agent-scan] scan route failed:", err)
    return NextResponse.json(
      { success: false, error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 },
    )
  }
}
