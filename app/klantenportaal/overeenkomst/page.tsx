"use client"

import { useRef } from "react"
import {
  FileTextIcon,
  CheckCircledIcon,
  DownloadIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons"
import { LapTimerIcon } from "@radix-ui/react-icons"
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid"
import { SectionCard } from "@/app/test/components/section-card"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { TimelineContent } from "@/app/portfolio/components/timeline-animation"

const features = [
  {
    Icon: FileTextIcon, name: "Overeenkomst",
    description: "De samenwerkingsovereenkomst voor uw AI project.",
    href: "#overeenkomst-doc", cta: "Bekijk document",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-4",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: LapTimerIcon, name: "Status",
    description: "Wacht op uw digitale ondertekening.",
    href: "#status", cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: CheckCircledIcon, name: "Ondertekenen",
    description: "Teken de overeenkomst digitaal.",
    href: "#ondertekenen", cta: "Onderteken nu",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: ListBulletIcon, name: "Alg. voorwaarden",
    description: "Bekijk de algemene voorwaarden.",
    href: "#voorwaarden", cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(141 78.9% 85.1%)",
  },
  {
    Icon: DownloadIcon, name: "Download",
    description: "Download als PDF voor uw archief.",
    href: "#download", cta: "Download PDF",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.4 71.8% 29.2%)",
  },
]

export default function OvereenkomstPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef} className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="OVEREENKOMST"
        backgroundColor="hsl(142.4 71.8% 29.2%)"
        hoverColor="hsl(141.9 69.2% 58%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <TimelineContent animationNum={1} timelineRef={pageRef} once={true}>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((f) => <BentoCard key={f.name} {...f} />)}
          </BentoGrid>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pageRef} once={true}>
          <div className="mt-16 space-y-8">
            <SectionCard id="overeenkomst-doc" title="Samenwerkingsovereenkomst" description="Tussen Code Lieshout en Voorbeeld Bedrijf B.V." Icon={FileTextIcon}>
              <div className="text-gray-500">
                <p>Deze overeenkomst omvat de ontwikkeling en implementatie van een AI-gestuurde chatbot en workflow automatisering. De looptijd is 8 weken vanaf ondertekening.</p>
                <p className="mt-4">De overeenkomst wacht momenteel op uw digitale ondertekening. Na ondertekening ontvangt u een bevestiging per e-mail.</p>
              </div>
            </SectionCard>

            <SectionCard id="voorwaarden" title="Algemene voorwaarden" description="De voorwaarden die van toepassing zijn op deze samenwerking." Icon={ListBulletIcon}>
              <div className="text-gray-500">
                <p>Onze algemene voorwaarden zijn gedeponeerd bij de KvK en beschrijven de rechten en plichten van beide partijen, inclusief aansprakelijkheid, intellectueel eigendom en betalingsvoorwaarden.</p>
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
