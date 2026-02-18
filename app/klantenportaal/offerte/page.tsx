"use client"

import { useRef } from "react"
import {
  FileTextIcon,
  PersonIcon,
  ClockIcon,
  CheckCircledIcon,
  DownloadIcon,
} from "@radix-ui/react-icons"
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid"
import { SectionCard } from "@/app/test/components/section-card"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"

const features = [
  {
    Icon: FileTextIcon, name: "Offerte bekijken",
    description: "Uw persoonlijke offerte met gedetailleerde prijsopgave.",
    href: "#offerte-details", cta: "Bekijk offerte",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: DownloadIcon, name: "Download PDF",
    description: "Download de offerte als PDF voor uw administratie.",
    href: "#download", cta: "Download",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: CheckCircledIcon, name: "Goedkeuren",
    description: "Keur de offerte digitaal goed om het project te starten.",
    href: "#goedkeuren", cta: "Accordeer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: ClockIcon, name: "Geldigheid",
    description: "Deze offerte is geldig tot 14 maart 2026.",
    href: "#geldigheid", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: PersonIcon, name: "Vragen?",
    description: "Neem contact op voor wijzigingen of verduidelijking.",
    href: "#contact", cta: "Neem contact op",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.4 71.8% 29.2%)",
  },
]

export default function OffertePage() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="OFFERTE"
        backgroundColor="hsl(142.1 76.2% 36.3%)"
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
            <SectionCard id="offerte-details" title="Offerte details" description="AI Automatiseringsproject — Chatbot & Workflow Integratie" Icon={FileTextIcon}>
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Chatbot ontwikkeling</span>
                  <span className="font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>€ 2.500</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Workflow automatisering</span>
                  <span className="font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>€ 1.800</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Integratie & testen</span>
                  <span className="font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>€ 950</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-lg" style={{ color: "hsl(144.9 80.4% 10%)" }}>Totaal (excl. BTW)</span>
                  <span className="font-bold text-lg" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>€ 5.250</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="goedkeuren" title="Offerte goedkeuren" description="Keur de offerte digitaal goed zodat wij direct aan de slag kunnen." Icon={CheckCircledIcon}>
              <div className="text-gray-500">
                <p>Door de offerte goed te keuren gaat u akkoord met de beschreven scope, prijzen en voorwaarden. Na goedkeuring ontvangt u een bevestiging per e-mail.</p>
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
