import type { Metadata } from "next";

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wat doet Code Lieshout precies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Code Lieshout bouwt slimme web-applicaties en AI-oplossingen voor bedrijven. Van autonome AI agents die zelfstandig taken uitvoeren, tot moderne websites en automatiseringen die je werkprocessen versnellen. Pim van Lieshout combineert technische expertise met een scherp gevoel voor wat echt werkt."
      }
    },
    {
      "@type": "Question",
      "name": "Voor wie is Code Lieshout geschikt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Voor ondernemers, MKB-bedrijven en teams die slimmer willen werken met AI — zonder dat je zelf technisch hoeft te zijn. Of je nu een website wil laten bouwen, een repetitief proces wil automatiseren, of een eigen AI-assistent wil: we zorgen dat het werkt."
      }
    },
    {
      "@type": "Question",
      "name": "Werk je ook samen met andere bureaus of developers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja, absoluut. Code Lieshout werkt regelmatig samen met andere bureaus, designers en developers. Heb je een team en zoek je iemand die de AI- of webdevelopment-kant oppakt? Neem gerust contact op."
      }
    },
    {
      "@type": "Question",
      "name": "Wat is een AI agent?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Een AI agent is een slim programma dat zelfstandig taken uitvoert — zonder dat jij er continu bij hoeft te zijn. Denk aan een agent die e-mails beantwoordt, data analyseert, rapportages maakt of leads opvolgt. De agent werkt 24/7 en leert van de context die jij meegeeft."
      }
    },
    {
      "@type": "Question",
      "name": "Kan ik een eigen ChatGPT-achtige assistent laten bouwen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja. Code Lieshout bouwt op maat gemaakte AI-assistenten die werken met jouw data, jouw toon en jouw processen. Geen generieke chatbot, maar een assistent die écht past bij jouw organisatie."
      }
    },
    {
      "@type": "Question",
      "name": "Hoe lang duurt het om een AI-oplossing te bouwen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dat hangt af van de complexiteit. Een eenvoudige automatisering of chatbot kan binnen een week live zijn. Een uitgebreid AI-agent systeem kost meer tijd en afstemming. We beginnen altijd met een kort intakegesprek om de scope helder te maken."
      }
    },
    {
      "@type": "Question",
      "name": "Mijn proces is uniek — kan AI dat aan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vrijwel altijd wel. AI-oplossingen worden volledig op maat gebouwd. We beginnen met het begrijpen van jouw proces, daarna bouwen we iets dat precies aansluit — geen kant-en-klare tool met halvegare compromissen."
      }
    },
    {
      "@type": "Question",
      "name": "Wat kost het om met Code Lieshout te werken?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dat verschilt per project. We werken met vaste projectprijzen zodat je vooraf weet waar je aan toe bent — geen verrassingen achteraf. Neem contact op voor een vrijblijvende inschatting."
      }
    },
    {
      "@type": "Question",
      "name": "Hoe neem ik contact op?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Via de contactpagina op deze site. Vul het formulier in en Pim reageert doorgaans binnen één werkdag."
      }
    },
    {
      "@type": "Question",
      "name": "Lever je ook onderhoud en support na oplevering?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja. Na oplevering is er altijd de mogelijkheid voor doorlopend onderhoud en support. We bespreken dit vooraf zodat je nooit met een 'af'-product blijft zitten dat je vervolgens zelf moet onderhouden."
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "FAQ — Veelgestelde Vragen over AI Agents & Web Development",
  description:
    "Antwoorden op de meest gestelde vragen over Code Lieshout, AI-agents, kosten, samenwerking en support. Geen verkooppraat — gewoon eerlijke antwoorden.",
  alternates: {
    canonical: "https://code-lieshout.nl/FAQ",
  },
  openGraph: {
    title: "FAQ — Veelgestelde Vragen | Code Lieshout",
    description:
      "Antwoorden op vragen over AI-agents, kosten, samenwerking en support. Eerlijk en concreet.",
    url: "https://code-lieshout.nl/FAQ",
    type: "website",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      {children}
    </>
  );
}
