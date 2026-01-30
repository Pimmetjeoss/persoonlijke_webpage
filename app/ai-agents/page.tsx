"use client"

import { useRef } from "react";
import {
  FileTextIcon,
  LayersIcon,
  LightningBoltIcon,
  PersonIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "./components/bento-grid";
import { SectionCard } from "./components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { Accordion05, FAQItem } from "./components/accordion-05";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";

const faqItems: FAQItem[] = [
  {
    id: "1",
    title: "Wat is een AI Agent?",
    content: "Een AI Agent is een autonoom systeem dat zelfstandig taken kan uitvoeren, beslissingen kan nemen en kan leren van interacties. Anders dan een chatbot, kan een agent meerdere stappen plannen en uitvoeren zonder tussenkomst.",
  },
  {
    id: "2",
    title: "Wat is het verschil tussen een chatbot en een AI Agent?",
    content: "Een chatbot reageert op directe vragen en voert enkelvoudige taken uit. Een AI Agent kan complexe, meerstaps-taken autonoom afhandelen, tools gebruiken, en beslissingen nemen op basis van context en doelen.",
  },
  {
    id: "3",
    title: "Welke taken kan een AI Agent uitvoeren?",
    content: "AI Agents kunnen onder andere: e-mails beheren en beantwoorden, agenda's plannen, data analyseren en rapporten maken, code schrijven en debuggen, onderzoek doen op het web, en workflows automatiseren.",
  },
  {
    id: "4",
    title: "Is een AI Agent veilig voor mijn bedrijf?",
    content: "Ja, mits goed geconfigureerd. AI Agents kunnen worden ingesteld met strikte permissies, audit logs, en menselijke goedkeuring voor kritieke acties. Privacy en beveiliging zijn ingebouwd.",
  },
  {
    id: "5",
    title: "Hoe lang duurt het om een AI Agent te implementeren?",
    content: "Een basis AI Agent kan binnen enkele dagen operationeel zijn. Complexere implementaties met integraties en custom workflows duren typisch 2-4 weken.",
  },
  {
    id: "6",
    title: "Kan een AI Agent met mijn bestaande tools werken?",
    content: "Ja! AI Agents kunnen integreren met populaire tools zoals Google Workspace, Microsoft 365, Slack, Notion, CRM-systemen, en vele anderen via API's.",
  },
  {
    id: "7",
    title: "Wat kost een AI Agent?",
    content: "Kosten variëren op basis van complexiteit en gebruik. Neem contact op voor een vrijblijvende offerte afgestemd op jouw situatie.",
  },
  {
    id: "8",
    title: "Kan ik een AI Agent eerst uitproberen?",
    content: "Absoluut! We bieden demo's en pilot-projecten aan zodat je de mogelijkheden kunt ervaren voordat je een volledige implementatie doet.",
  },
];

const features = [
  {
    Icon: PersonIcon,
    name: "Simpel uitgelegd",
    description: "Wat zijn AI Agents en waarom zijn ze revolutionair?",
    href: "#simpel-uitgelegd",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Veelgestelde vragen over AI Agents beantwoord.",
    href: "#faq",
    cta: "Bekijk vragen",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: VideoIcon,
    name: "Demo's & Video's",
    description: "Zie AI Agents in actie!",
    href: "#demos",
    cta: "Bekijk demo's",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LayersIcon,
    name: "Integraties",
    description: "Combineer met je bestaande tools en workflows.",
    href: "#integraties",
    cta: "Bekijk integraties",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: LightningBoltIcon,
    name: "Technisch",
    description: "Onder de motorkap: hoe AI Agents werken.",
    href: "#technisch",
    cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

export default function AIAgentsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="AI-AGENTS"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141.9 69.2% 58%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <TimelineContent
          animationNum={1}
          timelineRef={pageRef}
          once={true}
        >
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </TimelineContent>

        {/* Sectie Cards */}
        <TimelineContent
          animationNum={2}
          timelineRef={pageRef}
          once={true}
        >
          <div className="mt-16 space-y-8">
            <SectionCard
              id="simpel-uitgelegd"
              title="Simpel uitgelegd"
              description="Een AI Agent is als een digitale medewerker die zelfstandig taken uitvoert. Stel je voor: je geeft een opdracht en de agent plant, onderzoekt, en voert uit — zonder dat jij elke stap hoeft te begeleiden. Van e-mails beantwoorden tot complexe data-analyses, AI Agents nemen het werk uit handen."
              Icon={PersonIcon}
            />
            <SectionCard
              id="faq"
              title="Veelgestelde vragen"
              description="Alles wat je wilt weten over AI Agents."
              Icon={FileTextIcon}
            >
              <Accordion05 items={faqItems} />
            </SectionCard>
            <SectionCard
              id="demos"
              title="Demo's & Video's"
              description="Bekijk hoe AI Agents in de praktijk werken. Van eenvoudige automatiseringen tot complexe multi-step workflows."
              Icon={VideoIcon}
            />
            <SectionCard
              id="integraties"
              title="Integraties"
              description="AI Agents werken naadloos samen met je bestaande tools: Google Workspace, Microsoft 365, Slack, Notion, CRM-systemen, databases, en meer. Geen complete systeemvervanging nodig — agents passen zich aan jouw workflow aan."
              Icon={LayersIcon}
            />
            <SectionCard
              id="technisch"
              title="Technisch"
              description="Onder de motorkap gebruiken AI Agents Large Language Models (LLMs) gecombineerd met tool-gebruik, planning-algoritmes, en memory-systemen. Ze kunnen redeneren over problemen, tools aanroepen (API's, databases, bestanden), en hun aanpak aanpassen op basis van feedback. Modern agent-frameworks zoals LangChain, AutoGPT, en custom oplossingen maken dit mogelijk."
              Icon={LightningBoltIcon}
            />
          </div>
        </TimelineContent>

        {/* Spacer voor footer */}
        <div className="h-32" />
      </div>
      <StickyFooter />
    </div>
  );
}
