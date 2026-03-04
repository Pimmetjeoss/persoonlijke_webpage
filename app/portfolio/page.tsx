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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioBreadcrumbSchema) }}
      />
      <Navigation onPlayClick={() => setIsPacmanOpen(true)} />
      <WorkExperience />
      <PacmanPopup isOpen={isPacmanOpen} onClose={() => setIsPacmanOpen(false)} />
      <StickyFooter />
    </div>
  )
}
