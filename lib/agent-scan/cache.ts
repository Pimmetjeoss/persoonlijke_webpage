import { randomUUID, createHash } from "node:crypto"
import { getServerSupabase } from "@/lib/agent-ready/supabase-server"
import type { Report } from "./schemas"

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
export const RATE_LIMIT_MAX = 5

const TABLE = "agent_scan_reports"

export type ReportRow = {
  id: string
  uuid: string
  domain: string
  url: string
  status: "pending" | "done" | "error"
  score: number | null
  score_label: string | null
  raw: Report | null
  ip_hash: string | null
  created_at: string
  updated_at: string
}

function dailySalt(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

function getOptionalSupabase() {
  try {
    return getServerSupabase()
  } catch (err) {
    console.error("[agent-scan] supabase unavailable:", (err as Error).message)
    return null
  }
}

export function hashIp(ip: string | null | undefined): string {
  const safe = (ip ?? "anon").slice(0, 64)
  return createHash("sha256").update(`${safe}|${dailySalt()}`).digest("hex")
}

export async function getDoneByDomain(domain: string): Promise<ReportRow | null> {
  const supabase = getOptionalSupabase()
  if (!supabase) return null

  const threshold = new Date(Date.now() - CACHE_TTL_MS).toISOString()
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("domain", domain)
    .eq("status", "done")
    .gte("created_at", threshold)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error("[agent-scan] cache lookup failed:", error.message)
    return null
  }
  return (data as ReportRow | null) ?? null
}

export async function getLatestByDomain(domain: string): Promise<ReportRow | null> {
  const supabase = getOptionalSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("domain", domain)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error("[agent-scan] latest lookup failed:", error.message)
    return null
  }
  return (data as ReportRow | null) ?? null
}

export async function countRecentByIp(ipHash: string): Promise<number> {
  const supabase = getOptionalSupabase()
  if (!supabase) return 0

  const threshold = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const { count, error } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", threshold)
  if (error) {
    console.error("[agent-scan] rate-limit count failed:", error.message)
    return 0
  }
  return count ?? 0
}

export async function savePending(params: {
  domain: string
  url: string
  ipHash: string
}): Promise<ReportRow | null> {
  const supabase = getOptionalSupabase()
  if (!supabase) return null

  const row = {
    uuid: randomUUID(),
    domain: params.domain,
    url: params.url,
    status: "pending" as const,
    score: null,
    score_label: null,
    raw: null,
    ip_hash: params.ipHash,
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single()
  if (error) {
    console.error("[agent-scan] pending insert failed:", error.message)
    return null
  }
  return data as ReportRow
}

export async function saveReport(params: {
  domain: string
  url: string
  report: Report
}): Promise<ReportRow | null> {
  const supabase = getOptionalSupabase()
  if (!supabase) return null

  const row = {
    uuid: randomUUID(),
    domain: params.domain,
    url: params.url,
    status: "done" as const,
    score: params.report.score,
    score_label: params.report.score_label,
    raw: params.report as unknown as Record<string, unknown>,
    ip_hash: null,
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single()
  if (error) {
    console.error("[agent-scan] report insert failed:", error.message)
    return null
  }
  return data as ReportRow
}
