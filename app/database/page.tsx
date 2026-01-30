"use client"

import { useRef } from "react";
import {
  ChatBubbleIcon,
  DashboardIcon,
  FileTextIcon,
  LayersIcon,
  LightningBoltIcon,
  MagnifyingGlassIcon,
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
    title: "Wat is een MCP server?",
    content: "MCP (Model Context Protocol) is een standaard waarmee AI-modellen veilig kunnen communiceren met externe systemen zoals databases. Het fungeert als een brug tussen jouw data en de AI, zonder dat je data naar externe servers hoeft te sturen.",
  },
  {
    id: "2",
    title: "Is mijn data veilig?",
    content: "Ja. De AI draait lokaal of binnen jouw infrastructuur. Je data verlaat nooit je eigen systemen. De MCP server zorgt voor gecontroleerde toegang — de AI kan alleen lezen wat jij toestaat.",
  },
  {
    id: "3",
    title: "Welke databases worden ondersteund?",
    content: "Vrijwel alle gangbare databases: PostgreSQL, MySQL, SQL Server, MongoDB, SQLite, en meer. Ook koppelingen met Google Sheets, Excel bestanden, en API's zijn mogelijk.",
  },
  {
    id: "4",
    title: "Moet ik kunnen programmeren?",
    content: "Nee! Dat is juist de kracht. Je stelt vragen in gewoon Nederlands: 'Hoeveel omzet hadden we vorige maand?' of 'Welke klanten hebben al 3 maanden niet besteld?' De AI vertaalt dit naar de juiste database queries.",
  },
  {
    id: "5",
    title: "Hoe snel krijg ik antwoord?",
    content: "Binnen seconden. De AI analyseert je vraag, schrijft de query, voert deze uit, en formuleert een begrijpelijk antwoord. Complexe analyses die normaal uren kosten, zijn nu een gesprek.",
  },
  {
    id: "6",
    title: "Kan de AI ook data aanpassen?",
    content: "Dat kan, maar alleen als je dit expliciet toestaat. Standaard is de toegang read-only voor veiligheid. Je bepaalt zelf welke acties de AI mag uitvoeren.",
  },
  {
    id: "7",
    title: "Wat kost dit?",
    content: "De setup is eenmalig. Daarna betaal je alleen voor het AI-gebruik (tokens). Voor de meeste MKB-bedrijven komt dit neer op enkele tientjes per maand — een fractie van wat een data-analist kost.",
  },
  {
    id: "8",
    title: "Hoe snel is dit opgezet?",
    content: "Een standaard koppeling is binnen een dag operationeel. Complexere setups met meerdere databronnen en custom dashboards duren 1-2 weken.",
  },
];

