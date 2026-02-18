"use client"

import { useRef } from "react"
import {
  DownloadIcon,
  BarChartIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons"
import { ReaderIcon } from "@radix-ui/react-icons"
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid"
import { SectionCard } from "@/app/test/components/section-card"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"

const features = [
  {
    Icon: BarChartIcon, name: "Dashboard",
    description: "Live resultaten en KPI's van uw AI-oplossing.",
    href: "#dashboard", cta: "Open dashboard",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-4",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: ReaderIcon, name: "Maandrapport",
    description: "Rapport van januari 2026 beschikbaar.",
    href: "#maandrapport", cta: "Bekijk rapport",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: LightningBoltIcon, name: "Inzichten",
    description: "AI-gegenereerde aanbevelingen op basis van data.",
    href: "#inzichten", cta: "Bekijk inzichten",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: DownloadIcon, name: "Exporteren",
    description: "Download rapportages als PDF of Excel.",
    href: "#export", cta: "Exporteer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
]

export default function RapportagesPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="RAPPORTAGES"
        backgroundColor="hsl(144.9 80.4% 10%)"
        hoverColor="hsl(142.1 76.2% 36.3%)"
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
            <SectionCard id="dashboard" title="Resultaten dashboard" description="Kerncijfers van uw AI-oplossing op een rij." Icon={BarChartIcon}>
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Chatbot gesprekken (jan 2026)</span>
                  <span className="font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>1.247</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Klanttevredenheid</span>
                  <span className="font-bold" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>94%</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Geautomatiseerde workflows</span>
                  <span className="font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>38 per dag</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Geschatte tijdsbesparing</span>
                  <span className="font-bold" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>12 uur/week</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="inzichten" title="AI Inzichten" description="Aanbevelingen op basis van uw data." Icon={LightningBoltIcon}>
              <div className="text-gray-500">
                <p>Op basis van de data van afgelopen maand adviseren wij om de chatbot uit te breiden met veelgestelde vragen over retouren. Dit kan het aantal handmatige afhandelingen met circa 25% verlagen.</p>
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
