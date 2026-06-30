"use client"

import { useRef } from "react"
import {
  DashboardIcon,
  LightningBoltIcon,
  RocketIcon,
} from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"
import { SectionCard } from "@/app/test/components/section-card"
import { SpeedCheckForm } from "./components/speed-check-form"

const FEATURES = [
  {
    Icon: LightningBoltIcon,
    title: "Mobiel + desktop",
    text: "We testen niet alleen desktop, maar vooral mobiel — waar bezoekers vaak afhaken.",
    hover: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: DashboardIcon,
    title: "Echte PageSpeed data",
    text: "Scores en verbeterpunten komen uit Google PageSpeed Insights en Lighthouse.",
    hover: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: RocketIcon,
    title: "Concrete fixes",
    text: "Geen AI-blabla: je ziet direct welke technische punten je site vertragen.",
    hover: "hsl(142.1 76.2% 36.3%)",
  },
]

export default function SpeedCheckLanding() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="SPEED CHECK"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-12">
        <TimelineContent animationNum={1} timelineRef={pageRef} once>
          <div className="text-center md:text-left">
            <p
              className="uppercase text-xs tracking-widest mb-2"
              style={{ color: "hsl(142.1 76.2% 36.3%)" }}
            >
              Gratis snelheidsscan
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-4"
              style={{
                color: "hsl(144.9 80.4% 10%)",
                fontFamily: "var(--font-fjalla-one)",
              }}
            >
              Is jouw website snel genoeg voor
              {" "}
              <span
                className="inline-block"
                style={{
                  fontFamily: "var(--font-homemade-apple)",
                  color: "hsl(142.1 76.2% 36.3%)",
                  fontWeight: 400,
                }}
              >
                Google?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              Test gratis je mobiele snelheid, desktop snelheid, toegankelijkheid
              en best practices. Geen account nodig — alleen je URL invullen.
            </p>
          </div>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pageRef} once>
          <SectionCard
            id="scan"
            title="Start je Speed Check"
            description="Plak je website en krijg direct een score, level en belangrijkste verbeterpunten."
            Icon={LightningBoltIcon}
          >
            <SpeedCheckForm />
          </SectionCard>
        </TimelineContent>

        <TimelineContent animationNum={3} timelineRef={pageRef} once>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border-[3px] p-6 bg-white transition-colors"
                style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: f.hover }}
                >
                  <f.Icon
                    className="w-5 h-5"
                    style={{ color: "hsl(144.9 80.4% 10%)" }}
                  />
                </div>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{
                    color: "hsl(144.9 80.4% 10%)",
                    fontFamily: "var(--font-fjalla-one)",
                  }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-gray-700">{f.text}</p>
              </div>
            ))}
          </div>
        </TimelineContent>

        <div className="h-8" />
      </div>
      <StickyFooter />
    </div>
  )
}
