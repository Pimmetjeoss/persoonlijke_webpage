"use client"

import { useState } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

export type GoogleScoreResult = {
  target: string
  domain_rating: number | null
  error?: string
}

export function GoogleScoreForm() {
  const [ownDomain, setOwnDomain] = useState("")
  const [competitor1, setCompetitor1] = useState("")
  const [competitor2, setCompetitor2] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<GoogleScoreResult[] | null>(null)
  const [ownDomainForLink, setOwnDomainForLink] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setResults(null)
    setSubmitting(true)

    try {
      const res = await fetch("/google-score/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownDomain,
          competitor1,
          competitor2,
        }),
      })
      const json = (await res.json()) as {
        success: boolean
        data?: { results: GoogleScoreResult[]; ownDomain: string }
        error?: string
      }
      if (!res.ok || !json.success || !json.data) {
        setError(json.error ?? "Er ging iets mis.")
        setSubmitting(false)
        return
      }
      setResults(json.data.results)
      setOwnDomainForLink(json.data.ownDomain)
      setSubmitting(false)
    } catch (err) {
      console.error("google-score submit failed", err)
      setError("Kon de vergelijking niet uitvoeren. Controleer je verbinding.")
      setSubmitting(false)
    }
  }

  const allFilled = ownDomain.trim() && competitor1.trim() && competitor2.trim()

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Jouw domein
            </label>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="code-lieshout.nl"
              value={ownDomain}
              onChange={(e) => setOwnDomain(e.target.value)}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-lg border-[3px] bg-white text-base md:text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "hsl(144.9 80.4% 10%)",
                color: "hsl(144.9 80.4% 10%)",
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Concurrent 1
            </label>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="voorbeeld1.nl"
              value={competitor1}
              onChange={(e) => setCompetitor1(e.target.value)}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-lg border-[3px] bg-white text-base md:text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "hsl(144.9 80.4% 10%)",
                color: "hsl(144.9 80.4% 10%)",
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Concurrent 2
            </label>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="voorbeeld2.nl"
              value={competitor2}
              onChange={(e) => setCompetitor2(e.target.value)}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-lg border-[3px] bg-white text-base md:text-sm focus:outline-none focus:ring-2"
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
            {submitting ? "Berekenen..." : "Vergelijk"}
            {!submitting && <ArrowRightIcon className="w-5 h-5" />}
          </button>
          <p className="text-xs text-gray-600 max-w-md">
            We gebruiken de gratis Ahrefs Domain Rating API. Er wordt geen
            persoonlijke data opgeslagen; alleen de domeinnamen en scores
            kunnen worden gelogd voor analyse.
          </p>
        </div>
      </form>

      {error && (
        <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      {results && (
        <div className="mt-4 border-[3px] rounded-xl bg-white p-4 md:p-6" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h3
                className="text-lg md:text-xl font-bold"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                Vergelijking
              </h3>
              <p className="text-xs text-gray-600">
                Hoe hoger de Domain Rating (0-100), hoe sterker het backlink‑profiel.
              </p>
            </div>
            {ownDomainForLink && (
              <a
                href={`/google-score/${encodeURIComponent(ownDomainForLink)}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border-[2px] text-xs font-semibold uppercase tracking-wide"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  borderColor: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                Bekijk detailpagina
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {results.map((r) => {
              const value = r.domain_rating
              return (
                <div
                  key={r.target}
                  className="p-3 rounded-lg border-[2px]"
                  style={{ borderColor: "hsl(141.9 69.2% 58%)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                    {r.target}
                  </p>
                  {r.error ? (
                    <p className="text-xs text-red-700">{r.error}</p>
                  ) : (
                    <p
                      className="text-2xl md:text-3xl font-bold"
                      style={{
                        color: "hsl(144.9 80.4% 10%)",
                        fontFamily: "var(--font-fjalla-one)",
                      }}
                    >
                      {value ?? "-"}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
