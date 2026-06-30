"use client"

import { useRef } from "react";
import {
  FileTextIcon,
  LayersIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "../test/components/bento-grid";
import { SectionCard } from "../test/components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";
import { useTransition } from "@/app/components/transition_provider";
import { AwardInteractions, AwardMotionLayer } from "./components/award-motion";

const workflowSteps = [
  {
    title: "Verkenning",
    href: "/webdesign/verkenning",
    cactus: "/webdesign/mascots/verkenning.png",
  },
  {
    title: "Realisatie",
    href: "/webdesign/realisatie",
    cactus: "/webdesign/mascots/realisatie.png",
  },
  {
    title: "Testen & redactie",
    href: "/webdesign/testen-en-redactie",
    cactus: "/webdesign/mascots/testen-en-redactie.png",
  },
  {
    title: "Go-live",
    href: "/webdesign/go-live",
    cactus: "/webdesign/mascots/go-live.png",
  },
  {
    title: "Onderhoud",
    href: "/webdesign/onderhoud",
    cactus: "/webdesign/mascots/onderhoud.png",
  },
  {
    title: "Optimalisatie",
    href: "/webdesign/optimalisatie",
    cactus: "/webdesign/mascots/optimalisatie.png",
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
    Icon: LayersIcon,
    name: "Stack met",
    description: "Werkt goed samen met deze andere mogelijkheden.",
    href: "#stack",
    cta: "Pak die combideal!",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
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
      <AwardInteractions />
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
                  Een goede website begint niet met een template. Eerst wil ik weten wat je verkoopt, wie je moet raken en waar bezoekers nu afhaken. Pas daarna maak ik keuzes in ontwerp, techniek en tekst.
                </p>
                <p>
                  Daarom werk ik in zes vaste stappen. We bepalen de richting, bouwen gericht, testen alles, zetten de site live en blijven daarna verbeteren. Geen mistig traject, maar steeds duidelijk wat er gebeurt en waarom.
                </p>
              </div>
            </SectionCard>
            <section
              id="werkwijze"
              data-award-reveal
              className="relative overflow-hidden rounded-xl border-[3px] bg-white p-8 shadow-xl scroll-mt-32 md:p-12"
              style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
            >
              <AwardMotionLayer className="opacity-45" />
              <div className="relative flex items-start gap-6">
                <div className="flex-shrink-0 text-[hsl(144.9_80.4%_10%)]">
                  <FileTextIcon className="h-10 w-10 md:h-12 md:w-12" />
                </div>
                <div className="flex-1">
                  <h2
                    className="mb-4 text-5xl font-bold uppercase tracking-tight md:text-7xl lg:text-8xl"
                    style={{ color: "hsl(144.9 80.4% 10%)" }}
                  >
                    Werkwijze
                  </h2>
                  <p className="mb-9 max-w-3xl text-xl font-semibold leading-relaxed text-gray-600 md:text-2xl">
                    Antwoord op de meeste vragen omtrent dit onderwerp.
                  </p>
                  <div className="w-full">
                    {workflowSteps.map((step, index) => (
                      <button
                        key={step.href}
                        type="button"
                        data-award-hover
                        onClick={() => startTransition(step.href)}
                        className="group relative block h-[4.6rem] w-full overflow-visible border-b border-[hsl(144.9_80.4%_10%)]/12 text-left text-[hsl(144.9_80.4%_10%)] transition-colors duration-200 hover:bg-[hsl(141_78.9%_85.1%)]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(144.9_80.4%_10%)] md:h-[5.25rem]"
                      >
                        <span data-award-target className="flex h-full items-end gap-5 overflow-visible px-0">
                          <span className="mb-[1.05rem] w-5 shrink-0 text-xs leading-none md:mb-[1.2rem]">
                            {index + 1}
                          </span>
                          <span className="relative -mb-[0.46rem] block text-left text-5xl font-bold uppercase leading-[0.82] tracking-tight md:-mb-[0.62rem] md:text-7xl">
                            {step.title}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>


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
