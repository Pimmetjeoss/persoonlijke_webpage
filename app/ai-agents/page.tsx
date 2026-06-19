"use client"

import React, { useRef, useState } from "react";
import { Plus } from "lucide-react";

import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";

interface AgentItem {
  id: string;
  name: string;
  kicker: string;
  description: string;
  highlights: string[];
}

const agentItems: AgentItem[] = [
  {
    id: "shopify-agent",
    name: "SHOPIFY AGENT",
    kicker: "Webshop bouwen, verbeteren en automatiseren",
    description:
      "Een gespecialiseerde agent voor Shopify-webshops: van custom secties en productpagina's tot conversieverbetering, content en technische checks.",
    highlights: ["Shopify-thema's en storefront UX", "Productdata, collecties en SEO-copy", "Conversiechecks en checkout-frictie"],
  },
  {
    id: "seo-agent",
    name: "SEO AGENT",
    kicker: "Vindbaarheid als doorlopend systeem",
    description:
      "Controleert technische SEO, contentkansen, Search Console-data en concurrentiesignalen, zodat optimalisatie geen losse maandelijkse taak blijft.",
    highlights: ["Technische audits en prioriteiten", "Contentkansen uit zoekdata", "Rapportage zonder spreadsheet-chaos"],
  },
  {
    id: "dataset-agent",
    name: "DATASET AGENT",
    kicker: "Rommelige exports naar bruikbare inzichten",
    description:
      "Leest CSV's, productfeeds en databestanden, ontdekt kolomproblemen en zet ruwe data om naar beslissingen, mappings of dashboards.",
    highlights: ["CSV- en feed-validatie", "Datamapping en opschoning", "Concrete fouten terug naar bronregels"],
  },
  {
    id: "google-workspace-agent",
    name: "GOOGLE WORKSPACE AGENT",
    kicker: "Docs, Drive, Gmail en agenda in één workflow",
    description:
      "Helpt met documenten, e-mail, planning en Drive-structuur. Ideaal voor teams die al in Google Workspace werken maar minder handwerk willen.",
    highlights: ["Documenten en samenvattingen", "Agenda- en mailflows", "Drive-structuur en procesbewaking"],
  },
  {
    id: "second-brain-agent",
    name: "SECOND BRAIN AGENT",
    kicker: "Kennis vastleggen zonder dat het stoffig wordt",
    description:
      "Bouwt en onderhoudt een persoonlijke kennisbank: bronnen verwerken, notities structureren, verbanden leggen en kwaliteit bewaken.",
    highlights: ["Obsidian/wiki-ingest", "Bronnen samenvatten en labelen", "QA op structuur en vindbaarheid"],
  },
  {
    id: "linkedin-agent",
    name: "LINKEDIN AGENT",
    kicker: "Consistente zichtbaarheid zonder generieke posts",
    description:
      "Ondersteunt bij ideeën, drafts, hergebruik van content en publicatieplanning met behoud van je eigen toon en scherpe mening.",
    highlights: ["Postideeën uit echte projecten", "Drafts in jouw stem", "Contentplanning en hergebruik"],
  },
  {
    id: "cli-agent",
    name: "CLI AGENT",
    kicker: "Terminalwerk met context en veiligheidsrails",
    description:
      "Een agent voor commandline-taken: inspecteren, scripts draaien, services checken en technische problemen oplossen met echte output als bewijs.",
    highlights: ["Server- en servicechecks", "Scripts, logs en builds", "Veilig werken zonder secrets te lekken"],
  },
  {
    id: "website-builder-agent",
    name: "WEBSITE BUILDER AGENT",
    kicker: "Custom websites met eigen smoel",
    description:
      "Ontwerpt, bouwt, test en publiceert websites met een duidelijke visuele identiteit — geen standaard template met een AI-sausje.",
    highlights: ["Design-first websitebouw", "Next.js, Vercel en GitHub workflow", "Browser-QA en visuele polish"],
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
        url: `https://code-lieshout.nl/ai-agents#${item.id}`,
      })),
    },
  ],
};

export default function AIAgentsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

      <main className="pt-[42vh]">
        <div className="relative z-10">
          {agentItems.map((agent, index) => {
            const isHovered = hoveredIndex === index;
            const isOpen = openIndex === index;
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
                    aria-expanded={isOpen}
                    aria-controls={`${agent.id}-content`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="group w-full rounded-none border-t-[3px] border-black text-left transition-all duration-300 ease-out hover:-translate-y-6 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                    style={{ backgroundColor: rowColor }}
                  >
                    <div className="px-4 pb-2 pt-4 md:px-8 lg:px-16">
                      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-end gap-4 md:gap-8">
                        <div className="min-w-0">
                          <p
                            className="mb-2 max-w-3xl text-sm font-bold uppercase tracking-[0.28em] md:text-base"
                            style={{ color: textColor }}
                          >
                            {agent.kicker}
                          </p>
                          <h1
                            className="text-[clamp(3.8rem,8.8vw,8.5rem)] font-bold leading-[0.82] tracking-tight"
                            style={{ color: textColor, marginBottom: "-0.22em" }}
                          >
                            {agent.name}
                          </h1>
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
                </section>
              </TimelineContent>
            );
          })}

          <div className="h-[3px] w-full bg-black" />
        </div>

        <div className="h-32" />
      </main>

      <StickyFooter />
    </div>
  );
}
