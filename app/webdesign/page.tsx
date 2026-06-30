"use client"

import { useRef } from "react";
import {
  FileTextIcon,
  LayersIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "../test/components/bento-grid";
import { SectionCard } from "../test/components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";
import { useTransition } from "@/app/components/transition_provider";

const workflowSteps = [
  {
    title: "Verkenning",
    href: "/webdesign/verkenning",
  },
  {
    title: "Realisatie",
    href: "/webdesign/realisatie",
  },
  {
    title: "Testen & redactie",
    href: "/webdesign/testen-en-redactie",
  },
  {
    title: "Go-live",
    href: "/webdesign/go-live",
  },
  {
    title: "Onderhoud",
    href: "/webdesign/onderhoud",
  },
  {
    title: "Optimalisatie",
    href: "/webdesign/optimalisatie",
  },
];

const features = [
  {
    Icon: PersonIcon,
    name: "Simpel uitgelegd",
    description: "Complexe concepten begrijpelijk gemaakt voor iedereen.",
    href: "#simpel-uitgelegd",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: FileTextIcon,
    name: "Werkwijze",
    description: "De stappen van verkenning tot optimalisatie.",
    href: "#werkwijze",
    cta: "Bekijk de stappen",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: VideoIcon,
    name: "Visueel materiaal",
    description: "Om het nog simpeler te maken!",
    href: "#visueel",
    cta: "Veel kijkplezier!",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LayersIcon,
    name: "Stack met",
    description: "Werkt goed samen met deze andere mogelijkheden.",
    href: "#stack",
    cta: "Pak die combideal!",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "In detail",
    description: "Technische uitleg voor wie meer wil weten en wat te vertellen wil hebben bij het koffieautomaat.",
    href: "#in-detail",
    cta: "Verdiep je",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

export default function WebdesignPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { startTransition } = useTransition();

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="WEBDESIGN"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <TimelineContent
          animationNum={1}
          timelineRef={pageRef}
          once={true}
        >
          <div className="space-y-8">
            <SectionCard
              id="simpel-uitgelegd"
              title="Van strategie naar een website die blijft presteren"
              description="Een heldere werkwijze voor digitale platforms die kloppen in strategie, techniek, vorm en resultaat."
              Icon={PersonIcon}
            >
              <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  Een sterke website ontstaat niet zomaar; het is de uitkomst van een weloverwogen aanpak. Vanaf de eerste strategische analyse tot aan de blijvende verbetering na lancering staat elke stap in het teken van maximaal resultaat. Wij vertrouwen niet op gissingen, maar leggen samen een rotsvast fundament. Door intensieve samenwerking, voortdurend testen en heldere communicatie zorgen we dat het eindproduct perfect past bij jullie doelen én bij wat de gebruiker nodig heeft.
                </p>
                <p>
                  Onze werkwijze bestaat uit duidelijke, op elkaar volgende stappen. We beginnen met een grondige verkenning. Daarna geven we in de realisatiefase vorm aan een technisch en visueel sterke oplossing. In de test- & redactiefase verfijnen we tot in detail, om vervolgens bij de go-live het resultaat aan de buitenwereld te presenteren. En daar houdt het niet op. Met aandachtig onderhoud en proactieve optimalisatie zorgen we ervoor dat jouw digitale platform blijft groeien, presteren en toekomstbestendig blijft.
                </p>
              </div>
            </SectionCard>
            <SectionCard
              id="werkwijze"
              title="Werkwijze"
              description="Hieronder kant en klaar uitgelegd hoe mijn standaardwerkwijze is."
              Icon={FileTextIcon}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {workflowSteps.map((step, index) => (
                  <button
                    key={step.href}
                    type="button"
                    onClick={() => startTransition(step.href)}
                    className="group flex items-center justify-between rounded-xl border-[3px] border-[hsl(144.9_80.4%_10%)] bg-white p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-[hsl(141_78.9%_85.1%)] hover:shadow-lg"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(144.9_80.4%_10%)] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-xl font-semibold text-[hsl(144.9_80.4%_10%)]">
                        {step.title}
                      </span>
                    </span>
                    <span className="text-2xl text-[hsl(144.9_80.4%_10%)] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </SectionCard>
            <SectionCard
              id="visueel"
              title="Visueel materiaal"
              description="Om het nog simpeler te maken!"
              Icon={VideoIcon}
            />

            <BentoGrid className="lg:grid-rows-3">
              {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
              ))}
            </BentoGrid>

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
        </TimelineContent>

        <div className="h-[200vh]" />
      </div>
      <StickyFooter />
    </div>
  );
}
