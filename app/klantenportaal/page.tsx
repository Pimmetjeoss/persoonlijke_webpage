"use client"

import React, { useRef, useState } from "react"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"
import { StickyFooter } from "@/app/components/sticky-footer"
import Image from "next/image"

interface DocumentItem {
  id: string
  title: string
  description: string
  status: "beschikbaar" | "in behandeling" | "concept"
  date?: string
}

const documents: DocumentItem[] = [
  {
    id: "offerte",
    title: "OFFERTE",
    description: "Bekijk en download uw persoonlijke offerte met prijsopgave.",
    status: "beschikbaar",
    date: "14 feb 2026",
  },
  {
    id: "facturen",
    title: "FACTUREN",
    description: "Overzicht van alle facturen en betalingsstatus.",
    status: "beschikbaar",
    date: "10 feb 2026",
  },
  {
    id: "overeenkomst",
    title: "OVEREENKOMST",
    description: "De samenwerkingsovereenkomst en algemene voorwaarden.",
    status: "in behandeling",
  },
  {
    id: "projectplan",
    title: "PROJECTPLAN",
    description: "Gedetailleerd plan met scope, tijdlijn en deliverables.",
    status: "beschikbaar",
    date: "8 feb 2026",
  },
  {
    id: "verwerkersovereenkomst",
    title: "VERWERKERSOVEREENKOMST",
    description: "AVG-conforme verwerkersovereenkomst voor persoonsgegevens.",
    status: "concept",
  },
  {
    id: "rapportages",
    title: "RAPPORTAGES",
    description: "Periodieke voortgangsrapportages en resultaten.",
    status: "beschikbaar",
    date: "1 feb 2026",
  },
  {
    id: "onboarding",
    title: "ONBOARDING",
    description: "Stappenplan en handleiding om snel aan de slag te gaan.",
    status: "beschikbaar",
    date: "5 feb 2026",
  },
]

// Hover colors mixed like portfolio page
const hoverColors = [
  "hsl(141.9 69.2% 58%)",
  "hsl(143.8 61.2% 20.2%)",
  "hsl(141 78.9% 85.1%)",
  "hsl(142.4 71.8% 29.2%)",
  "hsl(138.5 76.5% 96.7%)",
  "hsl(144.9 80.4% 10%)",
  "hsl(141.7 76.6% 73.1%)",
]

// Dark backgrounds need light text
const darkIndices = [1, 3, 5]

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  beschikbaar: {
    bg: "hsl(142.1 76.2% 36.3%)",
    text: "white",
    label: "Beschikbaar",
  },
  "in behandeling": {
    bg: "hsl(141.9 69.2% 58%)",
    text: "hsl(144.9 80.4% 10%)",
    label: "In behandeling",
  },
  concept: {
    bg: "hsl(141 78.9% 85.1%)",
    text: "hsl(144.9 80.4% 10%)",
    label: "Concept",
  },
}

