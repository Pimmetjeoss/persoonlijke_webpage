"use client"

import { useRef } from "react"
import {
  PersonIcon,
  CheckCircledIcon,
  RocketIcon,
  GearIcon,
  LayersIcon,
} from "@radix-ui/react-icons"
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid"
import { SectionCard } from "@/app/test/components/section-card"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"

const features = [
  {
    Icon: RocketIcon, name: "Aan de slag",
    description: "Volg de stappen om snel te starten met uw AI-oplossing.",
    href: "#checklist", cta: "Start",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-4",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: LayersIcon, name: "Stap 1",
    description: "Account instellen en toegang configureren.",
    href: "#checklist", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: GearIcon, name: "Stap 2",
    description: "Integraties koppelen met uw bestaande systemen.",
    href: "#checklist", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: PersonIcon, name: "Stap 3",
    description: "Training en kennisoverdracht voor uw team.",
    href: "#checklist", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141 78.9% 85.1%)",
  },
  {
    Icon: CheckCircledIcon, name: "Stap 4",
    description: "Go-live en monitoring activeren.",
    href: "#checklist", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.4 71.8% 29.2%)",
  },
]

const checklist = [
  { stap: "Welkomstgesprek ingepland", done: true },
  { stap: "Toegangsgegevens ontvangen", done: true },
  { stap: "Systemen gekoppeld", done: false },
  { stap: "Teamtraining gepland", done: false },
  { stap: "Go-live datum bevestigd", done: false },
]

export default function OnboardingPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="ONBOARDING"
        backgroundColor="hsl(141.7 76.6% 73.1%)"
        hoverColor="hsl(141 78.9% 85.1%)"
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
            <SectionCard id="checklist" title="Onboarding checklist" description="Houd uw voortgang bij." Icon={CheckCircledIcon}>
              <div className="space-y-3 text-gray-600">
                {checklist.map((item) => (
                  <div key={item.stap} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: "hsl(142.1 76.2% 36.3%)",
                        backgroundColor: item.done ? "hsl(142.1 76.2% 36.3%)" : "transparent",
                      }}
                    >
                      {item.done && <CheckCircledIcon className="w-3 h-3 text-white" />}
                    </div>
                    <span className={item.done ? "line-through text-gray-400" : ""}>{item.stap}</span>
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
