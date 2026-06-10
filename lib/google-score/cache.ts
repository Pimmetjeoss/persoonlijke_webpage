import { randomUUID } from "node:crypto"
import { getServerSupabase } from "@/lib/agent-ready/supabase-server"

const TABLE = "google_score_comparisons"

export type GoogleScoreRow = {
  id: string
  uuid: string
  own_domain: string
  competitor1: string
  competitor2: string
  own_dr: number | null
  competitor1_dr: number | null
  competitor2_dr: number | null
  created_at: string
  updated_at: string
}

export async function saveComparison(params: {
  ownDomain: string
  competitor1: string
  competitor2: string
  ownDr: number | null
  competitor1Dr: number | null
  competitor2Dr: number | null
}): Promise<GoogleScoreRow | null> {
  const supabase = getServerSupabase()
  const row = {
    uuid: randomUUID(),
    own_domain: params.ownDomain,
    competitor1: params.competitor1,
    competitor2: params.competitor2,
    own_dr: params.ownDr,
    competitor1_dr: params.competitor1Dr,
    competitor2_dr: params.competitor2Dr,
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single()

  if (error) {
    console.error("[google-score] insert failed:", error.message)
    return null
  }

  return data as GoogleScoreRow
}

export async function getLatestComparisonByDomain(
  ownDomain: string,
): Promise<GoogleScoreRow | null> {
  const supabase = getServerSupabase()
  const normalized = ownDomain.toLowerCase().replace(/^www\./, "")

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("own_domain", normalized)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[google-score] latest lookup failed:", error.message)
    return null
  }

  return (data as GoogleScoreRow | null) ?? null
}
