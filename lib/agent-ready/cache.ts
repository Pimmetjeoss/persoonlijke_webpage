import { randomUUID, createHash } from "node:crypto"
import { getServerSupabase } from "./supabase-server"
import type { IsItAgentReadyResponse } from "./schemas"
import { summarize } from "./scoring"
import { isCacheableScan } from "./quality"

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
export const RATE_LIMIT_MAX = 10

const TABLE = "agent_ready_scans"
const CACHE_LOOKBACK_LIMIT = 5

export type ScanRow = {
  id: string
  uuid: string
  domain: string
  url: string
  status: "pending" | "done" | "error"
  score: number | null
  level: number | null
  categories: unknown
  issues: unknown
  raw: IsItAgentReadyResponse | null
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
    console.error("[agent-ready] supabase unavailable:", (err as Error).message)
    return null
  }
}

export function hashIp(ip: string | null | undefined): string {
  const safe = (ip ?? "anon").slice(0, 64)
  return createHash("sha256").update(`${safe}|${dailySalt()}`).digest("hex")
}

export async function getCachedScan(domain: string): Promise<ScanRow | null> {
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
    .limit(CACHE_LOOKBACK_LIMIT)
  if (error) {
    console.error("[agent-ready] cache lookup failed:", error.message)
    return null
  }

  const rows = (data as ScanRow[] | null) ?? []
  return rows.find((row) => isCacheableScan(row.raw)) ?? null
}

export async function getLatestScanByDomain(domain: string): Promise<ScanRow | null> {
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
    console.error("[agent-ready] latest lookup failed:", error.message)
    return null
  }
  return (data as ScanRow | null) ?? null
}

export async function countRecentScansByIp(ipHash: string): Promise<number> {
  const supabase = getOptionalSupabase()
  if (!supabase) return 0

  const threshold = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const { count, error } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", threshold)
  if (error) {
    console.error("[agent-ready] rate-limit count failed:", error.message)
    return 0
  }
  return count ?? 0
}

export async function saveScanResult(params: {
  domain: string
  url: string
  ipHash: string
  response: IsItAgentReadyResponse
}): Promise<ScanRow | null> {
  const supabase = getOptionalSupabase()
  if (!supabase) return null

  const summary = summarize(params.response)
  const row = {
    uuid: randomUUID(),
    domain: params.domain,
    url: params.url,
    status: "done" as const,
    score: summary.score,
    level: summary.level,
    categories: summary.categories,
    issues: summary.issues,
    raw: params.response,
    ip_hash: params.ipHash,
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single()
  if (error) {
    console.error("[agent-ready] insert failed:", error.message)
    return null
  }
  return data as ScanRow
}
