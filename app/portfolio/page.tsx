"use client"

import { useState } from "react"
import { WorkExperience } from "./components"
import { Footer } from "./components/footer"
import { Navigation } from "./components/navigation"
import { PacmanPopup } from "./components/pacman-popup"
import { StickyFooter } from "@/app/components/sticky-footer"

export default function Portfolio() {
  const [isPacmanOpen, setIsPacmanOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      <Navigation onPlayClick={() => setIsPacmanOpen(true)} />
      <WorkExperience />
      <PacmanPopup isOpen={isPacmanOpen} onClose={() => setIsPacmanOpen(false)} />
      <StickyFooter />
    </div>
  )
}
