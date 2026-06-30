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
    cactus: "/webdesign/cactussen/verkenning.svg",
  },
  {
    title: "Realisatie",
    href: "/webdesign/realisatie",
    cactus: "/webdesign/cactussen/realisatie.svg",
  },
  {
    title: "Testen & redactie",
    href: "/webdesign/testen-en-redactie",
    cactus: "/webdesign/cactussen/testen-en-redactie.svg",
  },
  {
    title: "Go-live",
    href: "/webdesign/go-live",
    cactus: "/webdesign/cactussen/go-live.svg",
  },
  {
    title: "Onderhoud",
    href: "/webdesign/onderhoud",
    cactus: "/webdesign/cactussen/onderhoud.svg",
  },
  {
    title: "Optimalisatie",
    href: "/webdesign/optimalisatie",
    cactus: "/webdesign/cactussen/optimalisatie.svg",
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
              <div className="w-full">
                {workflowSteps.map((step, index) => (
                  <button
                    key={step.href}
                    type="button"
                    onClick={() => startTransition(step.href)}
                    className="group w-full border-b border-[hsl(144.9_80.4%_10%)]/10 py-4 text-left text-[hsl(144.9_80.4%_10%)] transition-colors duration-200 hover:bg-[hsl(141_78.9%_85.1%)]/35"
                  >
                    <span className="flex flex-1 items-start gap-4 overflow-hidden">
                      <span className="pt-2 text-xs">{index + 1}</span>
                      <img
                        src={step.cactus}
                        alt=""
                        className="mt-[-6px] h-12 w-12 shrink-0 rounded-xl border-2 border-[hsl(144.9_80.4%_10%)] bg-[hsl(140.6_84.2%_92.5%)] p-1"
                      />
                      <span className="relative text-left text-3xl font-bold uppercase leading-none md:text-5xl">
                        {step.title}
                      </span>
                      <span className="ml-auto pt-1 text-3xl transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
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
            >
              <div className="overflow-hidden rounded-xl border-[3px] border-[hsl(144.9_80.4%_10%)] bg-[hsl(144.9_80.4%_10%)] shadow-xl">
                <div className="flex items-center justify-between gap-4 border-b-2 border-white/15 px-5 py-4 text-white">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[hsl(141_78.9%_85.1%)]">
                      Brag video
                    </p>
                    <h3 className="text-2xl font-bold">Zes stappen, één scherpe werkwijze</h3>
                  </div>
                  <span className="hidden rounded-full bg-[hsl(141_78.9%_85.1%)] px-4 py-2 text-sm font-bold text-[hsl(144.9_80.4%_10%)] sm:inline-flex">
                    1 t/m 6
                  </span>
                </div>
                <video
                  className="aspect-video w-full bg-black"
                  controls
                  preload="metadata"
                  poster="/webdesign/brag-poster.svg"
                >
                  <source src="/webdesign/werkwijze-brag.mp4" type="video/mp4" />
                  Je browser ondersteunt deze video niet.
                </video>
              </div>
            </SectionCard>

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
