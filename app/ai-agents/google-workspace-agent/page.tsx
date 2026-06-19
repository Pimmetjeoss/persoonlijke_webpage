"use client"

import { useRef } from "react";
import {
  FileTextIcon,
  LayersIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { Accordion05, FAQItem } from "@/app/test/components/accordion-05";
import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid";
import { SectionCard } from "@/app/test/components/section-card";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";

const faqItems: FAQItem[] = [
  {
    id: "1",
    title: "Placeholder vraag 1?",
    content: "Dit is placeholder content. De echte Google Workspace Agent-inhoud vullen we later in.",
  },
  {
    id: "2",
    title: "Placeholder vraag 2?",
    content: "Dit is placeholder content. De echte details komen later.",
  },
  {
    id: "3",
    title: "Placeholder vraag 3?",
    content: "Dit is placeholder content voor de nieuwe agent-pagina.",
  },
];

const features = [
  {
    Icon: PersonIcon,
    name: "Simpel uitgelegd",
    description: "Placeholder voor de korte uitleg van deze agent.",
    href: "#simpel-uitgelegd",
    cta: "",
    background: <div className="absolute -right-20 -top-20 opacity-60" aria-hidden="true" />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Placeholder voor veelgestelde vragen.",
    href: "#faq",
    cta: "Stel je vraag!",
    background: <div className="absolute -right-20 -top-20 opacity-60" aria-hidden="true" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: VideoIcon,
    name: "Visueel materiaal",
    description: "Placeholder voor visueel materiaal.",
    href: "#visueel",
    cta: "Veel kijkplezier!",
    background: <div className="absolute -right-20 -top-20 opacity-60" aria-hidden="true" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LayersIcon,
    name: "Stack met",
    description: "Placeholder voor combinaties en koppelingen.",
    href: "#stack",
    cta: "Pak die combideal!",
    background: <div className="absolute -right-20 -top-20 opacity-60" aria-hidden="true" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "In detail",
    description: "Placeholder voor de technische verdieping.",
    href: "#in-detail",
    cta: "Verdiep je",
    background: <div className="absolute -right-20 -top-20 opacity-60" aria-hidden="true" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

export default function GoogleWorkspaceAgentPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="GOOGLE WORKSPACE AGENT"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 pt-[34vh] lg:p-10">
        <TimelineContent animationNum={1} timelineRef={pageRef} once={true}>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pageRef} once={true}>
          <div className="mt-16 space-y-8">
            <SectionCard
              id="simpel-uitgelegd"
              title="Simpel uitgelegd"
              description="Placeholder voor de korte uitleg van deze agent."
              Icon={PersonIcon}
            />
            <SectionCard
              id="faq"
              title="FAQ"
              description="Placeholder voor veelgestelde vragen."
              Icon={FileTextIcon}
            >
              <Accordion05 items={faqItems} />
            </SectionCard>
            <SectionCard
              id="visueel"
              title="Visueel materiaal"
              description="Placeholder voor visueel materiaal."
              Icon={VideoIcon}
            />
            <SectionCard
              id="stack"
              title="Stack met"
              description="Placeholder voor combinaties en koppelingen."
              Icon={LayersIcon}
            />
            <SectionCard
              id="in-detail"
              title="In detail"
              description="Placeholder voor de technische verdieping."
              Icon={MagnifyingGlassIcon}
            />
          </div>
        </TimelineContent>

        <div className="h-[120vh]" />
      </div>
      <StickyFooter />
    </div>
  );
}
