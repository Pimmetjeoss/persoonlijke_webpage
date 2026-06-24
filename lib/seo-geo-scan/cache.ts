import { randomUUID } from "node:crypto"
import { getServerSupabase } from "@/lib/agent-ready/supabase-server"

const TABLE = "seo_geo_scan_requests"

export type SeoGeoScanRequestRow = {
  id: string
  uuid: string
  name: string
  email: string
  phone: string | null
  website: string
  current_score: number | null
  notes: string | null
  source: string
  status: "new" | "contacted" | "done"
  created_at: string
  updated_at: string
}

export async function saveSeoGeoScanRequest(params: {
  name: string
  email: string
  phone: string
  website: string
  currentScore?: number | null
  notes: string
  source?: string
}): Promise<SeoGeoScanRequestRow | null> {
  const supabase = getServerSupabase()
  const row = {
    uuid: randomUUID(),
    name: params.name,
    email: params.email,
    phone: params.phone,
    website: params.website,
    current_score: params.currentScore ?? null,
    notes: params.notes,
    source: params.source ?? "google-score-level-up",
    status: "new" as const,
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single()

  if (error) {
    console.error("[seo-geo-scan] insert failed:", error.message)
    return null
  }

  return data as SeoGeoScanRequestRow
}
