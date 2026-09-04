"use client"

import { useRef } from "react";
import {
  FileTextIcon,
  RocketIcon,
  PersonIcon,
  LightningBoltIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "./components/bento-grid";
import { SectionCard } from "./components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { Accordion05, FAQItem } from "./components/accordion-05";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";

const faqAlgemeen: FAQItem[] = [
  {
    id: "a1",
    title: "Wat doet Code Lieshout precies?",
    content: "Code Lieshout bouwt slimme web-applicaties en AI-oplossingen voor bedrijven. Van autonome AI agents die zelfstandig taken uitvoeren, tot moderne websites en automatiseringen die je werkprocessen versnellen. Pim van Lieshout combineert technische expertise met een scherp gevoel voor wat echt werkt.",
  },
  {
    id: "a2",
    title: "Voor wie is Code Lieshout geschikt?",
    content: "Voor ondernemers, MKB-bedrijven en teams die slimmer willen werken met AI — zonder dat je zelf technisch hoeft te zijn. Of je nu een website wil laten bouwen, een repetitief proces wil automatiseren, of een eigen AI-assistent wil: we zorgen dat het werkt.",
  },
  {
    id: "a3",
    title: "Werk je ook samen met andere bureaus of developers?",
    content: "Ja, absoluut. Code Lieshout werkt regelmatig samen met andere bureaus, designers en developers. Heb je een team en zoek je iemand die de AI- of webdevelopment-kant oppakt? Neem gerust contact op.",
  },
];

const faqAI: FAQItem[] = [
  {
    id: "b1",
    title: "Wat is een AI agent?",
    content: "Een AI agent is een slim programma dat zelfstandig taken uitvoert — zonder dat jij er continu bij hoeft te zijn. Denk aan een agent die e-mails beantwoordt, data analyseert, rapportages maakt of leads opvolgt. De agent werkt 24/7 en leert van de context die jij meegeeft.",
  },
  {
    id: "b2",
    title: "Kan ik een eigen ChatGPT-achtige assistent laten bouwen?",
    content: "Ja. Code Lieshout bouwt op maat gemaakte AI-assistenten die werken met jouw data, jouw toon en jouw processen. Geen generieke chatbot, maar een assistent die écht past bij jouw organisatie.",
  },
  {
    id: "b3",
    title: "Hoe lang duurt het om een AI-oplossing te bouwen?",
    content: "Dat hangt af van de complexiteit. Een eenvoudige automatisering of chatbot kan binnen een week live zijn. Een uitgebreid AI-agent systeem kost meer tijd en afstemming. We beginnen altijd met een kort intakegesprek om de scope helder te maken.",
  },
  {
    id: "b4",
    title: "Mijn proces is uniek — kan AI dat aan?",
    content: "Vrijwel altijd wel. AI-oplossingen worden volledig op maat gebouwd. We beginnen met het begrijpen van jouw proces, daarna bouwen we iets dat precies aansluit — geen kant-en-klare tool met halvegare compromissen.",
  },
];

const faqPraktisch: FAQItem[] = [
  {
    id: "c1",
    title: "Wat kost het om met Code Lieshout te werken?",
    content: "Dat verschilt per project. We werken met vaste projectprijzen zodat je vooraf weet waar je aan toe bent — geen verrassingen achteraf. Neem contact op voor een vrijblijvende inschatting.",
  },
  {
    id: "c2",
    title: "Hoe neem ik contact op?",
    content: "Via de contactpagina op deze site. Vul het formulier in en Pim reageert doorgaans binnen één werkdag.",
  },
  {
    id: "c3",
    title: "Lever je ook onderhoud en support na oplevering?",
    content: "Ja. Na oplevering is er altijd de mogelijkheid voor doorlopend onderhoud en support. We bespreken dit vooraf zodat je nooit met een 'af'-product blijft zitten dat je vervolgens zelf moet onderhouden.",
  },
];

const features = [
  {
    Icon: PersonIcon,
    name: "Algemeen",
    description: "Wie is Code Lieshout en wat kun je verwachten?",
    href: "#algemeen",
    cta: "Lees verder",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Antwoorden op de meest gestelde vragen.",
    href: "#algemeen",
    cta: "Stel je vraag!",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: LightningBoltIcon,
    name: "AI-oplossingen",
    description: "Alles over agents, automatisering en AI-assistenten.",
    href: "#ai",
    cta: "Bekijk mogelijkheden",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: RocketIcon,
    name: "Samenwerken",
    description: "Hoe werkt het in de praktijk?",
    href: "#praktisch",
    cta: "Direct aan de slag",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: QuestionMarkCircledIcon,
    name: "Praktisch",
    description: "Kosten, contact en support — geen verrassingen.",
    href: "#praktisch",
    cta: "Bekijk details",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

function FAQPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="FAQ"
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
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </TimelineContent>

        <TimelineContent
          animationNum={2}
          timelineRef={pageRef}
          once={true}
        >
          <div className="mt-16 space-y-8">
            <SectionCard
              id="algemeen"
              title="Algemeen"
              description="Wie is Code Lieshout en wat kun je verwachten?"
              Icon={PersonIcon}
            >
              <Accordion05 items={faqAlgemeen} />
            </SectionCard>

            <SectionCard
              id="ai"
              title="AI-oplossingen"
              description="Alles over agents, automatisering en AI-assistenten."
              Icon={LightningBoltIcon}
            >
              <Accordion05 items={faqAI} />
            </SectionCard>

            <SectionCard
              id="praktisch"
              title="Praktisch"
              description="Kosten, contact en support — geen verrassingen."
              Icon={QuestionMarkCircledIcon}
            >
              <Accordion05 items={faqPraktisch} />
            </SectionCard>
          </div>
        </TimelineContent>
      </div>
      <StickyFooter />
    </div>
  );
}

export default FAQPage;
