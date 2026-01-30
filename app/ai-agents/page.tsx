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
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Veelgestelde vragen over AI Agents beantwoord.",
    href: "#faq",
    cta: "Bekijk vragen",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: VideoIcon,
    name: "Demo's & Video's",
    description: "Zie AI Agents in actie!",
    href: "#demos",
    cta: "Bekijk demo's",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LayersIcon,
    name: "Integraties",
    description: "Combineer met je bestaande tools en workflows.",
    href: "#integraties",
    cta: "Bekijk integraties",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: LightningBoltIcon,
    name: "Technisch",
    description: "Onder de motorkap: hoe AI Agents werken.",
    href: "#technisch",
    cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
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
              description="Wat is een AI Agent en waarom is het een gamechanger voor je bedrijf?"
              Icon={PersonIcon}
            >
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🤖 Wat is een AI Agent?</h4>
                  <p>Stel je voor: een digitale medewerker die 24/7 beschikbaar is, nooit moe wordt, en zelfstandig taken uitvoert. Dat is een AI Agent. Anders dan een simpele chatbot die alleen antwoord geeft op vragen, kan een agent <strong>denken, plannen, en handelen</strong>.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>💡 Een voorbeeld uit de praktijk</h4>
                  <p>Je zegt: <em>"Plan een meeting met het salesteam volgende week, stuur een agenda, en bereid een presentatie voor over Q4 resultaten."</em></p>
                  <p className="mt-2">Een gewone assistent zou vragen: "Welke dag? Welk tijdstip? Wie precies?" Een AI Agent:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Checkt automatisch ieders agenda voor beschikbaarheid</li>
                    <li>Kiest het beste moment en stuurt uitnodigingen</li>
                    <li>Haalt Q4 data op uit je systemen</li>
                    <li>Maakt een concept-presentatie</li>
                    <li>Stuurt je een samenvatting ter goedkeuring</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>⚡ Chatbot vs. AI Agent</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="p-4 bg-neutral-100 rounded-lg">
                      <p className="font-semibold mb-2">Chatbot</p>
                      <ul className="text-sm space-y-1">
                        <li>• Beantwoordt vragen</li>
                        <li>• Eén stap tegelijk</li>
                        <li>• Wacht op instructies</li>
                        <li>• Beperkte context</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: "hsl(141 78.9% 85.1%)" }}>
                      <p className="font-semibold mb-2">AI Agent</p>
                      <ul className="text-sm space-y-1">
                        <li>• Voert taken uit</li>
                        <li>• Plant meerdere stappen</li>
                        <li>• Neemt initiatief</li>
                        <li>• Onthoudt en leert</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🎯 Wat kunnen AI Agents voor jou doen?</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>E-mail & Communicatie:</strong> Inbox beheren, belangrijke mails flaggen, concept-antwoorden schrijven</li>
                    <li><strong>Agenda & Planning:</strong> Meetings inplannen, conflicten oplossen, herinneringen sturen</li>
                    <li><strong>Data & Rapportages:</strong> Gegevens verzamelen, analyseren, en rapporten genereren</li>
                    <li><strong>Klantcontact:</strong> Vragen beantwoorden, tickets afhandelen, follow-ups sturen</li>
                    <li><strong>Onderzoek:</strong> Informatie verzamelen, samenvatten, en presenteren</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🚀 Waarom nu?</h4>
                  <p>AI Agents zijn geen toekomstmuziek meer. Door recente doorbraken in AI-technologie zijn ze nu betrouwbaar, betaalbaar, en praktisch inzetbaar. Bedrijven die nu instappen, bouwen een voorsprong op die moeilijk in te halen is.</p>
                </div>
              </div>
            </SectionCard>
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
              description="Een diepere blik op de architectuur en werking van AI Agents."
              Icon={LightningBoltIcon}
            >
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🧠 Large Language Models (LLMs)</h4>
                  <p>De kern van elke AI Agent is een Large Language Model — zoals GPT-4, Claude, of Gemini. Deze modellen begrijpen natuurlijke taal, kunnen redeneren over complexe problemen, en genereren menselijke output. Ze vormen het "brein" van de agent.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🔧 Tool Use & Function Calling</h4>
                  <p>AI Agents kunnen externe tools aanroepen: API's, databases, bestandssystemen, browsers, en meer. Via "function calling" beschrijft het model welke actie het wil uitvoeren, en een orchestrator voert deze daadwerkelijk uit. Zo kan een agent e-mails versturen, agenda's beheren, of data opvragen.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>📋 Planning & Reasoning</h4>
                  <p>Complexe taken vereisen planning. Agents gebruiken technieken zoals Chain-of-Thought (stap-voor-stap redeneren), ReAct (Reasoning + Acting), en Tree-of-Thoughts voor besluitvorming. Ze kunnen taken opdelen in subtaken, prioriteren, en hun aanpak aanpassen als iets niet werkt.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>💾 Memory Systems</h4>
                  <p>Agents hebben verschillende vormen van geheugen:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li><strong>Short-term:</strong> Context binnen een conversatie</li>
                    <li><strong>Long-term:</strong> Opgeslagen kennis over gebruikers, voorkeuren, en eerdere interacties</li>
                    <li><strong>Episodic:</strong> Herinneringen aan specifieke gebeurtenissen</li>
                    <li><strong>Semantic:</strong> Gestructureerde kennis en feiten</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🔄 Agent Loops</h4>
                  <p>De typische agent-loop: <strong>Observe → Think → Act → Observe</strong>. De agent observeert de huidige situatie, redeneert over de volgende stap, voert een actie uit, en evalueert het resultaat. Deze cyclus herhaalt tot het doel bereikt is of een limiet bereikt wordt.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🏗️ Frameworks & Architecturen</h4>
                  <p>Populaire frameworks voor het bouwen van agents:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li><strong>LangChain / LangGraph:</strong> Modulaire chains en graph-based workflows</li>
                    <li><strong>AutoGPT / BabyAGI:</strong> Autonome task-decomposition agents</li>
                    <li><strong>CrewAI:</strong> Multi-agent systemen met rollen en samenwerking</li>
                    <li><strong>Custom:</strong> Op maat gemaakte oplossingen voor specifieke use-cases</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🛡️ Safety & Guardrails</h4>
                  <p>Productie-agents hebben veiligheidslagen: input validation, output filtering, rate limiting, human-in-the-loop voor kritieke acties, audit logging, en sandboxing. Dit voorkomt ongewenst gedrag en beschermt gevoelige data.</p>
                </div>
              </div>
            </SectionCard>
          </div>
        </TimelineContent>

        {/* Spacer voor footer */}
        <div className="h-32" />
      </div>
      <StickyFooter />
    </div>
  );
}
