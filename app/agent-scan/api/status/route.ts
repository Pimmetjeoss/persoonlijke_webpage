import { NextResponse } from "next/server"
import { canonicalTarget, getReport, ScanError } from "@/lib/agent-scan/is-agentic"
import { getDoneByDomain, saveReport } from "@/lib/agent-scan/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

function normalizeDomain(raw: string | null): string | null {
  if (!raw) return null
  const decoded = decodeURIComponent(raw).trim().toLowerCase()
  if (!decoded) return null
  return decoded.replace(/^www\./, "")
}

export async function GET(req: Request): Promise<NextResponse> {
  const domain = normalizeDomain(new URL(req.url).searchParams.get("domain"))
  if (!domain) {
    return NextResponse.json({ status: "scanning" })
  }

  try {
    // 1. Recent afgerond resultaat uit de eigen cache.
    const done = await getDoneByDomain(domain)
    if (done && done.raw) {
      return NextResponse.json({ status: "done", report: done.raw })
    }

    // 2. Rapport direct bij Is Agentic opvragen (ook wanneer de eigen cache
    //    ontbreekt maar de scanservice het inmiddels heeft afgerond).
    const target = canonicalTarget(domain)
    const report = await getReport(target)
    if (report) {
      await saveReport({ domain, url: target, report })
      return NextResponse.json({ status: "done", report })
    }

    return NextResponse.json({ status: "scanning" })
  } catch (err) {
    if (err instanceof ScanError) {
      // Transient: laat de client gewoon blijven pollen.
      return NextResponse.json({ status: "scanning" })
    }
    console.error("[agent-scan] status route failed:", err)
    return NextResponse.json({ status: "scanning" })
  }
}
