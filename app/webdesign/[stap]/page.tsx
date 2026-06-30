import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";

const steps = [
  {
    slug: "verkenning",
    title: "Verkenning",
    number: "1",
    cactus: "/webdesign/cactussen/verkenning.svg",
    intro:
      "Een website die echt iets losmaakt, valt of staat met een goed fundament. Niet improviseren, maar een helder vertrekpunt. Door vooraf scherp te krijgen waar jullie naartoe willen en waaróm, voorkomen we ruis, twijfel en dure omwegen later in het traject. Die helderheid zie je terug in het eindresultaat.",
    quote:
      "Goed ontwerp komt niet uit aannames, maar uit gesprekken. Daarom luisteren we eerst en tekenen we daarna.",
    paragraphs: [
      "We brengen eerst alle perspectieven in kaart. In interactieve sessies — vaak met een customer empathy map — vertalen we de behoefte van jullie klant naar concrete user stories: ‘Als [rol] wil ik [taak] zodat ik [doel] bereik.’ Zo bouwen we straks iets dat aansluit en converteert.",
      "Voor de uitstraling werken we met een compacte Style Tile: een snelle visuele richting voor de look-and-feel, die meteen rekening houdt met toegankelijkheid (WCAG), denk aan kleurcontrast en typografie. En onze specialisten brengen het volledige technische landschap in beeld, inclusief de rol van elke koppeling in de customer journey. De bevindingen en adviezen leggen we vast in een helder visiedocument. Dat scheelt verrassingen achteraf.",
    ],
    cta: "De koers ligt vast. Tijd om te bouwen.",
    nextLabel: "Naar de realisatiefase",
    nextHref: "/webdesign/realisatie",
  },
  {
    slug: "realisatie",
    title: "Realisatie",
    number: "2",
    cactus: "/webdesign/cactussen/realisatie.svg",
    intro:
      "In de realisatiefase gaan de mouwen omhoog. Onze multidisciplinaire teams bouwen samen met jou aan de oplossing die impact maakt.",
    paragraphs: [
      "Design, projectmanagement, front-end, back-end en QA werken gelijktijdig en dicht op elkaar — het liefst fysiek aan één tafel. Korte lijntjes, snel schakelen, uitdagingen meteen oplossen. We werken in sprints en pakken steeds de user stories met de hoogste prioriteit op. Die prioriteit bepaal jij mee als Product Owner; jouw beslissingen houden de vaart erin.",
      "Feedback halen we zo vroeg mogelijk op — via Figma, overleg of een testomgeving waarin je de feature echt kunt ervaren. Hoe eerder we bijsturen, hoe goedkoper. Bij onzekerheid zetten we wireframes of een proof-of-concept in, zodat je een feature al ziet vóór de volledige bouw.",
      "En je blijft altijd op de hoogte: via ons Asana-bord volg je de voortgang, en wekelijks bespreken we planning en afhankelijkheden met jou. Voor snelle knopen pakken we gewoon de telefoon.",
    ],
    cta: "We hebben het gebouwd. Nu mag jij het proberen te breken.",
    nextLabel: "Naar de test- en redactiefase",
    nextHref: "/webdesign/testen-en-redactie",
  },
  {
    slug: "testen-en-redactie",
    title: "Testen & redactie",
    number: "3",
    cactus: "/webdesign/cactussen/testen-en-redactie.svg",
    intro:
      "Nu zetten we de puntjes op de i. Niet alleen bouwen, maar ook testen, stuk proberen te krijgen en finetunen tot alles klopt.",
    quote:
      "Pas als je het verhaal gaat vertellen, komt je project echt tot leven.",
    quoteAuthor: "Dorin Heijboer, Lead Project Manager",
    paragraphs: [
      "Het vullen maken we je makkelijk: met standaardtemplates wordt content toevoegen een invuloefening, en je krijgt een training in het CMS zodat iedereen weet wat er moet gebeuren. We houden al in de realisatiefase rekening met de content die je beschikbaar hebt — bestaande teksten of beeld — en bouwen nooit een site die meer vraagt dan je kunt leveren. Omdat we in de verkenning al bepaalden welke pagina’s cruciaal zijn, ligt de focus meteen goed.",
      "Doordat we onderweg continu feedback ophaalden, zitten de grote hobbels er al uit. Deze fase draait dus om de details. Loopt het vullen vast door tijdgebrek? Dan helpen we je met de kritische pagina’s die we eerder al vaststelden.",
    ],
    cta: "Tijd voor champagne.",
    nextLabel: "Naar de go-live",
    nextHref: "/webdesign/go-live",
  },
  {
    slug: "go-live",
    title: "Go-live",
    number: "4",
    cactus: "/webdesign/cactussen/go-live.svg",
    intro:
      "De go-live is het moment waarop de nieuwe website live gaat. Spannend, dus zorgen we voor een soepele overgang met zo min mogelijk risico.",
    paragraphs: [
      "Een livegang kan interne processen raken; daar houden we al vanaf de verkenning rekening mee, bijvoorbeeld door kritieke workflows te behouden. We werken met een duidelijk draaiboek en zijn bij voorkeur fysiek aanwezig, zodat we direct kunnen schakelen: domeinen omzetten, redirects instellen, analytics configureren en essentiële zaken als formulieren opnieuw checken.",
      "Heeft een wijziging veel impact? Dan bespreken we een soft-launch — gefaseerd live, bijvoorbeeld per regio of voor specifieke gebruikers. Dat verlaagt het risico en geeft je organisatie rust om te wennen. Is dat risico er niet, dan is direct live vaak efficiënter.",
      "Na de livegang laten we je niet los. Ons projectteam blijft betrokken tot alles op groen staat — denk aan verwerking door zoekmachines en andere externe signalen — en pas dan dragen we over aan support en onderhoud.",
    ],
    cta: "Live gaan is het begin, niet het einde.",
    nextLabel: "Naar het onderhoud",
    nextHref: "/webdesign/onderhoud",
  },
  {
    slug: "onderhoud",
    title: "Onderhoud",
    number: "5",
    cactus: "/webdesign/cactussen/onderhoud.svg",
    intro:
      "Bij Level Level houdt het werk niet op na de livegang — dan begint juist een belangrijk nieuw hoofdstuk. We dragen het stokje zorgvuldig over van het project- naar het supportteam, zodat jij met een gerust hart verder kunt.",
    bullets: [
      "Overdracht op maat — Het projectteam geeft het supportteam een volledige briefing: van technische documentatie tot het nut en de noodzaak van de gebruikte functionaliteiten.",
      "Maandelijkse updates — Elke maand voeren we WordPress-core- en plugin-updates uit op een staging-omgeving, testen we grondig en nemen we na jouw akkoord de live site onder handen.",
      "Monitoring & support — We houden je site proactief in de gaten, lossen issues op voordat het problemen worden, en staan klaar voor vragen, kleine aanpassingen en optimalisaties.",
    ],
    quote:
      "Is het stuk, dan maken we het. En is het niet stuk, dan zorgen we dat het zo blijft.",
    quoteAuthor: "Patrick Louter, Lead Maintenance & Support",
    paragraphs: [
      "We onderhouden niet alleen — we willen blijven optimaliseren. Samen met jou. Want de lancering van een website is het startschot voor een succesvol digitaal product, niet de finish.",
    ],
    cta: "Blijven verbeteren is onderdeel van het product.",
    nextLabel: "Naar de optimalisatiefase",
    nextHref: "/webdesign/optimalisatie",
  },
  {
    slug: "optimalisatie",
    title: "Optimalisatie",
    number: "6",
    cactus: "/webdesign/cactussen/optimalisatie.svg",
    intro:
      "Voor veel mensen voelt de livegang als de finish. Voor ons is het juist het startsein. Een digitaal product is nooit echt ‘klaar’: het web verandert door, en de wensen van je gebruikers veranderen mee. Daarom is de fase ná de lancering misschien wel de belangrijkste — hier maken we van een goede site een geweldige.",
    quote: "Live gaan is niet de finish, maar het startschot.",
    paragraphs: [
      "Pas na de livegang begint het echte werk. Echte bezoekers navigeren, klikken en voeren taken uit, en dat levert een schat aan informatie op. We combineren kwantitatieve data over gebruikersgedrag met kwalitatieve feedback: welke features scoren, waar haken mensen af, en welke verbeteringen dragen ze zelf aan? Tegelijk levert de lancering vaak nieuwe inspiratie op — bij ons én bij jou ontstaan ideeën die voortbouwen op het fundament. Al die inzichten, feedback en ideeën komen samen op één gedeelde backlog.",
      "Een backlog vol goede ideeën is mooi, maar alles tegelijk doen kan niet. De kunst zit in de juiste keuzes. Daarom plotten we elk item samen op een prioriteitsmatrix langs twee assen: impact (hoeveel waarde levert het op voor gebruiker en business?) en effort (hoeveel tijd en middelen kost het?). Hoge impact en lage effort — de quick wins — pakken we vaak als eerste; complexe features met veel potentie plannen we zorgvuldig in.",
    ],
    secondQuote: "Aan ideeën geen gebrek. Samen bepalen we welke de moeite waard zijn.",
    closing:
      "Beslissingen baseren we zo veel mogelijk op feiten. Data is daarbij ons startpunt: in de statistieken valideren we hypotheses en sporen we kansen op. Maar cijfers vertellen niet alles. Daarom gaan we ook in gesprek met de gebruiker; via gebruikerstesten zien we hoe mensen je product écht ervaren en halen we onverbloemde feedback op. En tot slot vertrouwen we op onze eigen expertise en onderbuik — jarenlange ervaring geeft een scherp gevoel voor wat werkt en wat niet. Die combinatie van data, gebruikersinzicht en vakmanschap maakt onze keuzes weloverwogen en effectief.",
    cta: "Maak van een goede site een steeds betere site.",
    nextLabel: "Terug naar de werkwijze",
    nextHref: "/webdesign#werkwijze",
  },
];

