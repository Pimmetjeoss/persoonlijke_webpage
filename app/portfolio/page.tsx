"use client"

import { useState } from "react"
import { WorkExperience } from "./components"
import { Footer } from "./components/footer"
import { Navigation } from "./components/navigation"
import { PacmanPopup } from "./components/pacman-popup"
import { StickyFooter } from "@/app/components/sticky-footer"


const portfolioBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://code-lieshout.nl" },
    { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://code-lieshout.nl/portfolio" }
  ]
};

export default function Portfolio() {
  const [isPacmanOpen, setIsPacmanOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      <h1 className="sr-only">Portfolio — AI-agents en websites</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioBreadcrumbSchema) }}
      />
      {/* Citeerbaar antwoord (C3, schermlezer + SSR) + conversiepad (B4) */}
      <div className="sr-only">
        <h2>Wat laat het portfolio van Code Lieshout zien?</h2>
        <p>
          Het portfolio van Code Lieshout toont AI-agents, web-applicaties en
          automatiseringen die Pim van Lieshout bouwde voor Nederlandse bedrijven —
          van chatbots tot complete platforms. Alles is maatwerk: Next.js en React,
          met aandacht voor snelheid, SEO en agent-readiness. Wil je iets soortgelijks
          laten bouwen? Vraag via de contactpagina een vrijblijvende offerte aan of
          bekijk eerst de AI-agent-diensten en de gratis agent-ready scan.
        </p>
        <ul>
          <li><a href="/ai-agents">AI-agents voor het MKB</a></li>
          <li><a href="/agent-ready">Gratis agent-ready scan</a></li>
          <li><a href="/jouw-website">Website laten maken</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <section aria-label="Volgende stap" className="mx-auto max-w-5xl px-6 pb-16">
        <div
          className="rounded-xl p-8 md:p-10 text-center space-y-4 bg-white"
          style={{ border: "3px solid black" }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
          >
            Zoiets laten bouwen?
          </h2>
          <p className="text-lg" style={{ color: "hsl(143.8 61.2% 20.2%)" }}>
            Vaste projectprijs vooraf, direct contact met de bouwer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block px-8 py-3 text-white font-sans text-lg rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)", border: "3px solid black" }}
            >
              OFFERTE AANVRAGEN
            </a>
            <a
              href="/ai-agents"
              className="inline-block px-8 py-3 font-sans text-lg rounded-xl transition-all hover:scale-105 bg-white"
              style={{ color: "hsl(144.9 80.4% 10%)", border: "3px solid black" }}
            >
              BEKIJK AI-AGENTS
            </a>
          </div>
        </div>
      </section>
      <Navigation onPlayClick={() => setIsPacmanOpen(true)} />
      <WorkExperience />
      <PacmanPopup isOpen={isPacmanOpen} onClose={() => setIsPacmanOpen(false)} />
      <StickyFooter />
    </div>
  )
}
