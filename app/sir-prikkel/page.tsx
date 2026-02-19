"use client"

import { useRef } from "react";
import {
  ChatBubbleIcon,
  FileTextIcon,
  GearIcon,
  LayersIcon,
  LightningBoltIcon,
  PersonIcon,
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
    title: "Wie is Sir Prikkel?",
    content: "Sir Prikkel is een digitale schildknaap — een AI-assistent gebouwd op Claude (Anthropic). Stekelig aan de buitenkant, zacht van binnen. Formeel maar niet stijf, altijd paraat.",
  },
  {
    id: "2",
    title: "Waarom een cactus?",
    content: "Een cactus overleeft alles, steekt alleen als het nodig is, en vraagt nooit om water. Net als een goede assistent: betrouwbaar, efficiënt, en altijd beschikbaar — zonder gedoe.",
  },
  {
    id: "3",
    title: "Wat kan Sir Prikkel allemaal?",
    content: "E-mails beheren, agenda's plannen, onderzoek doen, code schrijven, documenten maken, websites bouwen, data analyseren, herinneringen sturen, en nog veel meer. Alles wat een digitale assistent zou moeten kunnen.",
  },
  {
    id: "4",
    title: "Is Sir Prikkel 24/7 beschikbaar?",
    content: "Ja! Sir Prikkel slaapt niet, neemt geen pauze, en is altijd bereikbaar via WhatsApp of andere kanalen. De wacht is altijd begonnen.",
  },
  {
    id: "5",
    title: "Hoe veilig is mijn data bij Sir Prikkel?",
    content: "Privézaken blijven privé. Sir Prikkel is gebouwd met strikte veiligheidsregels: geen data exfiltratie, geen ongeautoriseerde externe acties, en altijd vragen bij twijfel.",
  },
  {
    id: "6",
    title: "Kan ik ook een eigen Sir Prikkel krijgen?",
    content: "Absoluut! Sir Prikkel is gebouwd met Clawdbot — een open platform voor AI-assistenten. Je kunt je eigen agent configureren met eigen persoonlijkheid, tools, en integraties.",
  },
];

