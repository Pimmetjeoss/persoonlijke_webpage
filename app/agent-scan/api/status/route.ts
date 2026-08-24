import { NextResponse } from "next/server"
import { canonicalTarget, getReport, ScanError } from "@/lib/agent-scan/is-agentic"

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
    // Rapport direct bij Is Agentic opvragen.
    const target = canonicalTarget(domain)
    const report = await getReport(target)
    if (report) {
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
