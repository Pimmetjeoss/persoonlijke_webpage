"use client"

import {
  FileTextIcon,
  LayersIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "./components/bento-grid";
import { SectionCard } from "./components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from "@/components/ui/accordion";

const features = [
  {
    Icon: PersonIcon,
    name: "Simpel uitgelegd",
    description: "Complexe concepten begrijpelijk gemaakt voor iedereen.",
    href: "#simpel-uitgelegd",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(141 78.9% 85.1%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Antwoord op de meeste vragen omtrent dit onderwerp.",
    href: "#faq",
    cta: "Stel je vraag!",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: VideoIcon,
    name: "Visueel materiaal",
    description: "Om het nog simpeler te maken!",
    href: "#visueel",
    cta: "Veel kijkplezier!",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LayersIcon,
    name: "Stack met",
    description: "Werkt goed samen met deze andere mogelijkheden.",
    href: "#stack",
    cta: "Pak die combideal!",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "In detail",
    description: "Technische uitleg voor wie meer wil weten en wat te vertellen wil hebben bij het koffieautomaat.",
    href: "#in-detail",
    cta: "Verdiep je",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

function BentoDemo() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="TEST"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>

        {/* Sectie Cards */}
        <div className="mt-16 space-y-8">
          <SectionCard
            id="simpel-uitgelegd"
            title="Simpel uitgelegd"
            description="Complexe concepten begrijpelijk gemaakt voor iedereen."
            Icon={PersonIcon}
          />
          <SectionCard
            id="faq"
            title="FAQ"
            description="Antwoord op de meeste vragen omtrent dit onderwerp."
            Icon={FileTextIcon}
          >
            <Accordion defaultValue={['item-1']}>
              <AccordionItem value="item-1">
                <AccordionHeader>Vraag 1: Placeholder vraag?</AccordionHeader>
                <AccordionPanel>
                  Dit is een placeholder antwoord. Vul hier later de echte content in.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionHeader>Vraag 2: Nog een vraag?</AccordionHeader>
                <AccordionPanel>
                  Dit is een placeholder antwoord. Vul hier later de echte content in.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionHeader>Vraag 3: En nog een vraag?</AccordionHeader>
                <AccordionPanel>
                  Dit is een placeholder antwoord. Vul hier later de echte content in.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </SectionCard>
          <SectionCard
            id="visueel"
            title="Visueel materiaal"
            description="Om het nog simpeler te maken!"
            Icon={VideoIcon}
          />
          <SectionCard
            id="stack"
            title="Stack met"
            description="Werkt goed samen met deze andere mogelijkheden."
            Icon={LayersIcon}
          />
          <SectionCard
            id="in-detail"
            title="In detail"
            description="Technische uitleg voor wie meer wil weten en wat te vertellen wil hebben bij het koffieautomaat."
            Icon={MagnifyingGlassIcon}
          />
        </div>

        {/* Extra ruimte voor scroll testen */}
        <div className="h-[200vh]" />
      </div>
      <StickyFooter />
    </div>
  );
}

export default BentoDemo;