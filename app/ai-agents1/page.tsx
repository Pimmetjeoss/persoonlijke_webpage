import AboutUsSection from "./components/about-ai-section"
import { StickyFooter } from "@/app/components/sticky-footer"
import StickyHeader from "@/app/components/sticky-header"

export default function DemoOne() {
  return (
    <div className="relative min-h-screen">
      <StickyHeader
        title="AI & AGENTS"
        backgroundColor="rgb(240,253,244)"
        hoverColor="hsl(141 78.9% 85.1%)"
      />
      <AboutUsSection />
      <StickyFooter />
    </div>
  )
}
