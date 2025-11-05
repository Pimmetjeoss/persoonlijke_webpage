"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

interface StickyHeaderProps {
  title: string
  backgroundColor?: string
  hoverColor?: string
  className?: string
}

export default function StickyHeader({
  title,
  backgroundColor = "hsl(140.6 84.2% 92.5%)",
  hoverColor = "hsl(141 78.9% 85.1%)",
  className = ""
}: StickyHeaderProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Sticky black line that always stays at top */}
      <div
        className="sticky top-0"
        style={{
          zIndex: 100000,
          height: '3px',
          backgroundColor: 'black',
        }}
      />

      {/* Header content that scrolls behind the line */}
      <div
        className={className}
        style={{
          backgroundColor: backgroundColor,
          marginTop: '-3px', // Pull up to sit behind the sticky line
        }}
      >
        <header
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="border-t-[3px] border-b-[3px] border-black"
          style={{
            transform: isHovered ? "translateY(0)" : "translateY(-30%)",
            backgroundColor: isHovered ? hoverColor : backgroundColor,
            color: "hsl(144.9 80.4% 10%)",
            zIndex: isHovered ? 50 : 1,
            transition: "all 300ms ease-out",
          }}
        >
          <div className="pt-4 pb-2 px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-[1fr_auto] gap-8 items-end w-full max-w-7xl mx-auto">
              {/* Title */}
              <div>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85]">
                  {title}
                </h1>
              </div>

              {/* Icon */}
              <div className="flex items-center justify-center pb-2">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: "hsl(142.1 76.2% 36.3%)",
                  }}
                >
                  <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}
