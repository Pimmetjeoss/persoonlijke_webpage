import { ReportSchema, type Report } from "./schemas"

const API_ORIGIN = "https://is-agentic.com"
const USER_AGENT = "code-lieshout-agent-scan/1.0"

export class ScanError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = "ScanError"
    this.code = code
  }
}

export function canonicalTarget(domain: string): string {
  return `https://${domain}`
}

/**
 * Haalt het laatst afgeronde Is Agentic rapport op voor een publieke URL.
 * Retourneert `null` wanneer er nog geen rapport bestaat (HTTP 404), zodat
 * de caller kan besluiten een verse scan te starten.
 */
export async function getReport(target: string): Promise<Report | null> {
  const endpoint = new URL("/api/v1/report", API_ORIGIN)
  endpoint.searchParams.set("url", target)

  let res: Response
  try {
    res = await fetch(endpoint, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new ScanError(
      "report_unreachable",
      "De scanservice is tijdelijk niet bereikbaar.",
    )
  }

  if (res.status === 404) return null
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      code?: string
      detail?: string
    } | null
    throw new ScanError(
      body?.code ?? "report_fetch_failed",
      body?.detail ?? "Het rapport kon niet worden opgehaald.",
    )
  }

  const parsed = ReportSchema.safeParse(await res.json())
  if (!parsed.success) {
    throw new ScanError(
      "invalid_report",
      "De scanservice gaf een ongeldig rapport terug.",
    )
  }
  return parsed.data
}

function sseData(frame: string): unknown {
  const data = frame
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n")
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

/**
 * Start een verse scan door de (ongedocumenteerde maar door de officiële CLI
 * gebruikte) SSE-stream aan te roepen. We lezen slechts tot `scan_init` om te
 * bevestigen dat de scan daadwerkelijk is gestart, en breken daarna af — de
 * scan loopt server-side gewoon door. Daarna pollt de caller het rapport op.
 */
export async function triggerScan(target: string): Promise<void> {
  const endpoint = new URL("/api/scan/stream", API_ORIGIN)
  endpoint.searchParams.set("target", target)

  let res: Response
  try {
    res = await fetch(endpoint, {
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-store",
        "User-Agent": USER_AGENT,
      },
      signal: AbortSignal.timeout(12000),
    })
  } catch {
    // Netwerk/timeout: de scan is mogelijk server-side tóch gestart.
    // Geef geen harde fout — de frontend pollt het rapport en wijst uit.
    return
  }

  if (!res.ok || !res.body) {
    if (res.status === 429) {
      throw new ScanError(
        "scan_rate_limited",
        "Er lopen te veel scans. Probeer het over een minuut opnieuw.",
      )
    }
    throw new ScanError(
      "scan_start_failed",
      `De scan kon niet starten (HTTP ${res.status}).`,
    )
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let started = false
  let failed = false

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n")
      let boundary
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        const event = sseData(frame) as { type?: string } | null
        if (!event || typeof event !== "object") continue
        if (event.type === "scan_init") started = true
        if (event.type === "error") failed = true
      }
      if (started || failed) break
    }
  } catch {
    // Timeout/abort tijdens het lezen: de scan is hoogstwaarschijnlijk
    // server-side toch gestart. We laten de caller gewoon pollen.
  } finally {
    await reader.cancel().catch(() => {})
  }

  if (failed) {
    throw new ScanError(
      "scan_failed",
      "De scanservice kon de scan niet afronden.",
    )
  }
}
