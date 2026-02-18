"use client"

import { useRef } from "react"
import {
  ClockIcon,
  CheckCircledIcon,
  DownloadIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons"
import { ReaderIcon } from "@radix-ui/react-icons"
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid"
import { SectionCard } from "@/app/test/components/section-card"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"

const features = [
  {
    Icon: ReaderIcon, name: "Alle facturen",
    description: "Overzicht van al uw facturen op één plek.",
    href: "#factuur-overzicht", cta: "Bekijk overzicht",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: CheckCircledIcon, name: "Betaald",
    description: "2 facturen volledig betaald.",
    href: "#betaald", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: ClockIcon, name: "Openstaand",
    description: "1 factuur nog openstaand — € 2.450.",
    href: "#openstaand", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: ExclamationTriangleIcon, name: "Verlopen",
    description: "Geen verlopen facturen. Alles op orde!",
    href: "#verlopen", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141 78.9% 85.1%)",
  },
  {
    Icon: DownloadIcon, name: "Download alles",
    description: "Download alle facturen als ZIP bestand.",
    href: "#download-all", cta: "Download ZIP",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-4",
    hoverColor: "hsl(142.4 71.8% 29.2%)",
  },
]

const facturen = [
  { nr: "2026-001", desc: "Aanbetaling — Chatbot project", bedrag: "€ 1.500", status: "Betaald", color: "hsl(142.1 76.2% 36.3%)" },
  { nr: "2026-002", desc: "Milestone 1 — Workflow automatisering", bedrag: "€ 1.800", status: "Betaald", color: "hsl(142.1 76.2% 36.3%)" },
  { nr: "2026-003", desc: "Milestone 2 — Integratie & testen", bedrag: "€ 2.450", status: "Openstaand", color: "hsl(141.9 69.2% 58%)" },
]

export default function FacturenPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="FACTUREN"
        backgroundColor="hsl(143.8 61.2% 20.2%)"
        hoverColor="hsl(141.9 69.2% 58%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <TimelineContent animationNum={1} timelineRef={pageRef} once={true}>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((f) => <BentoCard key={f.name} {...f} />)}
          </BentoGrid>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pageRef} once={true}>
          <div className="mt-16 space-y-8">
            <SectionCard id="factuur-overzicht" title="Factuuroverzicht" description="Alle facturen voor uw project." Icon={ReaderIcon}>
              <div className="space-y-4 text-gray-600">
                {facturen.map((f) => (
                  <div key={f.nr} className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div>
                      <span className="font-bold mr-3" style={{ color: "hsl(144.9 80.4% 10%)" }}>#{f.nr}</span>
                      <span>{f.desc}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>{f.bedrag}</span>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: f.color }}>{f.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TimelineContent>

        <div className="h-[50vh]" />
      </div>
      <StickyFooter />
    </div>
  )
}
