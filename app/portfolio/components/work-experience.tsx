"use client"

import React, { useRef, useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { motion } from "motion/react"
import { useTransition } from "@/app/components/transition_provider"
import { workExperiences } from "../data/work-experience"
import { TimelineContent } from "./timeline-animation"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function WorkExperience() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { startTransition } = useTransition()
  const router = useRouter()

  // Prefetch routes for faster transitions
  useEffect(() => {
    router.prefetch('/about-me!')
    router.prefetch('/contact')
    router.prefetch('/blog')
    router.prefetch('/ai-agents')
    router.prefetch('/sir-prikkel')
    router.prefetch('/database')
    router.prefetch('/under-construction')
    router.prefetch('/rauw-collectief')
  }, [router])

  // Hover colors from kleuren.txt - speels door elkaar gemixed voor 17 items
  const hoverColors = [
    "hsl(141.9 69.2% 58%)",   // #7 - medium groen
    "hsl(143.8 61.2% 20.2%)", // #2 - zeer donker
    "hsl(141 78.9% 85.1%)",   // #9 - zeer licht
    "hsl(142.4 71.8% 29.2%)", // #4 - donker
    "hsl(141.9 69.2% 58%)",   // #7 - medium groen (AI-AGENTS)
    "hsl(144.9 80.4% 10%)",   // #1 - donkerste
    "hsl(141.7 76.6% 73.1%)", // #8 - licht
    "hsl(142.8 64.2% 24.1%)", // #3 - donker
    "hsl(140.6 84.2% 92.5%)", // #10 - bijna lichtste
    "hsl(142.1 76.2% 36.3%)", // #5 - medium donker
    "hsl(141.9 69.2% 58%)",   // #7 - medium groen (herhaald)
    "hsl(143.8 61.2% 20.2%)", // #2 - zeer donker (herhaald)
    "hsl(141 78.9% 85.1%)",   // #9 - zeer licht (herhaald)
    "hsl(142.1 70.6% 45.3%)", // #6 - medium
    "hsl(144.9 80.4% 10%)",   // #1 - donkerste (herhaald)
    "hsl(141.7 76.6% 73.1%)", // #8 - licht (herhaald)
    "hsl(142.4 71.8% 29.2%)", // #4 - donker (herhaald voor 17e item)
  ]

  // Donkere kleuren (lightness < 30%) krijgen lichte tekst bij hover
  // Indices: 1, 3, 5, 7, 9, 11, 14, 16 hebben donkere achtergronden
  const darkIndices = [1, 3, 5, 7, 9, 11, 14, 16]
  const getTextColor = (index: number, isHovered: boolean) => {
    if (isHovered && darkIndices.includes(index)) {
      return "hsl(138.5 76.5% 96.7%)" // lichtste groen voor contrast
    }
    return "hsl(144.9 80.4% 10%)" // donkerste groen (standaard)
  }

  // Route mapping voor alle items
  const getRoute = (id: string): string => {
    const routes: Record<string, string> = {
      "about-me": "/about-me!",
      "contact": "/contact",
      "blog": "/blog",
      "ai-agents": "/ai-agents",
      "sir-prikkel": "/sir-prikkel",
      "database": "/database",
      "rauw-collectief": "/rauw-collectief",
    }
    return routes[id] || "/under-construction"
  }

  return (
    <div
      ref={timelineRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      {/* Spacer to push accordion halfway down - with cactus */}
      <div className="h-[50vh] relative overflow-visible">
        {/* Cactus mascotte - positioned to overlap accordion line */}
        <Image
          src="/cactus_laptop_transparent.png"
          alt="Cactus mascotte"
          width={250}
          height={250}
          className="absolute -bottom-[130px] right-[5%] md:right-[10%] lg:right-[15%] w-[150px] md:w-[200px] lg:w-[250px] z-0 pointer-events-none"
        />
      </div>

      <div className="relative z-10">
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
                  const route = getRoute(experience.id)
                  if (route) startTransition(route)
                }}
                className="transition-all duration-300 ease-out mb-0 rounded-none border-t-[3px] border-black hover:-translate-y-6 overflow-hidden hover:overflow-visible w-full cursor-pointer"
                style={{
                  zIndex: hoveredIndex === index ? 50 : 1,
                  backgroundColor: hoveredIndex === index ? hoverColors[index] : 'hsl(140.6 84.2% 92.5%)',
                }}
              >
                <div className="pt-4 pb-2 px-4 md:px-8 lg:px-16">
                  <div className="grid grid-cols-[1fr_auto] gap-8 items-end w-full max-w-7xl mx-auto">
                    {/* Company Name */}
                    <div>
                      <h2
                        className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] group-hover:translate-x-2 transition-all duration-300"
                        style={{
                          color: getTextColor(index, hoveredIndex === index),
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