export default function Klantenportaal() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getTextColor = (index: number, isHovered: boolean) => {
    if (isHovered && darkIndices.includes(index)) {
      return "hsl(138.5 76.5% 96.7%)"
    }
    return "hsl(144.9 80.4% 10%)"
  }

  return (
    <div
      ref={timelineRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      {/* Navigation bar - like portfolio */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <div
              className="flex flex-col items-center px-8 py-3 border-[3px] rounded-full transition-all"
              style={{
                backgroundColor: "hsl(142.4 71.8% 29.2%)",
                color: "white",
                borderColor: "hsl(144.9 80.4% 10%)",
              }}
            >
              <span className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">CODE LIESHOUT</span>
              <span className="text-lg md:text-xl -mt-1 text-white/80" style={{ fontFamily: "var(--font-homemade-apple)" }}>klantenportaal</span>
            </div>

            <div
              className="hidden md:flex items-center gap-3 px-6 py-3 border-[3px] rounded-full"
              style={{
                backgroundColor: "hsl(142.4 71.8% 29.2%)",
                borderColor: "hsl(144.9 80.4% 10%)",
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">VB</span>
              </div>
              <span className="text-white font-bold text-lg">VOORBEELD BEDRIJF B.V.</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer - like portfolio page with cactus */}
      <div className="h-[50vh] relative overflow-visible">
        <Image
          src="/cactus_laptop_transparent.png"
          alt="Cactus mascotte"
          width={250}
          height={250}
          className="absolute -bottom-[130px] right-[5%] md:right-[10%] lg:right-[15%] w-[150px] md:w-[200px] lg:w-[250px] z-0 pointer-events-none"
        />
      </div>

      {/* Document accordion list - portfolio style */}
      <div className="relative z-10">
        {documents.map((doc, index) => {
          const isHovered = hoveredIndex === index
          const isExpanded = expandedId === doc.id
          const status = statusConfig[doc.status]

          return (
            <React.Fragment key={doc.id}>
              <TimelineContent
                animationNum={index + 1}
                timelineRef={timelineRef}
                once={true}
              >
                <div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative w-full"
                  style={{
                    backgroundColor: isHovered ? hoverColors[index] : "hsl(140.6 84.2% 92.5%)",
                  }}
                >
                  {/* Title row - hovers up like portfolio */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                    className="transition-all duration-300 ease-out mb-0 rounded-none border-t-[3px] border-black hover:-translate-y-6 overflow-hidden hover:overflow-visible w-full cursor-pointer"
                    style={{
                      zIndex: isHovered ? 50 : 1,
                      backgroundColor: isHovered ? hoverColors[index] : "hsl(140.6 84.2% 92.5%)",
                    }}
                  >
                    <div className="pt-4 pb-2 px-4 md:px-8 lg:px-16">
                      <div className="grid grid-cols-[1fr_auto] gap-8 items-end w-full max-w-7xl mx-auto">
                        {/* Document title */}
                        <div>
                          <div className="flex items-center gap-4 mb-1">
                            <div
                              className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                              style={{
                                backgroundColor: status.bg,
                                color: status.text,
                              }}
                            >
                              {status.label}
                            </div>
                            {doc.date && (
                              <span
                                className="text-sm transition-colors duration-300"
                                style={{
                                  color: isHovered && darkIndices.includes(index)
                                    ? "rgba(255,255,255,0.6)"
                                    : "rgb(163 163 163)",
                                }}
                              >
                                {doc.date}
                              </span>
                            )}
                          </div>
                          <h2
                            className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] transition-all duration-300"
                            style={{
                              color: getTextColor(index, isHovered),
                              marginBottom: "-0.3em",
                            }}
                          >
                            {doc.title}
                          </h2>
                        </div>

                        {/* Plus icon */}
                        <div className="flex items-center justify-center pb-2">
                          <div
                            className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: "hsl(142.1 76.2% 36.3%)",
                              transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
                            }}
                          >
                            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded content - separate from hover div so it doesn't overlap */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-8 lg:px-16 pt-2 pb-6">
                          <div className="max-w-7xl mx-auto">
                            <div
                              className="rounded-xl border-[3px] bg-white p-6 md:p-8"
                              style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
                            >
                              <p
                                className="text-lg md:text-xl mb-6"
                                style={{ color: "hsl(144.9 80.4% 10%)" }}
                              >
                                {doc.description}
                              </p>

                              <div className="flex flex-wrap gap-4">
                                {doc.status === "beschikbaar" && (
                                  <button
                                    className="px-6 py-3 rounded-full border-[3px] font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105"
                                    style={{
                                      backgroundColor: "hsl(142.1 76.2% 36.3%)",
                                      borderColor: "hsl(144.9 80.4% 10%)",
                                      color: "white",
                                    }}
                                  >
                                    Download PDF
                                  </button>
                                )}
                                <button
                                  className="px-6 py-3 rounded-full border-[3px] font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105"
                                  style={{
                                    backgroundColor: "transparent",
                                    borderColor: "hsl(144.9 80.4% 10%)",
                                    color: "hsl(144.9 80.4% 10%)",
                                  }}
                                >
                                  Bekijk details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TimelineContent>
            </React.Fragment>
          )
        })}

        {/* Bottom border */}
        <div className="h-[3px] w-full bg-black" />
      </div>

      {/* Spacer for sticky footer */}
      <div className="h-12" />

      <StickyFooter />
    </div>
  )
}
