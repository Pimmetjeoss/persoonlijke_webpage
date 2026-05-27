"use client"

import { useState } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

const DARK = "hsl(144.9 80.4% 10%)"
const GREEN = "hsl(142.1 76.2% 36.3%)"
const LIGHT = "hsl(141 78.9% 85.1%)"

type OpenCard = "google" | "chatgpt" | null

function ExpandCard({
  title,
  teaser,
  accent,
  open,
  onClick,
}: {
  title: string
  teaser: string
  accent: string
  open: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="rounded-xl border-[3px] p-6 bg-white flex flex-col text-left cursor-pointer hover:opacity-95 transition-opacity"
      style={{ borderColor: DARK }}
    >
      <div
        className="h-2 -mx-6 -mt-6 mb-4 rounded-t-[9px]"
        style={{ backgroundColor: accent }}
      />
      <h3
        className="text-2xl font-bold mb-2"
        style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{teaser}</p>
      <div className="flex-1" />
      <span
        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide"
        style={{ color: GREEN }}
      >
        {open ? "Verberg uitleg" : "Bekijk uitleg"}
        <span
          className="text-lg leading-none transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          ›
        </span>
      </span>
    </button>
  )
}

function Panel({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-all duration-300 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">
        <div
          className="rounded-xl border-[2px] p-5 text-sm leading-relaxed space-y-3"
          style={{ borderColor: DARK, backgroundColor: LIGHT, color: DARK }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold underline"
      style={{ color: GREEN }}
    >
      {label}
    </a>
  )
}

export function AanDeSlag() {
  const [openCard, setOpenCard] = useState<OpenCard>(null)
  const toggle = (c: Exclude<OpenCard, null>) =>
    setOpenCard((prev) => (prev === c ? null : c))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExpandCard
          title="Google Marketing Live 2026"
          teaser="Wat Google's nieuwe AI-advertenties betekenen voor je agent-readiness."
          accent="hsl(141.7 76.6% 73.1%)"
          open={openCard === "google"}
          onClick={() => toggle("google")}
        />

        <ExpandCard
          title="ChatGPT Ads & Commerce"
          teaser="Wat OpenAI's ads en Instant Checkout betekenen voor je agent-readiness."
          accent="hsl(141.9 69.2% 58%)"
          open={openCard === "chatgpt"}
          onClick={() => toggle("chatgpt")}
        />

        {/* Subscription — contact-kaart */}
        <div
          className="rounded-xl border-[3px] p-6 bg-white flex flex-col"
          style={{ borderColor: DARK }}
        >
          <div
            className="h-2 -mx-6 -mt-6 mb-4 rounded-t-[9px]"
            style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)" }}
          />
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
          >
            Subscription
          </h3>
          <div className="flex-1" />
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:underline"
            style={{ color: DARK }}
          >
            Neem contact op
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Google Marketing Live — uitklap */}
      <Panel open={openCard === "google"}>
        <p
          className="uppercase text-[10px] font-bold tracking-widest"
          style={{ color: GREEN }}
        >
          Google Marketing Live — 20 mei 2026
        </p>
        <p>
          Google brengt advertenties <strong>ín</strong> de AI-zoekervaring (AI
          Mode), met Gemini die de creatives genereert. De vier uitkomsten die
          ertoe doen:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Business Agent for Leads</strong> — een Gemini-chatbot in de
            advertentie die vragen beantwoordt op basis van jouw website.
          </li>
          <li>
            <strong>AI-Powered Shopping Ads</strong> — Gemini legt uit waarom een
            product bij de zoekvraag past.
          </li>
          <li>
            <strong>Conversational Discovery Ads</strong> — de advertentie
            beantwoordt een concrete vraag met Gemini-creative.
          </li>
          <li>
            <strong>Highlighted Answers</strong> — advertenties verschijnen binnen
            Gemini&apos;s aanbevelingslijst in AI Mode.
          </li>
        </ul>
        <p>
          Waarom dit agent-readiness urgent maakt: al deze formats laten Gemini
          jouw content en productdata lezen en navertellen. Zonder de juiste basis
          heeft Google&apos;s AI niets om mee te werken.
        </p>
        <div>
          <p className="font-bold uppercase text-xs tracking-wide mb-1">
            Welke checks geraakt worden
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Markdown voor agents</strong> +{" "}
              <strong>AI-bot regels</strong> + <strong>Content Signals</strong> —
              de gemene deler: toegang tot én toestemming voor je content.
            </li>
            <li>
              <strong>WebMCP / Agent Skills / MCP Server Card</strong> — komen
              erbij bij de Business Agent: daar moet een agent niet alleen lezen
              maar ook hándelen.
            </li>
          </ul>
        </div>
        <p>
          Bron:{" "}
          <SourceLink
            href="https://blog.google/products/ads-commerce/google-marketing-live-search-ads/"
            label="Google Marketing Live — search ads (blog.google)"
          />
        </p>
      </Panel>

      {/* ChatGPT Ads & Commerce — uitklap */}
      <Panel open={openCard === "chatgpt"}>
        <p
          className="uppercase text-[10px] font-bold tracking-widest"
          style={{ color: GREEN }}
        >
          ChatGPT Ads &amp; Commerce — 2026
        </p>
        <p>
          OpenAI test sinds begin 2026 <strong>advertenties in ChatGPT</strong>{" "}
          (onderaan AI-antwoorden, contextueel) én laat gebruikers{" "}
          <strong>kopen via Instant Checkout</strong>. Twee kanten die ertoe doen:
          zichtbaar zijn én verhandelbaar zijn.
        </p>
        <div>
          <p className="font-bold uppercase text-xs tracking-wide mb-1">
            Welke checks geraakt worden
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>AI-bot regels</strong> — <code>OAI-SearchBot</code> moet
              toegestaan zijn om in ChatGPT te verschijnen. <code>GPTBot</code>{" "}
              (training) en <code>ChatGPT-User</code> (live ophalen) regel je los.
            </li>
            <li>
              <strong>Content Signals</strong> + <strong>Markdown voor agents</strong>{" "}
              — zodat ChatGPT je content mag lezen en kan tonen/citeren.
            </li>
            <li>
              <strong>ACP (Agentic Commerce Protocol)</strong> — dít is OpenAI&apos;s
              officiële koopprotocol in ChatGPT. Het is letterlijk de commerce-check
              uit deze scan.
            </li>
            <li>
              <strong>Product feed</strong> — beveiligde CSV/JSON met identifiers,
              prijs, voorraad, media en fulfillment, tot elke 15 min ververst.
            </li>
          </ul>
        </div>
        <p className="text-xs italic">
          Kanttekening: ads zijn een pilot (US, Free/Go-tiers) en Instant Checkout
          is voorlopig alleen voor goedgekeurde partners. De merchant houdt eigen
          PSP, orders en fulfillment in beheer.
        </p>
        <p>
          Bronnen:{" "}
          <SourceLink
            href="https://openai.com/index/testing-ads-in-chatgpt/"
            label="Testing ads in ChatGPT"
          />{" "}
          ·{" "}
          <SourceLink
            href="https://developers.openai.com/commerce"
            label="Agentic Commerce (OpenAI Developers)"
          />{" "}
          ·{" "}
          <SourceLink
            href="https://developers.openai.com/api/docs/bots"
            label="OpenAI Crawlers"
          />
        </p>
      </Panel>
    </div>
  )
}
