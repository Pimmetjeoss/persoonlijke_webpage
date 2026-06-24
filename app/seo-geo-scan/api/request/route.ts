import { NextResponse } from "next/server"
import { z } from "zod"
import { saveSeoGeoScanRequest } from "@/lib/seo-geo-scan/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const RequestSchema = z.object({
  name: z.string().trim().min(2, "Vul je naam in.").max(120),
  email: z.string().trim().email("Vul een geldig e-mailadres in.").max(200),
  phone: z.string().trim().min(6, "Vul je telefoonnummer of WhatsApp in.").max(60),
  website: z.string().trim().min(3, "Vul je website in.").max(240),
  currentScore: z.number().min(0).max(100).nullable().optional(),
  notes: z.string().trim().min(10, "Vertel kort waar je op wilt groeien.").max(1200),
  source: z.string().trim().max(120).optional(),
})

type ApiResponse = {
  success: boolean
  error?: string
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

  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Ongeldige invoer.",
      },
      { status: 400 },
    )
  }

  try {
    const saved = await saveSeoGeoScanRequest(parsed.data)
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Kon de aanvraag niet opslaan." },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[seo-geo-scan] request route failed:", err)
    return NextResponse.json(
      { success: false, error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 },
    )
  }
}
