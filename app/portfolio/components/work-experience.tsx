"use client"

import { useRef, useState } from "react"
import { Plus } from "lucide-react"
import { workExperiences } from "../data/work-experience"
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from "./accordion"
import { TimelineContent } from "./timeline-animation"

export function WorkExperience() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Hover colors from kleuren.txt - each item gets a unique color
  const hoverColors = [
    "hsl(138.5 76.5% 96.7%)", // #11 - AMAZON (lichtste groen)
    "hsl(141 78.9% 85.1%)",   // #9 - APPLE (zeer licht groen)
    "hsl(141.9 69.2% 58%)",   // #7 - CRUISE (medium groen)
    "hsl(142.1 76.2% 36.3%)", // #5 - UBER (medium donker groen)
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
        <Accordion defaultValue="cruise">
          {workExperiences.map((experience, index) => (
            <TimelineContent
              key={experience.id}
              animationNum={index + 1}
              timelineRef={timelineRef}
              once={true}
            >
              <AccordionItem
                value={experience.id}
                className="mb-0 rounded-none border-t-[3px] border-black relative"
              >
                <AccordionHeader
                  className="pt-4 pb-2 px-4 md:px-8 lg:px-16 data-[active]:bg-transparent transition-all duration-300 ease-out group hover:-translate-y-3 hover:z-10"
                  customIcon
                  style={{
                    backgroundColor: hoveredIndex === index ? hoverColors[index] : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="grid grid-cols-[1fr_auto] gap-8 items-end w-full max-w-7xl mx-auto">
                    {/* Company Name */}
                    <div>
                      <h2
                        className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] group-hover:translate-x-2 transition-transform duration-300"
                        style={{
                          color: "hsl(144.9 80.4% 10%)",
                          marginBottom: "-0.15em"
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
                </AccordionHeader>

                <AccordionPanel
                  className="px-4 md:px-8 lg:px-16 pb-4 rounded-none"
                  style={{ backgroundColor: "hsl(141 78.9% 85.1%)" }}
                  articleClassName="px-0 py-4 max-w-7xl mx-auto"
                >
                  <div className="max-w-4xl">
                    {/* Description */}
                    <p
                      className="text-base md:text-lg mb-4 leading-relaxed"
                      style={{ color: "hsl(143.8 61.2% 20.2%)" }}
                    >
                      {experience.description}
                    </p>

                    {/* Highlights */}
                    <div>
                      <h3
                        className="text-sm font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "hsl(142.8 64.2% 24.1%)" }}
                      >
                        Key Highlights
                      </h3>
                      <ul className="space-y-1.5">
                        {experience.highlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex gap-3 items-start text-sm md:text-base leading-relaxed"
                            style={{ color: "hsl(143.8 61.2% 20.2%)" }}
                          >
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: "hsl(142.1 76.2% 36.3%)",
                              }}
                            />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </TimelineContent>
          ))}
        </Accordion>

        {/* Bottom border for last item */}
        <div className="h-[3px] w-full bg-black" />
      </div>
    </div>
  )
}
