"use client"

import { useState } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

type RequestFormProps = {
  initialWebsite?: string
  initialScore?: number | null
}

export function RequestForm({
  initialWebsite = "",
  initialScore = null,
}: RequestFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState(initialWebsite)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setError(null)
    setSuccess(false)
    setSubmitting(true)

    try {
      const res = await fetch("/seo-geo-scan/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          website,
          currentScore: initialScore,
          notes,
          source: "google-score-level-up",
        }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (!res.ok || !json.success) {
        setError(json.error ?? "Kon je aanvraag niet verzenden.")
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setSubmitting(false)
    } catch (err) {
      console.error("seo-geo request failed", err)
      setError("Kon je aanvraag niet verzenden. Controleer je verbinding.")
      setSubmitting(false)
    }
  }

  const canSubmit = name.trim() && email.trim() && website.trim()

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            Naam
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={submitting || success}
            autoComplete="name"
            className="px-4 py-3 rounded-lg border-[3px] bg-white text-base focus:outline-none focus:ring-2"
            style={{
              borderColor: "hsl(144.9 80.4% 10%)",
              color: "hsl(144.9 80.4% 10%)",
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting || success}
            autoComplete="email"
            className="px-4 py-3 rounded-lg border-[3px] bg-white text-base focus:outline-none focus:ring-2"
            style={{
              borderColor: "hsl(144.9 80.4% 10%)",
              color: "hsl(144.9 80.4% 10%)",
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            Website
          </label>
          <input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            disabled={submitting || success}
            inputMode="url"
            autoComplete="url"
            placeholder="code-lieshout.nl"
            className="px-4 py-3 rounded-lg border-[3px] bg-white text-base focus:outline-none focus:ring-2"
            style={{
              borderColor: "hsl(144.9 80.4% 10%)",
              color: "hsl(144.9 80.4% 10%)",
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            Telefoon of WhatsApp
          </label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={submitting || success}
            autoComplete="tel"
            className="px-4 py-3 rounded-lg border-[3px] bg-white text-base focus:outline-none focus:ring-2"
            style={{
              borderColor: "hsl(144.9 80.4% 10%)",
              color: "hsl(144.9 80.4% 10%)",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-700">
          Waar wil je op groeien?
        </label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={submitting || success}
          rows={5}
          className="px-4 py-3 rounded-lg border-[3px] bg-white text-base focus:outline-none focus:ring-2 resize-none"
          style={{
            borderColor: "hsl(144.9 80.4% 10%)",
            color: "hsl(144.9 80.4% 10%)",
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <button
          type="submit"
          disabled={submitting || success || !canSubmit}
          className="px-6 py-3 rounded-lg border-[3px] font-semibold text-white uppercase tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          style={{
            backgroundColor: "hsl(142.1 76.2% 36.3%)",
            borderColor: "hsl(144.9 80.4% 10%)",
            fontFamily: "var(--font-fjalla-one)",
          }}
        >
          {submitting ? "Verzenden..." : success ? "Verzonden" : "Vraag scan aan"}
          {!submitting && !success && <ArrowRightIcon className="w-5 h-5" />}
        </button>
        <p className="text-xs text-gray-600 max-w-md">
          Je aanvraag wordt opgeslagen zodat ik je scan kan voorbereiden. Ik neem
          daarna persoonlijk contact met je op.
        </p>
      </div>

      {error && (
        <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm font-medium" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>
          Aanvraag ontvangen. Ik pak hem erbij en neem contact met je op.
        </p>
      )}
    </form>
  )
}
