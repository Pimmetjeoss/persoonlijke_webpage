import { NextResponse } from "next/server"
import { z } from "zod"
import { validateScanTarget } from "@/lib/agent-ready/url"
import { runSpeedScan, type SpeedScanResult } from "@/lib/speed-check/scanner"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const INPUT_SCHEMA = z.object({
  url: z.string().min(1, "Voer een URL in."),
})

type ApiResponse = {
  success: boolean
  data?: SpeedScanResult
  error?: string
}

const WINDOW_MS = 60 * 60 * 1000
const MAX_REQUESTS = 6
const recentByIp = new Map<string, number[]>()

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]?.trim() || "anon"
  return req.headers.get("x-real-ip")?.trim() || "anon"
}

function allowed(ip: string): boolean {
  const now = Date.now()
  const fresh = (recentByIp.get(ip) ?? []).filter((ts) => now - ts < WINDOW_MS)
  if (fresh.length >= MAX_REQUESTS) {
    recentByIp.set(ip, fresh)
    return false
  }
  fresh.push(now)
  recentByIp.set(ip, fresh)
  return true
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

  const parsed = INPUT_SCHEMA.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." },
      { status: 400 },
    )
  }

  const target = validateScanTarget(parsed.data.url)
  if (!target.ok) {
    return NextResponse.json(
      { success: false, error: target.error },
      { status: 400 },
    )
  }

  if (!allowed(clientIp(req))) {
    return NextResponse.json(
      {
        success: false,
        error: "Je hebt de limiet van gratis scans per uur bereikt. Probeer het later opnieuw.",
      },
      { status: 429 },
    )
  }

  try {
    const data = await runSpeedScan({
      url: target.url.toString(),
      domain: target.domain,
    })

    if (data.mobile.error && data.desktop.error) {
      return NextResponse.json(
        { success: false, error: data.mobile.error },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("[speed-check] scan failed", err)
    return NextResponse.json(
      { success: false, error: "Er ging iets mis tijdens de snelheidsscan." },
      { status: 500 },
    )
  }
}