const features = [
  {
    Icon: ChatBubbleIcon,
    name: "Simpel uitgelegd",
    description: "AI die je database begrijpt — zonder technische kennis.",
    href: "#simpel-uitgelegd",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Veelgestelde vragen over AI + Database.",
    href: "#faq",
    cta: "Bekijk FAQ",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: VideoIcon,
    name: "Demo",
    description: "Zie het in actie!",
    href: "#visueel",
    cta: "Bekijk demo",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: LayersIcon,
    name: "Combineer met",
    description: "Past perfect bij andere AI-oplossingen.",
    href: "#stack",
    cta: "Bekijk opties",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "Technisch",
    description: "Hoe werkt het onder de motorkap?",
    href: "#in-detail",
    cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

export default function DatabasePage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="DATABASE"
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
              description="AI die je database begrijpt — zonder technische kennis."
              Icon={ChatBubbleIcon}
            >
              <div className="space-y-4 text-neutral-700">
                <p>
                  Stel je voor: je vraagt in gewoon Nederlands <em>"Hoeveel hebben we vorige maand verkocht?"</em> en krijgt direct antwoord. Geen Excel, geen IT-afdeling, geen wachten. Gewoon vragen en weten.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">💬 Praten met je data</h4>
                    <p className="text-sm">Stel vragen zoals je ze aan een collega zou stellen. De AI snapt wat je bedoelt.</p>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">📊 Dashboards op verzoek</h4>
                    <p className="text-sm">Vraag om een grafiek of overzicht en de AI maakt het voor je.</p>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">🚨 Slimme alerts</h4>
                    <p className="text-sm">De AI ziet patronen en waarschuwt als er iets afwijkt.</p>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">✏️ Data aanpassen</h4>
                    <p className="text-sm">Ook invoeren en wijzigen kan — met jouw goedkeuring.</p>
                  </div>
                </div>

                <p className="mt-4 text-sm italic">
                  Alles veilig binnen je eigen systemen. Je data gaat nergens naartoe.
                </p>
              </div>
            </SectionCard>

            <SectionCard
              id="faq"
              title="Veelgestelde vragen"
              description="Alles wat je wilt weten over AI + Database."
              Icon={FileTextIcon}
            >
              <Accordion05 items={faqItems} />
            </SectionCard>

            <SectionCard
              id="visueel"
              title="Demo"
              description="Zie hoe het werkt in de praktijk."
              Icon={VideoIcon}
            >
              <div className="space-y-6 text-neutral-700">
                <p>Bekijk hoe een AI-agent in actie werkt met een echte database:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/KR92VAS8r18"
                      title="Interactief dashboard"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/FSadQhfawrE"
                      title="Diepere analyse"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/p7s_amHn91o"
                      title="Diepe analyse"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/lkpMPynYnP8"
                      title="Database opzoeken"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                  <div className="p-2 bg-neutral-100 rounded-lg font-medium">📊 Interactief dashboard</div>
                  <div className="p-2 bg-neutral-100 rounded-lg font-medium">🔍 Diepere analyse</div>
                  <div className="p-2 bg-neutral-100 rounded-lg font-medium">📈 Diepe analyse</div>
                  <div className="p-2 bg-neutral-100 rounded-lg font-medium">🗄️ Database opzoeken</div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id="stack"
              title="Combineer met"
              description="Database-AI past perfect bij andere oplossingen."
              Icon={LayersIcon}
            >
              <div className="space-y-4 text-neutral-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">📧 CRM</h4>
                    <p className="text-sm">Koppel je CRM-database en vraag: "Welke leads moeten we deze week opvolgen?"</p>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">📊 Power BI</h4>
                    <p className="text-sm">Laat de AI Power BI dashboards aansturen en verklaren.</p>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">📑 Excel</h4>
                    <p className="text-sm">Importeer Excel-data en stel vragen alsof het een database is.</p>
                  </div>
                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <h4 className="font-semibold mb-2">🤖 Sir Prikkel</h4>
                    <p className="text-sm">Laat je persoonlijke AI-assistent direct antwoorden uit je bedrijfsdata halen.</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id="in-detail"
              title="Technisch: hoe werkt het?"
              description="Voor de nieuwsgierigen die het willen begrijpen."
              Icon={MagnifyingGlassIcon}
            >
              <div className="space-y-6 text-neutral-700">
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🔧 MCP Server</h4>
                  <p>MCP (Model Context Protocol) is een open standaard van Anthropic. Een MCP server draait binnen jouw netwerk en biedt een veilige interface waarmee AI-modellen gecontroleerd toegang krijgen tot je database. De AI stuurt een vraag, de MCP server vertaalt dit naar een query, voert uit, en stuurt het resultaat terug.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>🔒 Beveiliging</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Data blijft binnen je eigen infrastructuur</li>
                    <li>Read-only toegang standaard</li>
                    <li>Role-based access control</li>
                    <li>Query logging en audit trails</li>
                    <li>Rate limiting tegen misbruik</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>⚡ Architectuur</h4>
                  <p>De flow: Gebruiker → AI Model → MCP Server → Database → MCP Server → AI Model → Antwoord. De AI ziet alleen wat de MCP server toestaat. Je kunt specifieke tabellen, kolommen, of zelfs rijen filteren.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>📦 Ondersteunde databases</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {["PostgreSQL", "MySQL", "SQL Server", "MongoDB", "SQLite", "Oracle", "BigQuery", "Snowflake"].map((db) => (
                      <div
                        key={db}
                        className="p-2 text-center text-sm rounded-lg border-2"
                        style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
                      >
                        {db}
                      </div>
                    ))}
                  </div>
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
