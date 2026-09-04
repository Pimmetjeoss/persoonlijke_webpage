"use client"

import Image from "next/image";
import React, { useRef, useState } from "react";
import { Plus } from "lucide-react";

import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";
import { useTransition } from "@/app/components/transition_provider";

interface AgentItem {
  id: string;
  name: string;
  kicker: string;
  description: string;
  highlights: string[];
  href?: string;
}

const agentItems: AgentItem[] = [
  {
    id: "shopify-agent",
    name: "SHOPIFY AGENT",
    kicker: "Webshop bouwen, verbeteren en automatiseren",
    description:
      "Een gespecialiseerde agent voor Shopify-webshops: van custom secties en productpagina's tot conversieverbetering, content en technische checks.",
    highlights: ["Shopify-thema's en storefront UX", "Productdata, collecties en SEO-copy", "Conversiechecks en checkout-frictie"],
    href: "/ai-agents/shopify-agent",
  },
  {
    id: "seo-agent",
    name: "SEO AGENT",
    kicker: "Vindbaarheid als doorlopend systeem",
    description:
      "Controleert technische SEO, contentkansen, Search Console-data en concurrentiesignalen, zodat optimalisatie geen losse maandelijkse taak blijft.",
    highlights: ["Technische audits en prioriteiten", "Contentkansen uit zoekdata", "Rapportage zonder spreadsheet-chaos"],
    href: "/ai-agents/seo-agent",
  },
  {
    id: "bol-com-agent",
    name: "BOL.COM AGENT",
    kicker: "Marketplace-groei zonder catalogusgedoe",
    description:
      "Helpt met bol.com assortiment, productcontent, prijs- en voorraadchecks, feedproblemen en commerciële optimalisaties voor verkopers die grip willen op hun kanaal.",
    highlights: ["Productcontent en attributen", "Voorraad, prijs en feed-controle", "Marketplace-SEO en conversiekansen"],
    href: "/ai-agents/bol-com-agent",
  },
  {
    id: "dataset-agent",
    name: "DATASET AGENT",
    kicker: "Rommelige exports naar bruikbare inzichten",
    description:
      "Leest CSV's, productfeeds en databestanden, ontdekt kolomproblemen en zet ruwe data om naar beslissingen, mappings of dashboards.",
    highlights: ["CSV- en feed-validatie", "Datamapping en opschoning", "Concrete fouten terug naar bronregels"],
    href: "/ai-agents/dataset-agent",
  },
  {
    id: "google-workspace-agent",
    name: "GOOGLE WORKSPACE AGENT",
    kicker: "Docs, Drive, Gmail en agenda in één workflow",
    description:
      "Helpt met documenten, e-mail, planning en Drive-structuur. Ideaal voor teams die al in Google Workspace werken maar minder handwerk willen.",
    highlights: ["Documenten en samenvattingen", "Agenda- en mailflows", "Drive-structuur en procesbewaking"],
    href: "/ai-agents/google-workspace-agent",
  },
  {
    id: "second-brain-agent",
    name: "SECOND BRAIN AGENT",
    kicker: "Kennis vastleggen zonder dat het stoffig wordt",
    description:
      "Bouwt en onderhoudt een persoonlijke kennisbank: bronnen verwerken, notities structureren, verbanden leggen en kwaliteit bewaken.",
    highlights: ["Obsidian/wiki-ingest", "Bronnen samenvatten en labelen", "QA op structuur en vindbaarheid"],
    href: "/ai-agents/second-brain-agent",
  },
  {
    id: "lead-agent",
    name: "LEAD AGENT",
    kicker: "Leads vinden zonder generieke outreach",
    description:
      "Ondersteunt bij leadlijsten, invalshoeken, opvolging en content die aansluit op echte gesprekken in plaats van koude standaardberichten.",
    highlights: ["Leadideeën uit echte projecten", "Outreach in jouw stem", "Opvolging en contentplanning"],
    href: "/ai-agents/lead-agent",
  },
  {
    id: "cli-agent",
    name: "CLI AGENT",
    kicker: "Terminalwerk met context en veiligheidsrails",
    description:
      "Een agent voor commandline-taken: inspecteren, scripts draaien, services checken en technische problemen oplossen met echte output als bewijs.",
    highlights: ["Server- en servicechecks", "Scripts, logs en builds", "Veilig werken zonder secrets te lekken"],
    href: "/ai-agents/cli-agent",
  },
  {
    id: "website-builder-agent",
    name: "WEBSITE BUILDER AGENT",
    kicker: "Custom websites met eigen smoel",
    description:
      "Ontwerpt, bouwt, test en publiceert websites met een duidelijke visuele identiteit — geen standaard template met een AI-sausje.",
    highlights: ["Design-first websitebouw", "Next.js, Vercel en GitHub workflow", "Browser-QA en visuele polish"],
    href: "/ai-agents/website-builder-agent",
  },
];

