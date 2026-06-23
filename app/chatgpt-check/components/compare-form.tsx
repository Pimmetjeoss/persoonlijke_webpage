"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon } from "@radix-ui/react-icons"

type ScrapeResult = {
  url: string
  domain: string
  markdown?: string
  metadata?: Record<string, string>
  error?: string
}

type ApiResponse = {
  success: boolean
  data?: {
    domain: string
    own: ScrapeResult
    competitor: ScrapeResult
    insights: string[]
  }
  error?: string
}

export function CompareForm() {
  const router = useRouter()
  const [ownUrl, setOwnUrl] = useState("")
  const [competitorUrl, setCompetitorUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch("/chatgpt-check/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownUrl,
          competitorUrl,
        }),
      })
      const json = (await res.json()) as ApiResponse
      if (!res.ok || !json.success || !json.data) {
        setError(json.error ?? "Er ging iets mis.")
        setSubmitting(false)
        return
      }

      // Redirect to result page (like Agent-Ready does)
      router.push(`/chatgpt-check/${encodeURIComponent(json.data.domain)}`)
    } catch (err) {
      console.error("chatgpt-check submit failed", err)
      setError("Kon de vergelijking niet uitvoeren. Controleer je verbinding.")
      setSubmitting(false)
    }
  }

  const allFilled = ownUrl.trim() && competitorUrl.trim()

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Jouw website
            </label>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="https://jouwsite.nl"
              value={ownUrl}
              onChange={(e) => setOwnUrl(e.target.value)}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-lg border-[3px] bg-white text-base focus:outline-none focus:ring-2"
              style={{
                borderColor: "hsl(144.9 80.4% 10%)",
                color: "hsl(144.9 80.4% 10%)",
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Concurrent
            </label>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="https://concurrent.nl"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-lg border-[3px] bg-white text-base focus:outline-none focus:ring-2"
              style={{
                borderColor: "hsl(144.9 80.4% 10%)",
                color: "hsl(144.9 80.4% 10%)",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <button
            type="submit"
            disabled={submitting || !allFilled}
            className="px-6 py-3 rounded-lg border-[3px] font-semibold text-white uppercase tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              backgroundColor: "hsl(142.1 76.2% 36.3%)",
              borderColor: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {submitting ? "Scannen..." : "Vergelijk"}
            {!submitting && <ArrowRightIcon className="w-5 h-5" />}
          </button>
          <p className="text-xs text-gray-600 max-w-md">
            We halen beide pagina&apos;s op en tonen wat een AI-crawler ziet —
            platte tekst, zonder opmaak.
          </p>
        </div>
      </form>

      {error && (
        <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}
    </div>
  )
}
