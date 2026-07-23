"use client"

import Link from "next/link";
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
import { Accordion05, FAQItem } from "../test/components/accordion-05";
import { AwardInteractions, InteractivePointsLayer } from "./components/award-motion";


const workflowFaqItems: FAQItem[] = [
  {
    id: "1",
    title: "Verkenning",
    content: <span>We bepalen doel, doelgroep, structuur, stijlrichting en techniek. <Link className="font-bold text-[hsl(144.9_80.4%_10%)] underline" href="/webdesign/verkenning">Bekijk deze stap</Link>.</span>
  },
  {
    id: "2",
    title: "Realisatie",
    content: <span>Ontwerp, techniek en inhoud komen samen in echte schermen. <Link className="font-bold text-[hsl(144.9_80.4%_10%)] underline" href="/webdesign/realisatie">Bekijk deze stap</Link>.</span>
  },
  {
    id: "3",
    title: "Testen & redactie",
    content: <span>We testen formulieren, mobiel gebruik, snelheid, teksten en klikpaden. <Link className="font-bold text-[hsl(144.9_80.4%_10%)] underline" href="/webdesign/testen-en-redactie">Bekijk deze stap</Link>.</span>
  },
  {
    id: "4",
    title: "Go-live",
    content: <span>We zetten domein, analytics, redirects en laatste checks klaar. <Link className="font-bold text-[hsl(144.9_80.4%_10%)] underline" href="/webdesign/go-live">Bekijk deze stap</Link>.</span>
  },
  {
    id: "5",
    title: "Onderhoud",
    content: <span>Na livegang houden we updates, support en kleine verbeteringen bij. <Link className="font-bold text-[hsl(144.9_80.4%_10%)] underline" href="/webdesign/onderhoud">Bekijk deze stap</Link>.</span>
  },
  {
    id: "6",
    title: "Optimalisatie",
    content: <span>We kijken naar data en gebruikersgedrag en verbeteren stap voor stap. <Link className="font-bold text-[hsl(144.9_80.4%_10%)] underline" href="/webdesign/optimalisatie">Bekijk deze stap</Link>.</span>
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
              className="relative overflow-hidden rounded-xl border-[3px] bg-white p-8 pb-24 shadow-xl scroll-mt-32 md:p-12 md:pb-24"
              style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
            >
              <InteractivePointsLayer />
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
                    De zes vaste stappen van eerste idee tot doorlopende verbetering.
                  </p>
                  <div className="w-full">
                    <Accordion05 items={workflowFaqItems} />
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
            >
              <div className="space-y-5 text-lg leading-relaxed text-gray-700">
                <p>
                  Een nieuwe website is vaak de start. Daarna wil je dat Google de pagina&apos;s goed snapt, dat AI-tools je bedrijf correct kunnen samenvatten en dat bezoekers zonder twijfel de juiste actie nemen.
                </p>
                <p>
                  Daarom past webdesign goed bij de SEO/GEO scan. Die laat zien waar je huidige vindbaarheid lekt en welke pagina&apos;s slimmer kunnen worden opgebouwd. Combineer dat met Agent-Ready, Google Score en de ChatGPT Check, dan zie je niet alleen hoe je site eruitziet, maar ook hoe zoekmachines en AI-assistenten hem lezen.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/seo-geo-scan"
                    className="rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(144.9_80.4%_10%)] hover:text-white"
                  >
                    Vraag de SEO/GEO scan aan
                  </Link>
                  <Link
                    href="/agent-ready"
                    className="rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(144.9_80.4%_10%)] hover:text-white"
                  >
                    Check Agent-Ready
                  </Link>
                  <Link
                    href="/google-score"
                    className="rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(144.9_80.4%_10%)] hover:text-white"
                  >
                    Vergelijk je Google Score
                  </Link>
                  <Link
                    href="/chatgpt-check"
                    className="rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(144.9_80.4%_10%)] hover:text-white"
                  >
                    Doe de ChatGPT Check
                  </Link>
                </div>
              </div>
            </SectionCard>
            <SectionCard
              id="in-detail"
              title="In detail"
              description="Technische uitleg voor wie meer wil weten en wat te vertellen wil hebben bij het koffieautomaat."
              Icon={MagnifyingGlassIcon}
            >
              <div className="space-y-5 text-lg leading-relaxed text-gray-700">
                <p>
                  Ik bouw nieuwe websites standaard met Next.js. Niet omdat het hip klinkt, maar omdat het in de praktijk snel, stabiel en toekomstbestendig is. Pagina&apos;s laden strak, content kan netjes worden voorbereid voor Google en AI-crawlers, en je zit niet vast aan de beperkingen van een kant-en-klaar thema.
                </p>
                <p>
                  WordPress kan prima zijn voor een simpele site, maar bij maatwerk betaal je vaak dubbel: eerst voor een duur thema, daarna voor plugins, onderhoud, updates en fixes wanneer alles elkaar in de weg zit. Met Next.js bouw je lichter. Minder ballast, minder pluginstress en meer controle over snelheid, techniek, design en groei.
                </p>
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Snelle pagina’s met moderne rendering en minder overbodige code.",
                    "Meer vrijheid in design zonder vast te zitten aan thema-blokken.",
                    "Beter voorbereid op SEO, GEO en AI-lezers door schone structuur.",
                    "Lagere onderhoudsdruk dan een WordPress-site vol betaalde plugins.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border-[3px] bg-[hsl(140.6_84.2%_92.5%)] p-4 text-base font-semibold text-[hsl(144.9_80.4%_10%)]"
                      style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </TimelineContent>

        <div className="h-24 md:h-40" />
      </div>
      <StickyFooter />
    </div>
  );
}