const hoverColors = [
  "hsl(141.9 69.2% 58%)",
  "hsl(143.8 61.2% 20.2%)",
  "hsl(141 78.9% 85.1%)",
  "hsl(142.4 71.8% 29.2%)",
  "hsl(141.7 76.6% 73.1%)",
  "hsl(144.9 80.4% 10%)",
  "hsl(142.1 76.2% 36.3%)",
  "hsl(142.1 70.6% 45.3%)",
  "hsl(140.6 84.2% 92.5%)",
];

const darkIndices = [1, 3, 5, 6, 7];

const getTextColor = (index: number, isHovered: boolean) => {
  if (isHovered && darkIndices.includes(index)) {
    return "hsl(138.5 76.5% 96.7%)";
  }

  return "hsl(144.9 80.4% 10%)";
};

const aiAgentsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://code-lieshout.nl" },
        { "@type": "ListItem", position: 2, name: "AI Agents", item: "https://code-lieshout.nl/ai-agents" },
      ],
    },
    {
      "@type": "ItemList",
      name: "AI Agents van Code Lieshout",
      itemListElement: agentItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
        url: item.href ? `https://code-lieshout.nl${item.href}` : `https://code-lieshout.nl/ai-agents#${item.id}`,
      })),
    },
  ],
};

export default function AIAgentsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { startTransition } = useTransition();

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiAgentsSchema) }}
      />

      <StickyHeader
        title="AI-AGENTS"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141.9 69.2% 58%)"
        startExpanded={true}
      />

      <main>
        {/* Antwoordblok (C3): zelfstandig citeerbaar, direct antwoord eerst */}
        <section
          aria-label="In het kort"
          className="mx-auto max-w-5xl px-6 lg:px-10 pt-10"
        >
          <div
            className="rounded-xl border-[3px] bg-white p-8 md:p-10"
            style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ color: "hsl(144.9 80.4% 10%)" }}
            >
              Wat is een AI-agent en wat kost het om er een te laten maken?
            </h2>
            <p
              className="text-lg leading-relaxed max-w-3xl"
              style={{ color: "hsl(143.8 61.2% 20.2%)" }}
            >
              Een AI-agent is een digitale medewerker die zelfstandig taken uitvoert:
              e-mails beantwoorden, planningen bijhouden, data analyseren of klanten
              te woord staan — 24/7, zonder dat je erbij hoeft te zijn. Code Lieshout
              bouwt zulke agents op maat voor MKB-bedrijven, vanaf €350 eenmalig met
              een vaste projectprijs vooraf. Elke agent wordt getraind op jouw data,
              jouw toon en jouw processen; geen generieke chatbot. Benieuwd of jouw
              website al klaar is voor dit soort techniek? Doe de{" "}
              <a className="underline font-semibold" style={{ color: "hsl(142.1 76.2% 36.3%)" }} href="/agent-ready">
                gratis agent-ready scan
              </a>{" "}
              of vraag via de{" "}
              <a className="underline font-semibold" style={{ color: "hsl(142.1 76.2% 36.3%)" }} href="/contact">
                contactpagina
              </a>{" "}
              een vrijblijvende demo aan.
            </p>
            <table className="mt-6 w-full max-w-3xl text-left text-base">
              <caption className="sr-only">Vergelijking AI-agent toepassingen</caption>
              <thead>
                <tr className="border-b-2" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
                  <th scope="col" className="py-2 pr-4">Toepassing</th>
                  <th scope="col" className="py-2 pr-4">Wat levert het op</th>
                  <th scope="col" className="py-2">Volgende stap</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: "hsl(141 78.9% 85.1%)" }}>
                  <td className="py-2 pr-4 font-semibold">Klantcontact-agent</td>
                  <td className="py-2 pr-4">Vragen beantwoorden, ook &apos;s nachts</td>
                  <td className="py-2"><a className="underline" href="/contact">Demo aanvragen</a></td>
                </tr>
                <tr className="border-b" style={{ borderColor: "hsl(141 78.9% 85.1%)" }}>
                  <td className="py-2 pr-4 font-semibold">Workflow-agent</td>
                  <td className="py-2 pr-4">Repeterend werk automatiseren</td>
                  <td className="py-2"><a className="underline" href="/contact">Demo aanvragen</a></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold">Website-check</td>
                  <td className="py-2 pr-4">Weten waar je staat in 10 seconden</td>
                  <td className="py-2"><a className="underline" href="/agent-ready">Gratis scan</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <div className="relative h-[50vh] overflow-visible">
          <Image
            src="/cactus_laptop_transparent.png"
            alt="Cactus mascotte"
            width={250}
            height={250}
            priority
            className="pointer-events-none absolute -bottom-[130px] right-[5%] z-0 w-[150px] md:right-[10%] md:w-[200px] lg:right-[15%] lg:w-[250px]"
          />
        </div>

        <div className="relative z-10">
          {agentItems.map((agent, index) => {
            const isHovered = hoveredIndex === index;
            const isLink = Boolean(agent.href);
            const isOpen = !isLink && openIndex === index;
            const textColor = getTextColor(index, isHovered);
            const rowColor = isHovered ? hoverColors[index] : "hsl(140.6 84.2% 92.5%)";

            return (
              <TimelineContent
                key={agent.id}
                animationNum={index + 1}
                timelineRef={pageRef}
                once={true}
              >
                <section
                  id={agent.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative w-full scroll-mt-32"
                  style={{ backgroundColor: rowColor }}
                >
                  <button
                    type="button"
                    aria-label={`${agent.name}: ${agent.kicker}`}
                    aria-expanded={isOpen}
                    aria-controls={isLink ? undefined : `${agent.id}-content`}
                    onClick={() => {
                      if (agent.href) {
                        startTransition(agent.href);
                        return;
                      }
                      setOpenIndex(isOpen ? null : index);
                    }}
                    className="group mb-0 w-full cursor-pointer overflow-hidden rounded-none border-t-[3px] border-black text-left transition-all duration-300 ease-out hover:-translate-y-6 hover:overflow-visible focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                    style={{ backgroundColor: rowColor }}
                  >
                    <div className="px-4 pb-2 pt-4 md:px-8 lg:px-16">
                      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-end gap-8">
                        <div className="min-w-0">
                          <p
                            className="mb-1 max-w-3xl text-xs font-bold uppercase tracking-[0.24em] md:text-sm"
                            style={{ color: textColor }}
                          >
                            {agent.kicker}
                          </p>
                          <h2
                            className="text-[clamp(2.4rem,14vw,4.5rem)] font-bold leading-[0.85] tracking-tight transition-all duration-300 md:whitespace-nowrap md:text-[clamp(4rem,6.7vw,8rem)]"
                            style={{ color: textColor, marginBottom: "-0.3em" }}
                          >
                            {agent.name}
                          </h2>
                        </div>

                        <div className="flex items-center justify-center pb-2">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                            style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)" }}
                          >
                            <Plus
                              className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                              strokeWidth={2.5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {!isLink && (
                    <div
                      id={`${agent.id}-content`}
                      className={`overflow-hidden border-black transition-[max-height,opacity] duration-500 ease-out ${
                        isOpen ? "max-h-96 border-t-[3px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                      style={{ backgroundColor: "hsl(138.5 76.5% 96.7%)" }}
                    >
                      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1.1fr_0.9fr] md:px-8 lg:px-16">
                        <p className="max-w-3xl text-lg leading-relaxed text-[hsl(144.9_80.4%_10%)] md:text-xl">
                          {agent.description}
                        </p>
                        <ul className="space-y-2 text-base font-semibold text-[hsl(144.9_80.4%_10%)] md:text-lg">
                          {agent.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-3">
                              <span aria-hidden="true">→</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </section>
              </TimelineContent>
            );
          })}

          <div className="h-[3px] w-full bg-black" />
        </div>

        <div className="h-12" />

        {/* Conversiepad (B4): scan + contact als logische vervolgstap */}
        <section aria-label="Volgende stap" className="mx-auto max-w-5xl px-6 lg:px-10 pb-4">
          <div
            className="rounded-xl p-8 md:p-10 text-center space-y-4"
            style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)", border: "3px solid black" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Klaar voor je eigen AI-agent?
            </h2>
            <p className="text-lg text-white/90 max-w-xl mx-auto">
              Check eerst gratis hoe klaar je site is — of plan direct een demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/agent-ready"
                className="inline-block px-8 py-3 bg-white font-sans text-lg rounded-xl transition-all hover:scale-105"
                style={{ color: "hsl(142.1 76.2% 36.3%)", border: "3px solid black" }}
              >
                GRATIS SCAN
              </a>
              <a
                href="/contact"
                className="inline-block px-8 py-3 font-sans text-lg rounded-xl text-white transition-all hover:scale-105"
                style={{ backgroundColor: "hsl(142.4 71.8% 29.2%)", border: "3px solid black" }}
              >
                DEMO AANVRAGEN
              </a>
            </div>
          </div>
        </section>
      </main>

      <StickyFooter />
    </div>
  );
}
