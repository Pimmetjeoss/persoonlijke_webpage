"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon } from "@radix-ui/react-icons"

export function ScanForm() {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/agent-ready/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      })
      const json = (await res.json()) as {
        success: boolean
        data?: { domain: string; cached: boolean }
        error?: string
      }
      if (!res.ok || !json.success || !json.data) {
        setError(json.error ?? "Er ging iets mis.")
        setSubmitting(false)
        return
      }
      router.push(`/agent-ready/${encodeURIComponent(json.data.domain)}`)
    } catch (err) {
      console.error("scan submit failed", err)
      setError("Kon de scan niet starten. Controleer je verbinding.")
      setSubmitting(false)
    }
  }

  return (
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
          style={{
            borderColor: "hsl(144.9 80.4% 10%)",
            color: "hsl(144.9 80.4% 10%)",
          }}
        />
        <button
          type="submit"
          disabled={submitting || !value.trim()}
          className="px-6 py-3 rounded-lg border-[3px] font-semibold text-white uppercase tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          style={{
            backgroundColor: "hsl(142.1 76.2% 36.3%)",
            borderColor: "hsl(144.9 80.4% 10%)",
            fontFamily: "var(--font-fjalla-one)",
          }}
        >
          {submitting ? "Scannen..." : "Scan nu"}
          {!submitting && <ArrowRightIcon className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}
      <p className="text-xs text-gray-600">
        Gratis. Geen account nodig. Jouw resultaat verschijnt binnen ~10
        seconden.
      </p>
    </form>
  )
}
