"use client"

import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"

export default function MCPServerExample() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "rgb(0, 0, 0)" }}>
      <StickyHeader title="MCP-SERVER" wrapperBackgroundColor="rgb(0, 0, 0)" />

      <div className="p-4 md:p-8 lg:p-16 pb-32">
        {/* Content placeholder */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-white">MCP-Server Content</h2>
          <p className="text-lg text-gray-300">
            This is the MCP-Server example page with sticky header and footer.
          </p>
        </div>
      </div>

      <StickyFooter />
    </div>
  )
}
