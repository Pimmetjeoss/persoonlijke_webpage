"use client"

import StickyHeader from "../components/sticky-header"

export default function TestPage() {
  return (
    <div className="min-h-screen">
      {/* Sticky Header - één balk bovenaan */}
      <StickyHeader title="ABOUT ME" />

      {/* Test Content om scrolling te kunnen testen */}
      <div
        className="p-4 md:p-8 lg:p-16"
        style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
      >
        <div className="space-y-8">
          <p className="text-2xl">Scroll naar beneden om te zien dat de header bovenaan blijft plakken...</p>

          <div className="h-screen flex items-center justify-center">
            <h2 className="text-5xl font-bold">Content Section 1</h2>
          </div>

          <div className="h-screen flex items-center justify-center">
            <h2 className="text-5xl font-bold">Content Section 2</h2>
          </div>

          <div className="h-screen flex items-center justify-center">
            <h2 className="text-5xl font-bold">Content Section 3</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
