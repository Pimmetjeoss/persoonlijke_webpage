"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

interface NavigationProps {
  onPlayClick?: () => void
}

export function Navigation({ onPlayClick }: NavigationProps) {
  const [isScrolledHalfway, setIsScrolledHalfway] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Halverwege de h-[50vh] spacer = 25vh
      const halfway = window.innerHeight * 0.25
      setIsScrolledHalfway(window.scrollY >= halfway)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeColor = 'hsl(142.4 71.8% 29.2%)'
  const defaultBg = 'transparent'
  const defaultText = 'hsl(144.9 80.4% 10%)'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left - Logo/Name */}
          <Link
            href="/"
            className="flex flex-col items-center px-8 py-3 border-[3px] rounded-full transition-all"
            style={{
              backgroundColor: isScrolledHalfway ? activeColor : defaultBg,
              color: isScrolledHalfway ? 'white' : defaultText,
              borderColor: defaultText,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = activeColor
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isScrolledHalfway ? activeColor : defaultBg
              e.currentTarget.style.color = isScrolledHalfway ? 'white' : defaultText
            }}
          >
            <span className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">CODE LIESHOUT</span>
            <span className="text-xs md:text-xl -mt-1 text-black" style={{ fontFamily: "var(--font-homemade-apple)" }}>ai oplossingen</span>
          </Link>

          {/* Right - Navigation buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPlayClick}
              className="text-xl md:text-2xl lg:text-3xl font-bold px-8 py-3 md:px-16 md:py-6 border-[3px] rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor: isScrolledHalfway ? activeColor : defaultBg,
                color: isScrolledHalfway ? 'white' : defaultText,
                borderColor: defaultText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = activeColor
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isScrolledHalfway ? activeColor : defaultBg
                e.currentTarget.style.color = isScrolledHalfway ? 'white' : defaultText
              }}
            >
              PLAY
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
