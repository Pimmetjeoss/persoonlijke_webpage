"use client"

import { useRef } from "react"
import {
  DownloadIcon,
  RocketIcon,
  BarChartIcon,
  LightningBoltIcon,
  GearIcon,
} from "@radix-ui/react-icons"
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid"
import { SectionCard } from "@/app/test/components/section-card"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"

const features = [
  {
    Icon: RocketIcon, name: "Fase 1",
    description: "Analyse & ontwerp — Afgerond",
    href: "#tijdlijn", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: GearIcon, name: "Fase 2",
    description: "Ontwikkeling — In uitvoering",
    href: "#tijdlijn", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LightningBoltIcon, name: "Fase 3",
    description: "Testen & integratie — Gepland",
    href: "#tijdlijn", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141 78.9% 85.1%)",
  },
  {
    Icon: BarChartIcon, name: "Tijdlijn",
    description: "Totale doorlooptijd: 8 weken. Huidige voortgang: 45%.",
    href: "#tijdlijn", cta: "Bekijk planning",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: DownloadIcon, name: "Download",
    description: "Download het volledige projectplan als PDF.",
    href: "#download", cta: "Download PDF",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.4 71.8% 29.2%)",
  },
]

const milestones = [
  { fase: "Analyse & ontwerp", start: "3 feb", eind: "14 feb", status: "Afgerond" },
  { fase: "Chatbot ontwikkeling", start: "17 feb", eind: "7 mrt", status: "Bezig" },
  { fase: "Workflow integratie", start: "10 mrt", eind: "21 mrt", status: "Gepland" },
  { fase: "Testen & oplevering", start: "24 mrt", eind: "31 mrt", status: "Gepland" },
]

export default function ProjectplanPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="PROJECTPLAN"
        backgroundColor="hsl(142.4 71.8% 29.2%)"
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
            <SectionCard id="tijdlijn" title="Projecttijdlijn" description="Overzicht van alle mijlpalen en deadlines." Icon={BarChartIcon}>
              <div className="space-y-4 text-gray-600">
                {milestones.map((m) => (
                  <div key={m.fase} className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span>{m.fase}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">{m.start} — {m.eind}</span>
                      <span
                        className="px-3 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: m.status === "Afgerond" ? "hsl(142.1 76.2% 36.3%)" : m.status === "Bezig" ? "hsl(141.9 69.2% 58%)" : "hsl(141 78.9% 85.1%)",
                          color: m.status === "Gepland" ? "hsl(144.9 80.4% 10%)" : "white",
                        }}
                      >
                        {m.status}
                      </span>
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
