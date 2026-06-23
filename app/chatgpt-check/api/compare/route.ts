import { NextResponse } from "next/server"
import { z } from "zod"
import { saveComparison } from "@/lib/chatgpt-check/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const INPUT_SCHEMA = z.object({
  ownUrl: z.string().min(1, "Vul je eigen URL in."),
  competitorUrl: z.string().min(1, "Vul de URL van je concurrent in."),
})

type ScrapeData = {
  url: string
  domain: string
  markdown?: string
  metadata?: Record<string, string>
  error?: string
}

type CompareResponse = {
  success: boolean
  data?: {
    domain: string
    own: ScrapeData
    competitor: ScrapeData
    insights: string[]
  }
  error?: string
}

function extractDomain(raw: string): string {
  try {
    const hasProtocol = /^https?:\/\//i.test(raw)
    const url = new URL(hasProtocol ? raw : `https://${raw}`)
    return url.hostname.replace(/^www\./, "")
  } catch {
    return raw.trim().replace(/^www\./, "")
  }
}

function cleanUrl(raw: string): string {
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

async function scrapeUrl(url: string): Promise<ScrapeData> {
  const domain = extractDomain(url)
  const clean = cleanUrl(url)

  const firecrawlKey = process.env.FIRECRAWL_API_KEY

  if (!firecrawlKey) {
    return { url: clean, domain, error: "Firecrawl API key niet geconfigureerd." }
  }

  try {
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url: clean,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => "")
      return {
        url: clean,
        domain,
        error: `Firecrawl fout (${res.status}): ${errBody.slice(0, 200)}`,
      }
    }

    const json = (await res.json()) as {
      success: boolean
      data?: {
        markdown?: string
        metadata?: Record<string, unknown>
      }
      error?: string
    }

    if (!json.success || !json.data) {
      return {
        url: clean,
        domain,
        error: json.error ?? "Onbekende fout bij ophalen pagina.",
      }
    }

    // Convert metadata values to strings
    const meta: Record<string, string> = {}
    if (json.data.metadata) {
      for (const [k, v] of Object.entries(json.data.metadata)) {
        if (v !== undefined && v !== null) {
          meta[k] = String(v)
        }
      }
    }

    return {
      url: clean,
      domain,
      markdown: json.data.markdown ?? "",
      metadata: meta,
    }
  } catch (err) {
    console.error("[chatgpt-check] scrape failed", err)
    return {
      url: clean,
      domain,
      error: "Kon geen verbinding maken met Firecrawl.",
    }
  }
}

