import { NextResponse } from "next/server"
import { z } from "zod"
import { saveComparison } from "@/lib/google-score/cache"

const AhrefsResponseSchema = z.object({
  domain_rating: z.object({
    domain_rating: z.number().nullable(),
  }),
})

type CompareResult = {
  target: string
  domain_rating: number | null
  error?: string
}

type ApiResponse = {
  success: boolean
  data?: { results: CompareResult[]; ownDomain: string }
  error?: string
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const INPUT_SCHEMA = z.object({
  ownDomain: z.string().min(1, "Vul je eigen domein in."),
  competitor1: z.string().min(1, "Vul de eerste concurrent in."),
  competitor2: z.string().min(1, "Vul de tweede concurrent in."),
})

function normalizeTarget(raw: string): string {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) return ""
  let host = trimmed
  try {
    // Voeg protocol toe als het ontbreekt om URL parsing te vereenvoudigen
    const hasProtocol = /^https?:\/\//i.test(trimmed)
    const url = new URL(hasProtocol ? trimmed : `https://${trimmed}`)
    host = url.hostname
  } catch {
    // Laat het ruwe domein staan; Ahrefs verwacht target als string en valideert zelf
    host = trimmed
  }
  return host.replace(/^www\./, "")
}

async function fetchDomainRating(target: string): Promise<CompareResult> {
  const normalized = normalizeTarget(target)
  if (!normalized) {
    return { target: target || "(leeg)", domain_rating: null, error: "Ongeldig domein" }
  }

  const url = new URL("https://api.ahrefs.com/v3/public/domain-rating-free")
  url.searchParams.set("target", normalized)
  url.searchParams.set("output", "json")

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Ahrefs public endpoint heeft geen key nodig; limieten zijn aan hun kant geregeld
      cache: "no-store",
    })

    if (!res.ok) {
      return {
        target: normalized,
        domain_rating: null,
        error: `API-fout (${res.status})`,
      }
    }

    const json: unknown = await res.json()
    const parsed = AhrefsResponseSchema.safeParse(json)
    if (!parsed.success) {
      return {
        target: normalized,
        domain_rating: null,
        error: "Onverwacht antwoord van Ahrefs.",
      }
    }

    return {
      target: normalized,
      domain_rating: parsed.data.domain_rating.domain_rating,
    }
  } catch (err) {
    console.error("[google-score] fetchDomainRating failed", err)
    return {
      target: normalized,
      domain_rating: null,
      error: "Kon geen verbinding maken met Ahrefs.",
    }
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
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
    const firstError = parsed.error.errors[0]?.message ?? "Ongeldige invoer."
    return NextResponse.json(
      { success: false, error: firstError },
      { status: 400 },
    )
  }

  const { ownDomain, competitor1, competitor2 } = parsed.data

  try {
    const [own, c1, c2] = await Promise.all([
      fetchDomainRating(ownDomain),
      fetchDomainRating(competitor1),
      fetchDomainRating(competitor2),
    ])

    const saved = await saveComparison({
      ownDomain: own.target,
      competitor1: c1.target,
      competitor2: c2.target,
      ownDr: own.domain_rating,
      competitor1Dr: c1.domain_rating,
      competitor2Dr: c2.domain_rating,
    })

    const redirectDomain = saved?.own_domain ?? own.target

    return NextResponse.json({
      success: true,
      data: { results: [own, c1, c2], ownDomain: redirectDomain },
    })
  } catch (err) {
    console.error("[google-score] compare route failed", err)
    return NextResponse.json(
      { success: false, error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 },
    )
  }
}
