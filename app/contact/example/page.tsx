import { StickyFooter } from "@/app/components/sticky-footer"
import StickyHeader from "@/app/components/sticky-header"

export default function ContactExample() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "rgb(240,253,244)" }}>
      <StickyHeader
        title="CONTACT"
        backgroundColor="rgb(240,253,244)"
        hoverColor="hsl(141 78.9% 85.1%)"
        wrapperBackgroundColor="rgb(240,253,244)"
      />

      <div className="p-4 md:p-8 lg:p-16 pb-32">
        {/* Content placeholder */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Contact Content</h2>
          <p className="text-lg text-gray-700">
            This is the contact example page with sticky header and footer.
          </p>
        </div>
      </div>

      <StickyFooter />
    </div>
  )
}
