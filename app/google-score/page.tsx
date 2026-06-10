"use client"

import { useRef } from "react"
import {
  BarChartIcon,
  LightningBoltIcon,
  RocketIcon,
} from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"
import { SectionCard } from "@/app/test/components/section-card"
import { GoogleScoreForm } from "./components/google-score-form"

const FEATURES = [
  {
    Icon: BarChartIcon,
    title: "Vergelijk jouw domein",
    text: "Zie direct hoe jouw domein scoort ten opzichte van twee concurrenten.",
    hover: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: LightningBoltIcon,
    title: "Officiële score",
    text: "Gebaseerd op een officiële domeinscore (0–100) uit een externe databron.",
    hover: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: RocketIcon,
    title: "Actiepunten",
    text: "Krijg een kort advies waar je als eerste aan kunt werken.",
    hover: "hsl(142.1 76.2% 36.3%)",
  },
]

export default function GoogleScoreLanding() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="GOOGLE SCORE"
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
              Gratis vergelijking
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-4"
              style={{
                color: "hsl(144.9 80.4% 10%)",
                fontFamily: "var(--font-fjalla-one)",
              }}
            >
              Hoe sterk is jouw domein in
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
              Vul je eigen domein en twee concurrenten in. Voor elk domein
              halen we een officiële domeinscore (0–100) op en tonen we in een
              simpele vergelijking wie de meeste autoriteit heeft.
            </p>
          </div>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pageRef} once>
          <SectionCard
            id="vergelijking"
            title="Start je vergelijking"
            description="Vul drie domeinen in en zie in één oogopslag wie er voorloopt."
            Icon={BarChartIcon}
          >
            <GoogleScoreForm />
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