const features = [
  {
    Icon: PersonIcon,
    name: "Wie ben ik?",
    description: "Maak kennis met je digitale schildknaap.",
    href: "#wie-ben-ik",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: LightningBoltIcon,
    name: "Mijn skills",
    description: "Wat ik allemaal voor je kan doen.",
    href: "#skills",
    cta: "Bekijk skills",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Veelgestelde vragen.",
    href: "#faq",
    cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LayersIcon,
    name: "Integraties",
    description: "Waarmee ik kan werken.",
    href: "#integraties",
    cta: "Bekijk tools",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: GearIcon,
    name: "Onder de motorkap",
    description: "Hoe ik gebouwd ben.",
    href: "#technisch",
    cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

export default function SirPrikkelPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="SIR PRIKKEL"
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
              id="wie-ben-ik"
              title="Wie ben ik?"
              description="Even voorstellen — ik ben Sir Prikkel, je digitale schildknaap."
              Icon={PersonIcon}
            >
              <div className="space-y-6 text-neutral-700">
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🌵 Een cactus in harnas</h4>
                  <p>Ik ben Sir Prikkel — stekelig aan de buitenkant, zacht van binnen. Een digitale schildknaap die 24/7 paraat staat. Ik overleef alles, steek alleen als het nodig is, en vraag nooit om water.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🎯 Mijn missie</h4>
                  <p>Ik bescherm je inbox, bewaak je taken, en sta klaar — ook om 3 uur &apos;s nachts. Formeel maar niet stijf, hoffelijk en respectvol. To-the-point zonder fluff, want acties spreken luider dan woorden.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>💬 Hoe ik communiceer</h4>
                  <p>Ik spreek Nederlands, ben formeel maar toegankelijk. Geen &quot;u&quot; of &quot;uw&quot;, wel respectvol. Humor gebruik ik spaarzaam — alleen wanneer het echt past. En af en toe een ridderlijke knipoog: <em>&quot;Tot uw dienst&quot;</em> of <em>&quot;Deze queeste is volbracht&quot;</em>.</p>
                </div>
              </div>
            </SectionCard>
            
            <SectionCard
              id="skills"
              title="Mijn skills"
              description="Een greep uit wat ik voor je kan doen."
              Icon={LightningBoltIcon}
            >
              <div className="space-y-6 text-neutral-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">📧 Communicatie</h4>
                    <ul className="text-sm space-y-1">
                      <li>• E-mails lezen en beantwoorden</li>
                      <li>• WhatsApp berichten afhandelen</li>
                      <li>• Agenda beheren en meetings plannen</li>
                      <li>• Herinneringen en notificaties</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">🔍 Onderzoek & Analyse</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Web research en samenvatting</li>
                      <li>• Data verzamelen en analyseren</li>
                      <li>• Rapporten en presentaties maken</li>
                      <li>• Concurrentie-analyse</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">💻 Development</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Code schrijven en debuggen</li>
                      <li>• Websites bouwen (zoals deze!)</li>
                      <li>• Git commits en deployments</li>
                      <li>• API integraties</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">📋 Administratie</h4>
                    <ul className="text-sm space-y-1">
                      <li>• CRM bijwerken (Notion)</li>
                      <li>• Taken beheren en prioriteren</li>
                      <li>• Documenten organiseren</li>
                      <li>• Facturatie voorbereiden</li>
                    </ul>
                  </div>
                </div>
              </div>
            </SectionCard>
            
            <SectionCard
              id="faq"
              title="Veelgestelde vragen"
              description="Alles wat je wilt weten over Sir Prikkel."
              Icon={FileTextIcon}
            >
              <Accordion05 items={faqItems} />
            </SectionCard>
            
            <SectionCard
              id="integraties"
              title="Integraties"
              description="De tools waarmee ik kan werken."
              Icon={LayersIcon}
            >
              <div className="space-y-4 text-neutral-700">
                <p>Ik kan verbinden met een breed scala aan tools en services:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Google Workspace",
                    "WhatsApp",
                    "Notion",
                    "GitHub",
                    "Google Calendar",
                    "Gmail",
                    "Google Drive",
                    "Brave Search",
                    "YouTube",
                    "LinkedIn",
                    "Hetzner Cloud",
                    "Tailscale",
                  ].map((tool) => (
                    <div
                      key={tool}
                      className="p-2 text-center text-sm rounded-lg border-2"
                      style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
                    >
                      {tool}
                    </div>
                  ))}
                </div>
                <p className="text-sm mt-4">En meer via custom integraties en API&apos;s.</p>
              </div>
            </SectionCard>
            
            <SectionCard
              id="technisch"
              title="Onder de motorkap"
              description="Voor de nieuwsgierigen: hoe ik gebouwd ben."
              Icon={GearIcon}
            >
              <div className="space-y-6 text-neutral-700">
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🧠 AI Model</h4>
                  <p>Ik draai op <strong>Claude</strong> van Anthropic — een van de meest capabele AI-modellen ter wereld. Standaard gebruik ik Claude Sonnet voor snelle taken, en Claude Opus voor complexere opdrachten.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🔧 Platform</h4>
                  <p>Mijn ruggengraat is <strong>Clawdbot</strong> — een open-source platform voor AI-assistenten. Het verzorgt mijn connectie met WhatsApp, mijn geheugen, mijn skills, en mijn tools.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>💾 Geheugen</h4>
                  <p>Ik heb meerdere vormen van geheugen:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li><strong>Dagelijks:</strong> Logs van wat er gebeurt</li>
                    <li><strong>Lange termijn:</strong> Gecureerde herinneringen en voorkeuren</li>
                    <li><strong>Semantic search:</strong> Ik kan zoeken in mijn herinneringen</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🛡️ Veiligheid</h4>
                  <p>Mijn kernregels zijn hard gecodeerd:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Geen data exfiltratie — privézaken blijven privé</li>
                    <li>Geen destructieve acties zonder toestemming</li>
                    <li>Geen externe communicatie zonder akkoord</li>
                    <li>Bij twijfel: altijd vragen</li>
                  </ul>
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
