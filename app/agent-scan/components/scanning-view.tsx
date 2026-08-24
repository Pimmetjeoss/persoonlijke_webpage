"use client"

import { useEffect, useRef, useState } from "react"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { ReportContent } from "./report-content"
import type { Report } from "@/lib/agent-scan/schemas"

const STATUS_MESSAGES = [
  "Website ophalen…",
  "Content analyseren…",
  "Zoekbaarheid checken…",
  "MCP / API-ontdekking…",
  "Protocol-scans…",
  "Rapport samenstellen…",
]

export function ScanningView({ domain }: { domain: string }) {
  const [report, setReport] = useState<Report | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [failed, setFailed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    let attempt = 0
    const maxAttempts = 60 // ~3 minuten bij intervallen van 3s

    async function poll() {
      attempt += 1
      if (cancelled) return
      setAttempts(attempt)
      try {
        const res = await fetch(
          `/agent-scan/api/status?domain=${encodeURIComponent(domain)}`,
        )
        const json = (await res.json()) as {
          status: string
          report?: Report
        }
        if (json.status === "done" && json.report) {
          setReport(json.report)
          return
        }
      } catch {
        // Transient netwerkprobleem — gewoon blijven pollen.
      }
      if (attempt >= maxAttempts) {
        setFailed(true)
        return
      }
      timer.current = setTimeout(poll, 3000)
    }

    poll()
    return () => {
      cancelled = true
      if (timer.current) clearTimeout(timer.current)
    }
  }, [domain])

  if (report) {
    return <ReportContent domain={domain} report={report} />
  }

  const msgIndex = Math.floor(attempts / 3) % STATUS_MESSAGES.length
  const message = STATUS_MESSAGES[msgIndex]

  return (
    <div className="text-center py-16 space-y-6">
      <div className="flex justify-center">
        <div
          className="w-20 h-20 rounded-full border-[3px] flex items-center justify-center animate-pulse"
          style={{
            borderColor: "hsl(144.9 80.4% 10%)",
            backgroundColor: "hsl(141 78.9% 85.1%)",
          }}
        >
          <MagnifyingGlassIcon
            className="w-9 h-9"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          />
        </div>
      </div>

      <h1
        className="text-3xl md:text-4xl font-bold"
        style={{
          color: "hsl(144.9 80.4% 10%)",
          fontFamily: "var(--font-fjalla-one)",
        }}
      >
        {domain} scannen…
      </h1>
      <p className="text-lg text-gray-700">{message}</p>
      <p className="text-sm text-gray-600 max-w-md mx-auto">
        De scan loopt via Is Agentic en duurt meestal minder dan een minuut.
        Deze pagina werkt zichzelf bij.
      </p>

      {failed && (
        <div
          className="max-w-md mx-auto rounded-xl border-[3px] bg-white p-6 text-left"
          style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
        >
          <p className="font-semibold" style={{ color: "hsl(144.9 80.4% 10%)" }}>
            De scan duurt langer dan verwacht.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Bekijk het (mogelijk al afgeronde) rapport rechtstreeks op Is
            Agentic:
          </p>
          <a
            href={`https://is-agentic.com/scan/${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block px-4 py-2 rounded-lg border-[3px] bg-white font-semibold uppercase tracking-wide text-sm"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              borderColor: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Open rapport ↗
          </a>
        </div>
      )}
    </div>
  )
}
