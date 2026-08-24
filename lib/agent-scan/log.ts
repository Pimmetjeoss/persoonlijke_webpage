import { randomUUID, createHash } from "node:crypto"
import { getServerSupabase } from "@/lib/agent-ready/supabase-server"
import type { Report } from "./schemas"

const TABLE = "agent_scan_reports"

function dailySalt(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

/**
 * Dagelijks gezouten SHA-256 hash van het IP: onmogelijk te herleiden naar
 * een bezoeker, maar wel bruikbaar om misbruik per dag te herkennen.
 */
export function hashIp(ip: string | null | undefined): string {
  const safe = (ip ?? "anon").slice(0, 64)
  return createHash("sha256").update(`${safe}|${dailySalt()}`).digest("hex")
}

/**
 * Schrijf-alleen logregel: leg vast dat er een scan is aangevraagd.
 * De tool leest nooit uit deze tabel — Is Agentic is de enige bron
 * van rapporten. Fouten hier worden genegeerd (logging mag de scan
 * nooit blokkeren).
 */
export async function logScanRequest(params: {
  domain: string
  url: string
  ipHash: string
  report?: Report | null
}): Promise<void> {
  try {
    const supabase = getServerSupabase()
    const report = params.report ?? null
    await supabase.from(TABLE).insert({
      uuid: randomUUID(),
      domain: params.domain,
      url: params.url,
      status: report ? "done" : "pending",
      score: report?.score ?? null,
      score_label: report?.score_label ?? null,
      raw: null,
      ip_hash: params.ipHash,
    })
  } catch {
    // Logging is optioneel — stil negeren.
  }
}
