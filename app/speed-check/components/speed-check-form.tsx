"use client"

import { useState } from "react"
import { ArrowRightIcon, LightningBoltIcon, RocketIcon } from "@radix-ui/react-icons"
import { ScoreCircle } from "@/app/google-score/components/score-circle"
import type { SpeedScanResult, StrategyResult } from "@/lib/speed-check/scanner"

function tone(score: number): "green" | "orange" | "red" {
  if (score >= 80) return "green"
  if (score >= 50) return "orange"
  return "red"
}

function smallTone(score: number | null): string {
  if (score === null) return "hsl(0 0% 45%)"
  if (score >= 80) return "hsl(142.1 76.2% 36.3%)"
  if (score >= 50) return "hsl(32 95% 44%)"
  return "hsl(0 72% 47%)"
}

function ScorePill({ label, score }: { label: string; score: number | null }) {
  return (
    <div className="rounded-xl border-[3px] bg-white p-4" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
      <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">{label}</p>
      <p
        className="text-3xl font-bold mt-1"
        style={{ color: smallTone(score), fontFamily: "var(--font-fjalla-one)" }}
      >
        {score ?? "-"}
      </p>
      <p className="text-xs text-gray-500">van 100</p>
    </div>
  )
}

function StrategyCard({ result }: { result: StrategyResult }) {
  return (
    <div className="rounded-xl border-[3px] bg-white p-5" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">
            {result.strategy === "mobile" ? "Mobiel" : "Desktop"}
          </p>
          <h3
            className="text-2xl font-bold"
            style={{ color: "hsl(144.9 80.4% 10%)", fontFamily: "var(--font-fjalla-one)" }}
          >
            Snelheid {result.performance}/100
          </h3>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
          style={{ backgroundColor: smallTone(result.performance), color: "white", fontFamily: "var(--font-fjalla-one)" }}
        >
          {result.performance}
        </div>
      </div>

      {result.error && <p className="text-sm text-red-700 mb-3">{result.error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {result.metrics.map((metric) => (
          <div key={metric.id} className="rounded-lg border-[2px] p-3" style={{ borderColor: "hsl(141.9 69.2% 58%)" }}>
            <p className="text-xs font-semibold text-gray-600">{metric.label}</p>
            <p className="text-lg font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Results({ data }: { data: SpeedScanResult }) {
  return (
    <div className="space-y-8 mt-8">
      <div className="rounded-xl border-[3px] bg-white p-6 md:p-8" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ScoreCircle score={data.score} tone={tone(data.score)} />
          <div className="text-center lg:text-left max-w-xl">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>
              Speed Check resultaat voor {data.domain}
            </p>
            <h3
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "hsl(144.9 80.4% 10%)", fontFamily: "var(--font-fjalla-one)" }}
            >
              Level {data.level.level}: {data.level.name}
            </h3>
            <p className="text-gray-700">{data.level.description}</p>
            {data.level.next && (
              <p className="text-sm text-gray-600 mt-3"><strong>Volgende stap:</strong> {data.level.next}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ScorePill label="Mobiele snelheid" score={data.mobile.performance} />
        <ScorePill label="Desktop snelheid" score={data.desktop.performance} />
        <ScorePill label="Toegankelijkheid" score={data.mobile.accessibility ?? data.desktop.accessibility} />
        <ScorePill label="Best practices" score={data.mobile.bestPractices ?? data.desktop.bestPractices} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StrategyCard result={data.mobile} />
        <StrategyCard result={data.desktop} />
      </div>

      <div className="rounded-xl border-[3px] bg-white p-6" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(141.9 69.2% 58%)" }}>
            <RocketIcon className="w-5 h-5" style={{ color: "hsl(144.9 80.4% 10%)" }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold" style={{ color: "hsl(144.9 80.4% 10%)", fontFamily: "var(--font-fjalla-one)" }}>
              Belangrijkste verbeterpunten
            </h3>
            <p className="text-sm text-gray-600">Deze adviezen komen rechtstreeks uit Lighthouse/PageSpeed, zonder AI-generatie.</p>
          </div>
        </div>

        {data.improvements.length > 0 ? (
          <ol className="space-y-3">
            {data.improvements.map((item, index) => (
              <li key={item.id} className="rounded-lg border-[2px] p-4" style={{ borderColor: "hsl(141.9 69.2% 58%)" }}>
                <div className="flex gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)", color: "white" }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>{item.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    {item.savingsMs && <p className="text-xs text-gray-500 mt-1">Geschatte winst: ±{(item.savingsMs / 1000).toFixed(1)}s</p>}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-gray-700">PageSpeed vond geen grote standaardverbeterpunten. Mooi uitgangspunt — kijk vooral naar de detailmetingen hierboven.</p>
        )}
      </div>
    </div>
  )
}

export function SpeedCheckForm() {
  const [value, setValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SpeedScanResult | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setResult(null)
    setSubmitting(true)

    try {
      const res = await fetch("/speed-check/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      })
      const json = (await res.json()) as { success: boolean; data?: SpeedScanResult; error?: string }
      if (!res.ok || !json.success || !json.data) {
        setError(json.error ?? "Er ging iets mis.")
        setSubmitting(false)
        return
      }
      setResult(json.data)
      setSubmitting(false)
    } catch (err) {
      console.error("speed-check submit failed", err)
      setError("Kon de snelheidsscan niet starten. Controleer je verbinding.")
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="https://jouwwebsite.nl"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={submitting}
            className="flex-1 px-4 py-3 rounded-lg border-[3px] bg-white text-base md:text-lg focus:outline-none focus:ring-2"
            style={{ borderColor: "hsl(144.9 80.4% 10%)", color: "hsl(144.9 80.4% 10%)" }}
          />
          <button
            type="submit"
            disabled={submitting || !value.trim()}
            className="px-6 py-3 rounded-lg border-[3px] font-semibold text-white uppercase tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)", borderColor: "hsl(144.9 80.4% 10%)", fontFamily: "var(--font-fjalla-one)" }}
          >
            {submitting ? "Scannen..." : "Start Speed Check"}
            {!submitting && <ArrowRightIcon className="w-5 h-5" />}
          </button>
        </div>
        {error && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{error}</p>}
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <LightningBoltIcon className="w-3 h-3" /> Gratis. Geen login nodig. We testen mobiel én desktop met Google PageSpeed Insights.
        </p>
      </form>

      {result && <Results data={result} />}
    </div>
  )
}