export function generateStaticParams() {
  return steps.map((step) => ({ stap: step.slug }));
}

function QuoteBox({ quote, author }: { quote: string; author?: string }) {
  return (
    <blockquote className="my-8 rounded-xl border-[3px] border-[hsl(144.9_80.4%_10%)] bg-[hsl(141_78.9%_85.1%)] p-6 text-[hsl(144.9_80.4%_10%)] shadow-lg md:p-8">
      <p className="text-2xl font-bold leading-tight md:text-4xl">“{quote}”</p>
      {author ? <footer className="mt-4 text-sm font-semibold uppercase tracking-[0.18em]">— {author}</footer> : null}
    </blockquote>
  );
}

export default async function WebdesignStepPage({
  params,
}: {
  params: Promise<{ stap: string }>;
}) {
  const { stap } = await params;
  const step = steps.find((item) => item.slug === stap);

  if (!step) {
    notFound();
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title={step.title.toUpperCase()}
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <main className="mx-auto max-w-5xl space-y-8 p-6 lg:p-10">
        <section
          className="overflow-hidden rounded-xl border-[3px] bg-white shadow-xl"
          style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
        >
          <div className="grid gap-8 p-8 md:grid-cols-[1fr_220px] md:p-12">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[hsl(142.1_76.2%_36.3%)]">
                Webdesign werkwijze · stap {step.number}
              </p>
              <h1
                className="mb-6 text-5xl font-bold tracking-tight md:text-7xl"
                style={{ color: "hsl(144.9 80.4% 10%)" }}
              >
                {step.title}
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl">
                {step.intro}
              </p>
            </div>
            <div className="flex items-start justify-center md:justify-end">
              <div className="rounded-3xl border-[3px] border-[hsl(144.9_80.4%_10%)] bg-[hsl(140.6_84.2%_92.5%)] p-4 shadow-lg">
                <Image
                  src={step.cactus}
                  alt={`Cactus logo voor ${step.title}`}
                  width={184}
                  height={184}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border-[3px] border-[hsl(144.9_80.4%_10%)] bg-white p-8 shadow-xl md:p-12">
          {step.quote ? <QuoteBox quote={step.quote} author={step.quoteAuthor} /> : null}

          <div className="space-y-5 text-lg leading-relaxed text-gray-600 md:text-xl">
            {step.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {step.bullets ? (
            <div className="my-8 space-y-4">
              <p className="text-xl font-bold text-[hsl(144.9_80.4%_10%)]">Zo pakken we dat aan:</p>
              {step.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-xl border-2 border-[hsl(144.9_80.4%_10%)]/15 bg-[hsl(140.6_84.2%_92.5%)] p-5 text-lg leading-relaxed text-gray-700"
                >
                  {bullet}
                </div>
              ))}
            </div>
          ) : null}

          {step.secondQuote ? <QuoteBox quote={step.secondQuote} /> : null}

          {step.closing ? (
            <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
              {step.closing}
            </p>
          ) : null}

          <div className="mt-10 rounded-xl border-[3px] border-[hsl(144.9_80.4%_10%)] bg-[hsl(144.9_80.4%_10%)] p-6 text-white shadow-xl md:flex md:items-center md:justify-between md:gap-8">
            <p className="text-2xl font-bold leading-tight md:text-3xl">{step.cta}</p>
            <Link
              href={step.nextHref}
              className="mt-5 inline-flex rounded-full bg-[hsl(141_78.9%_85.1%)] px-5 py-3 font-bold text-[hsl(144.9_80.4%_10%)] transition-transform hover:-translate-y-1 md:mt-0"
            >
              {step.nextLabel} →
            </Link>
          </div>
        </section>

        <Link
          href="/webdesign#werkwijze"
          className="inline-flex rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] px-5 py-3 font-semibold text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(141_78.9%_85.1%)]"
        >
          Terug naar overzicht
        </Link>
      </main>

      <StickyFooter />
    </div>
  );
}
