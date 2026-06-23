import { randomUUID } from "node:crypto"
import { getServerSupabase } from "@/lib/agent-ready/supabase-server"

const TABLE = "chatgpt_check_scans"

export type ChatGPTCheckRow = {
  id: string
  uuid: string
  domain: string
  own_url: string
  competitor_url: string
  own_markdown: string | null
  competitor_markdown: string | null
  own_metadata: Record<string, string> | null
  competitor_metadata: Record<string, string> | null
  insights: string[] | null
  status: "pending" | "done" | "error"
  created_at: string
  updated_at: string
}

export async function saveComparison(params: {
  domain: string
  ownUrl: string
  competitorUrl: string
  ownMarkdown: string
  competitorMarkdown: string
  ownMetadata: Record<string, string>
  competitorMetadata: Record<string, string>
  insights: string[]
}): Promise<ChatGPTCheckRow | null> {
  const supabase = getServerSupabase()

  const row = {
    uuid: randomUUID(),
    domain: params.domain,
    own_url: params.ownUrl,
    competitor_url: params.competitorUrl,
    own_markdown: params.ownMarkdown,
    competitor_markdown: params.competitorMarkdown,
    own_metadata: params.ownMetadata,
    competitor_metadata: params.competitorMetadata,
    insights: params.insights,
    status: "done" as const,
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single()

  if (error) {
    console.error("[chatgpt-check] insert failed:", error.message)
    return null
  }

  return data as ChatGPTCheckRow
}

export async function getLatestComparisonByDomain(
  domain: string,
): Promise<ChatGPTCheckRow | null> {
  const supabase = getServerSupabase()
  const normalized = domain.toLowerCase()

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("domain", normalized)
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[chatgpt-check] latest lookup failed:", error.message)
    return null
  }

  return (data as ChatGPTCheckRow | null) ?? null
}
