"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/app/lib/analytics"

const THRESHOLDS = [25, 50, 75, 90]

export function ScrollTracker() {
  const pathname = usePathname()
  const reached = useRef<Set<number>>(new Set())

  useEffect(() => {
    // Reset bij paginawissel
    reached.current = new Set()

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const percent = Math.round((scrollTop / docHeight) * 100)

      THRESHOLDS.forEach((threshold) => {
        if (percent >= threshold && !reached.current.has(threshold)) {
          reached.current.add(threshold)
          trackEvent("scroll_depth", {
            percent_scrolled: threshold,
            page_path: pathname,
          })
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  return null
}
