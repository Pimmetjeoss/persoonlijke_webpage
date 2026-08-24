"use client"

import { useRef } from "react"
import {
  MagnifyingGlassIcon,
  BarChartIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons"
import { TegakiRenderer } from "tegaki/react"
import caveat from "tegaki/fonts/caveat"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"
import { SectionCard } from "@/app/test/components/section-card"
import { ScanForm } from "./components/scan-form"

const FEATURES = [
  {
    Icon: MagnifyingGlassIcon,
    title: "100+ checks",
    text: "Van robots.txt en llms.txt tot MCP, API's en betaalprotocollen.",
    hover: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: BarChartIcon,
    title: "Score 0–100",
    text: "Eén duidelijke score met uitsplitsing in essentieel, aanbevolen en bonus.",
    hover: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LightningBoltIcon,
    title: "Bewijs + fixes",
    text: "Elke bevinding met bewijs en een kant-en-klare aanbeveling.",
    hover: "hsl(142.1 76.2% 36.3%)",
  },
]

export default function AgentScanLanding() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="AGENT-SCAN"
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
              Gratis scan · 100+ checks
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-4"
              style={{
                color: "hsl(144.9 80.4% 10%)",
                fontFamily: "var(--font-fjalla-one)",
              }}
            >
              Hoe klaar is jouw site voor{" "}
              <TegakiRenderer
                as="span"
                font={caveat}
                className="inline-block align-baseline"
                style={{
                  color: "hsl(142.1 76.2% 36.3%)",
                  fontSize: "1.25em",
                  fontWeight: 400,
                  lineHeight: 0.85,
                  verticalAlign: "-0.04em",
                }}
              >
                AI-agents?
              </TegakiRenderer>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              De complete agent-scan van Is Agentic: een score van 0–100 op
              basis van 100+ checks, bewijs per bevinding en concrete fixes.
              Dieper dan een basisscan.
            </p>
          </div>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pageRef} once>
          <SectionCard
            id="scan"
            title="Start je scan"
            description="Plak een URL en ontvang direct je agent-scan score."
            Icon={MagnifyingGlassIcon}
          >
            <ScanForm />
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
