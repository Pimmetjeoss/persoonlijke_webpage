"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent && pathname === "/portfolio") {
      setVisible(true)
    }
  }, [pathname])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "granted")
    // Consent Mode v2: analytics aan
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
      })
    }
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "denied")
    // Consent Mode v2: analytics uit
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      })
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl">
      <div
        className="rounded-2xl border-[3px] border-[hsl(144.9,80.4%,10%)] bg-white shadow-xl p-5"
      >
        <p className="text-sm text-[hsl(144.9,80.4%,10%)] mb-4 leading-relaxed">
          🍪 Deze website gebruikt analytische cookies om te begrijpen hoe bezoekers de site gebruiken. 
          Er worden geen advertentiecookies geplaatst. Lees meer in ons{" "}
          <a
            href="/privacy"
            className="underline font-medium hover:text-[hsl(142.1,76.2%,36.3%)] transition-colors"
          >
            privacybeleid
          </a>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 rounded-xl bg-[hsl(144.9,80.4%,10%)] text-white text-sm font-semibold py-2.5 hover:bg-[hsl(142.1,76.2%,36.3%)] transition-colors"
          >
            Accepteren
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 rounded-xl border-2 border-[hsl(144.9,80.4%,10%)] text-[hsl(144.9,80.4%,10%)] text-sm font-semibold py-2.5 hover:bg-[hsl(140.6,84.2%,92.5%)] transition-colors"
          >
            Weigeren
          </button>
        </div>
      </div>
    </div>
  )
}
