"use client"

import React, { useRef, useState } from "react"
import { Plus } from "lucide-react"
import { motion } from "motion/react"
import { useTransition } from "@/app/components/transition_provider"
import { workExperiences } from "../data/work-experience"
import { TimelineContent } from "./timeline-animation"

export function WorkExperience() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { startTransition } = useTransition()

  // Hover colors from kleuren.txt - each item gets a unique color
  const hoverColors = [
    "hsl(138.5 76.5% 96.7%)", // #11 - ABOUT ME (lichtste groen)
    "hsl(141 78.9% 85.1%)",   // #9 - APPLE (zeer licht groen)
    "hsl(141.9 69.2% 58%)",   // #7 - CRUISE (medium groen)
    "hsl(142.1 76.2% 36.3%)", // #5 - UBER (medium donker groen)
    "hsl(142.4 71.8% 29.2%)", // #4 - TESLA (tussen UBER en LYFT)
    "hsl(142.8 64.2% 24.1%)", // #3 - LYFT (donker groen)
  ]

  return (
    <div
      ref={timelineRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      {/* Spacer to push accordion halfway down */}
      <div className="h-[50vh]" />

      <div>
          {workExperiences.map((experience, index) => (
            <React.Fragment key={experience.id}>
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
                  backgroundColor: hoveredIndex === index ? hoverColors[index] : 'hsl(140.6 84.2% 92.5%)',
                }}
              >
              <div
                onClick={() => {
                  if (experience.id === "ai-agents") startTransition("/ai-agents");
                  if (experience.id === "about-me") startTransition("/about-me!");
                }}
                className="transition-all duration-300 ease-out mb-0 rounded-none border-t-[3px] border-black hover:-translate-y-6 overflow-hidden hover:overflow-visible w-full"
                style={{
                  zIndex: hoveredIndex === index ? 50 : 1,
                  backgroundColor: hoveredIndex === index ? hoverColors[index] : 'hsl(140.6 84.2% 92.5%)',
                  cursor: (experience.id === "ai-agents" || experience.id === "about-me") ? 'pointer' : 'default',
                }}
              >
                <div className="pt-4 pb-2 px-4 md:px-8 lg:px-16">
                  <div className="grid grid-cols-[1fr_auto] gap-8 items-end w-full max-w-7xl mx-auto">
                    {/* Company Name */}
                    <div>
                      <h2
                        className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] group-hover:translate-x-2 transition-transform duration-300"
                        style={{
                          color: "hsl(144.9 80.4% 10%)",
                          marginBottom: "-0.3em"
                        }}
                      >
                        {experience.company}
                      </h2>
                    </div>

                    {/* Icon */}
                    <div className="flex items-center justify-center pb-2">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 group-data-[active]:rotate-45 group-hover:scale-110"
                        style={{
                          backgroundColor: "hsl(142.1 76.2% 36.3%)",
                        }}
                      >
                        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </TimelineContent>
            </React.Fragment>
          ))}

        {/* Bottom border for last item */}
        <div className="h-[3px] w-full bg-black" />
      </div>

      {/* Spacer for sticky footer */}
      <div className="h-12" />
    </div>
  )
}