function generateInsights(
  own: ScrapeData,
  competitor: ScrapeData,
): string[] {
  const insights: string[] = []

  const ownMeta = own.metadata ?? {}
  const compMeta = competitor.metadata ?? {}

  // 1. Title length comparison
  const ownTitle = ownMeta.title ?? ownMeta.ogTitle ?? ""
  const compTitle = compMeta.title ?? compMeta.ogTitle ?? ""

  if (ownTitle && compTitle) {
    if (ownTitle.length < 30 && compTitle.length >= 30) {
      insights.push(
        `Jouw titel (${ownTitle.length} tekens) is kort — ${competitor.domain} gebruikt ${compTitle.length} tekens voor een rijkere title tag.`,
      )
    } else if (compTitle.length < 30 && ownTitle.length >= 30) {
      insights.push(
        `Jouw title tag is sterker (${ownTitle.length} tekens) dan die van ${competitor.domain} (${compTitle.length} tekens).`,
      )
    }
  }

  // 2. Meta description
  const ownDesc = ownMeta.description ?? ownMeta.ogDescription ?? ""
  const compDesc = compMeta.description ?? compMeta.ogDescription ?? ""
  // Also check og:description (Firecrawl sometimes puts it under different keys)
  const ownOgDesc = ownMeta["og:description"] ?? ""
  const compOgDesc = compMeta["og:description"] ?? ""
  const ownHasDesc = ownDesc.length > 10 || ownOgDesc.length > 10
  const compHasDesc = compDesc.length > 10 || compOgDesc.length > 10

  if (!ownHasDesc && compHasDesc) {
    insights.push(
      `Jij hebt geen (goede) meta description — ${competitor.domain} wél. AI gebruikt dit als samenvatting van je pagina.`,
    )
  } else if (ownHasDesc && !compHasDesc) {
    insights.push(
      `${competitor.domain} mist een meta description. Jij hebt er wél een — dat geeft jou een voorsprong in AI-chats.`,
    )
  }

  // 3. OG Image
  const ownOg = ownMeta.ogImage || ownMeta["og:image"]
  const compOg = compMeta.ogImage || compMeta["og:image"]
  if (!ownOg && compOg) {
    insights.push(
      `Jij hebt geen OG image — ${competitor.domain} wél. AI-chats tonen hun preview-plaatje, die van jou niet.`,
    )
  } else if (ownOg && !compOg) {
    insights.push(
      `${competitor.domain} mist een OG image. Jouw pagina heeft er wél een — jouw site oogt beter in AI-chats.`,
    )
  }

  // 4. Content length
  const ownLen = own.markdown?.length ?? 0
  const compLen = competitor.markdown?.length ?? 0
  if (ownLen > 0 && compLen > 0) {
    if (ownLen < compLen * 0.5) {
      insights.push(
        `${competitor.domain} heeft veel meer tekstinhoud (${compLen.toLocaleString()} vs ${ownLen.toLocaleString()} karakters). AI ziet hen als informatiever.`,
      )
    } else if (compLen < ownLen * 0.5) {
      insights.push(
        `Jouw pagina heeft meer inhoud (${ownLen.toLocaleString()} vs ${compLen.toLocaleString()} karakters) — AI ziet jou als de rijkere bron.`,
      )
    }
  }

  // 5. Hidden pricing (B2B pattern)
  const ownPrice = ownMeta["product:price:amount"]
  const compPrice = compMeta["product:price:amount"]
  if (compPrice === "0" || compPrice === "0.00") {
    insights.push(
      `${competitor.domain} toont prijs als €0 in de metadata — AI denkt dat hun producten gratis zijn! Prijzen zitten waarschijnlijk achter een login.`,
    )
  }
  if (ownPrice === "0" || ownPrice === "0.00") {
    insights.push(
      `Jouw site toont prijs als €0 in de metadata — AI denkt dat jouw producten gratis zijn. Overweeg tenminste 'vanaf'-prijzen in de meta tags.`,
    )
  }

  // 6. Heading structure (count # and ## in markdown)
  const ownH1 = (own.markdown ?? "").match(/^# /gm)?.length ?? 0
  const compH1 = (competitor.markdown ?? "").match(/^# /gm)?.length ?? 0
  const ownH2 = (own.markdown ?? "").match(/^## /gm)?.length ?? 0
  const compH2 = (competitor.markdown ?? "").match(/^## /gm)?.length ?? 0

  if (ownH1 === 0 && compH1 > 0) {
    insights.push(`Jouw pagina heeft geen H1-heading — ${competitor.domain} wél (${compH1}x). AI kan je hoofdtopic niet bepalen.`)
  }
  if (ownH1 > 1) {
    insights.push(`Jouw pagina heeft ${ownH1} H1-headings — dat is verwarrend voor AI. Gebruik er maximaal één.`)
  }
  if (ownH2 === 0 && compH2 > 0) {
    insights.push(`Jouw pagina heeft geen H2-subheadings — ${competitor.domain} gebruikt er ${compH2}. AI ziet hun structuur als duidelijker.`)
  }

  if (insights.length === 0) {
    insights.push(
      "Beide pagina's lijken op elkaar qua AI-signalen. Bekijk de ruwe tekst hieronder voor nuanceverschillen in toon, keywords en structuur.",
    )
  }

  return insights.slice(0, 7)
}

export async function POST(req: Request): Promise<NextResponse<CompareResponse>> {
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
    const firstError = parsed.error.issues[0]?.message ?? "Ongeldige invoer."
    return NextResponse.json(
      { success: false, error: firstError },
      { status: 400 },
    )
  }

  const { ownUrl, competitorUrl } = parsed.data

  try {
    const [own, competitor] = await Promise.all([
      scrapeUrl(ownUrl),
      scrapeUrl(competitorUrl),
    ])

    const insights = generateInsights(own, competitor)

    // Save to Supabase (await it so the result page can load it)
    try {
      await saveComparison({
        domain: own.domain,
        ownUrl: own.url,
        competitorUrl: competitor.url,
        ownMarkdown: own.markdown ?? "",
        competitorMarkdown: competitor.markdown ?? "",
        ownMetadata: own.metadata ?? {},
        competitorMetadata: competitor.metadata ?? {},
        insights,
      })
    } catch (err) {
      console.error("[chatgpt-check] supabase save failed:", err)
    }

    return NextResponse.json({
      success: true,
      data: { domain: own.domain, own, competitor, insights },
    })
  } catch (err) {
    console.error("[chatgpt-check] compare route failed", err)
    return NextResponse.json(
      { success: false, error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 },
    )
  }
}
