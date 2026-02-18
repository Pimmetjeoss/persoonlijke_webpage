"use client"

import { useRef } from "react"
import {
  FileTextIcon,
  PersonIcon,
  DownloadIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid"
import { SectionCard } from "@/app/test/components/section-card"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"

const features = [
  {
    Icon: FileTextIcon, name: "Concept bekijken",
    description: "Bekijk het huidige concept van de verwerkersovereenkomst.",
    href: "#concept", cta: "Bekijk concept",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: MagnifyingGlassIcon, name: "AVG-informatie",
    description: "Hoe wij omgaan met persoonsgegevens conform de AVG.",
    href: "#avg", cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: PersonIcon, name: "Feedback geven",
    description: "Heeft u opmerkingen? Laat het ons weten.",
    href: "#feedback", cta: "Geef feedback",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: DownloadIcon, name: "Download concept",
    description: "Download het concept als PDF.",
    href: "#download", cta: "Download",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
]

export default function VerwerkersovereenkomstPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="VERWERKERSOVEREENKOMST"
        backgroundColor="hsl(141.9 69.2% 58%)"
        hoverColor="hsl(141.7 76.6% 73.1%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <TimelineContent animationNum={1} timelineRef={pageRef} once={true}>
          <BentoGrid className="lg:grid-rows-2">
            {features.map((f) => <BentoCard key={f.name} {...f} />)}
          </BentoGrid>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pageRef} once={true}>
          <div className="mt-16 space-y-8">
            <SectionCard id="avg" title="AVG & Privacy" description="Hoe Code Lieshout omgaat met persoonsgegevens." Icon={MagnifyingGlassIcon}>
              <div className="text-gray-500">
                <p>Wij verwerken persoonsgegevens uitsluitend in opdracht van u als verwerkingsverantwoordelijke. Alle data wordt opgeslagen binnen de EU en versleuteld volgens de laatste standaarden.</p>
                <p className="mt-4">Deze verwerkersovereenkomst is opgesteld conform de Algemene Verordening Gegevensbescherming (AVG/GDPR).</p>
              </div>
            </SectionCard>
          </div>
        </TimelineContent>

        <div className="h-[50vh]" />
      </div>
      <StickyFooter />
    </div>
  )
}
