"use client"

import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"

export default function WebsiteExample() {
  return (
    <div className="relative min-h-screen">
      <StickyHeader title="WEBSITE" />

      <div className="p-4 md:p-8 lg:p-16 pb-32">
        {/* Content placeholder */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Website Content</h2>
          <p className="text-lg text-gray-700">
            This is the website example page with sticky header and footer.
          </p>
        </div>
      </div>

      <StickyFooter />
    </div>
  )
}
