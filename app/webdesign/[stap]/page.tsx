import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { AwardInteractions, AwardMotionLayer } from "../components/award-motion";

const steps = [
  {
    slug: "verkenning",
    title: "Verkenning",
    number: "1",
    cactus: "/webdesign/mascots/verkenning.png",
    video: "/webdesign/videos/verkenning.mp4",
    poster: "/webdesign/posters/verkenning.jpg",
    theme: "mint",
    videoAlign: "right",
    intro:
      "Een website begint met scherp krijgen wat er moet gebeuren. Wat moet iemand voelen, begrijpen of doen? Als dat helder is, wordt de rest veel makkelijker. Dan bouwen we niet op smaak alleen, maar op richting.",
    quote:
      "Eerst luisteren. Dan pas tekenen.",
    paragraphs: [
      "We brengen de belangrijkste perspectieven in kaart. Wie komt er op de site? Wat zoekt die persoon? Waar zit twijfel? Dat vertalen we naar concrete situaties, zodat de site straks logisch voelt voor de bezoeker.",
      "Voor de stijl maken we snel een duidelijke richting: kleur, typografie, sfeer en toegankelijkheid. Ook kijken we naar techniek en koppelingen. Alles wat belangrijk is leggen we vast, zodat we later niet hoeven te gokken.",
    ],
    cta: "De richting staat. Nu bouwen.",
    nextLabel: "Naar de realisatiefase",
    nextHref: "/webdesign/realisatie",
  },
  {
    slug: "realisatie",
    title: "Realisatie",
    number: "2",
    cactus: "/webdesign/mascots/realisatie.png",
    video: "/webdesign/videos/realisatie.mp4",
    poster: "/webdesign/posters/realisatie.jpg",
    theme: "gold",
    videoAlign: "left",
    intro:
      "In deze fase wordt het concreet. Ontwerp, techniek en inhoud komen samen in schermen die je kunt zien, testen en verbeteren.",
    paragraphs: [
      "We werken kort op elkaar. Design, front-end, back-end en QA lopen niet als losse eilandjes naast elkaar, maar schuiven steeds in elkaar. De belangrijkste onderdelen pakken we eerst op, zodat er snel iets staat waar je op kunt reageren.",
      "Feedback komt vroeg. In Figma, in overleg of in een testomgeving. Als iets nog onzeker is, maken we eerst een schets of proof of concept. Liever vroeg bijsturen dan laat repareren.",
      "Je blijft ondertussen dichtbij het werk. We bespreken voortgang, keuzes en blokkades gewoon helder. Moet er snel iets besloten worden, dan bellen we.",
    ],
    cta: "Het staat. Nu gaan we testen.",
    nextLabel: "Naar de test- en redactiefase",
    nextHref: "/webdesign/testen-en-redactie",
  },
  {
    slug: "testen-en-redactie",
    title: "Testen & redactie",
    number: "3",
    cactus: "/webdesign/mascots/testen-en-redactie.png",
    video: "/webdesign/videos/testen-en-redactie.mp4",
    poster: "/webdesign/posters/testen-en-redactie.jpg",
    theme: "coral",
    videoAlign: "stack",
    intro:
      "Nu halen we de rafels eruit. We testen, vullen, lezen terug en verbeteren totdat de site klopt in gebruik én in verhaal.",
    quote:
      "Een site wordt pas echt als het verhaal erin staat.",
    quoteAuthor: "Dorin Heijboer, Lead Project Manager",
    paragraphs: [
      "Content vullen moet geen worsteling zijn. Daarom werken we met duidelijke velden en een CMS dat je snapt. We houden tijdens de bouw al rekening met wat er aan tekst en beeld beschikbaar is, zodat de site niet méér vraagt dan je kunt leveren.",
      "Omdat we onderweg al feedback hebben opgehaald, gaat het hier vooral om de details. Tekst, beeld, formulieren, mobiele weergave, klikpaden. Loopt het vullen vast, dan pakken we eerst de pagina’s aan die echt nodig zijn voor livegang.",
    ],
    cta: "Klaar voor livegang.",
    nextLabel: "Naar de go-live",
    nextHref: "/webdesign/go-live",
  },
  {
    slug: "go-live",
    title: "Go-live",
    number: "4",
    cactus: "/webdesign/mascots/go-live.png",
    video: "/webdesign/videos/go-live.mp4",
    poster: "/webdesign/posters/go-live.jpg",
    theme: "blue",
    videoAlign: "wide",
    intro:
      "Live gaan is spannend, maar het hoeft geen chaos te zijn. We zetten vooraf klaar wat klaar moet staan en lopen de laatste checks stap voor stap na.",
    paragraphs: [
      "We werken met een draaiboek. Domein omzetten, redirects nalopen, analytics controleren, formulieren testen. Als er iets wringt, kunnen we meteen schakelen.",
      "Is de wijziging groot, dan kunnen we gefaseerd live. Bijvoorbeeld eerst voor een deel van je bezoekers of een specifieke regio. Is dat niet nodig, dan gaan we direct live.",
      "Na livegang kijken we mee of alles goed landt. Pas als de basis op groen staat, dragen we over naar onderhoud.",
    ],
    cta: "Live is pas het begin.",
    nextLabel: "Naar het onderhoud",
    nextHref: "/webdesign/onderhoud",
  },
  {
    slug: "onderhoud",
    title: "Onderhoud",
    number: "5",
    cactus: "/webdesign/mascots/onderhoud.png",
    video: "/webdesign/videos/onderhoud.mp4",
    poster: "/webdesign/posters/onderhoud.jpg",
    theme: "olive",
    videoAlign: "right",
    intro:
      "Na livegang moet de site gewoon blijven werken. Updates, kleine verbeteringen, vragen en technische controle horen daar bij.",
    bullets: [
      "Goede overdracht: wat is gebouwd, waarom is het zo gebouwd en waar moeten we op letten.",
      "Updates met beleid: eerst testen, daarna pas live aanpassen.",
      "Support zonder gedoe: vragen, kleine aanpassingen en technische signalen pakken we snel op.",
    ],
    quote:
      "Is het stuk, dan maken we het. Is het niet stuk, dan houden we het zo.",
    quoteAuthor: "Patrick Louter, Lead Maintenance & Support",
    paragraphs: [
      "Onderhoud is niet alleen brandjes blussen. Het is ook de plek waar je merkt wat beter kan en waar je kleine verbeteringen blijft doorvoeren.",
    ],
    cta: "Goed onderhoud houdt de site scherp.",
    nextLabel: "Naar de optimalisatiefase",
    nextHref: "/webdesign/optimalisatie",
  },
  {
    slug: "optimalisatie",
    title: "Optimalisatie",
    number: "6",
    cactus: "/webdesign/mascots/optimalisatie.png",
    video: "/webdesign/videos/optimalisatie.mp4",
    poster: "/webdesign/posters/optimalisatie.jpg",
    theme: "lime",
    videoAlign: "left",
    intro:
      "Na livegang begint het echte leren. Je ziet hoe bezoekers klikken, waar ze afhaken en welke onderdelen juist goed werken. Daar kun je gericht op verbeteren.",
    quote: "Live gaan is geen eindpunt. Het is meetpunt één.",
    paragraphs: [
      "Na livegang komen de echte signalen binnen. Bezoekers klikken, zoeken, twijfelen en haken soms af. We kijken naar data, maar ook naar feedback van echte gebruikers. Alles wat we leren verzamelen we op één lijst.",
      "Niet elk idee hoeft meteen gebouwd te worden. We kijken samen naar impact en inspanning. Kleine aanpassingen met veel effect pakken we snel op. Grotere ideeën plannen we bewust in.",
    ],
    secondQuote: "Ideeën genoeg. Nu kiezen wat echt iets oplevert.",
    closing:
      "Data helpt, maar cijfers vertellen niet alles. Daarom combineren we statistieken met gebruikerstests en gezond vakgevoel. Zo verbeteren we niet omdat het kan, maar omdat het ergens aan bijdraagt.",
    cta: "Van goed naar beter. Stap voor stap.",
    nextLabel: "Terug naar de werkwijze",
    nextHref: "/webdesign#werkwijze",
  },
];


const themeStyles = {
  mint: { panel: "bg-[hsl(144.9_80.4%_10%)]", text: "text-[hsl(140.6_84.2%_92.5%)]", soft: "text-[hsl(141_78.9%_85.1%)]", badge: "bg-[hsl(141_78.9%_85.1%)]" },
  gold: { panel: "bg-[#4b3a05]", text: "text-[#fff8dc]", soft: "text-[#f5d66b]", badge: "bg-[#f5d66b]" },
  coral: { panel: "bg-[#5b1515]", text: "text-[#fff0ec]", soft: "text-[#ffb7aa]", badge: "bg-[#ffb7aa]" },
  blue: { panel: "bg-[#073a4c]", text: "text-[#e7fbff]", soft: "text-[#9ee7ff]", badge: "bg-[#9ee7ff]" },
  olive: { panel: "bg-[#24370d]", text: "text-[#f1ffd7]", soft: "text-[#bfdc88]", badge: "bg-[#bfdc88]" },
  lime: { panel: "bg-[#123f17]", text: "text-[#efffe6]", soft: "text-[#b9f07b]", badge: "bg-[#b9f07b]" },
} as const;

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

  const theme = themeStyles[step.theme as keyof typeof themeStyles];
  const videoFirst = step.videoAlign === "left";
  const videoWide = step.videoAlign === "wide";
  const videoStack = step.videoAlign === "stack";

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

      <AwardInteractions />
      <main className="mx-auto max-w-5xl space-y-8 p-6 pb-32 lg:p-10 lg:pb-36">
        <section
          data-award-reveal
          data-award-hover
          data-award-tilt="true"
          className="relative overflow-hidden rounded-xl border-[3px] bg-white shadow-xl"
          style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
        >
          <AwardMotionLayer className="opacity-40" />
          <div data-award-target className="relative grid gap-8 p-8 md:grid-cols-[1fr_220px] md:p-12">
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

        <section data-award-reveal data-award-hover className={`overflow-hidden rounded-xl border-[3px] border-[hsl(144.9_80.4%_10%)] ${theme.panel} shadow-xl`}>
          <div className={`grid gap-0 ${videoWide || videoStack ? "lg:grid-cols-1" : "lg:grid-cols-[0.95fr_1.05fr]"}`}>
            <div className={`p-6 md:p-8 ${theme.text} ${videoFirst ? "lg:order-2" : ""}`}>
              <p className={`mb-3 text-sm font-bold uppercase tracking-[0.24em] ${theme.soft}`}>
                Video per fase · stap {step.number}
              </p>
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                {step.title} uitgelegd in 16 seconden.
              </h2>
              <p className={`mt-4 max-w-xl text-lg leading-relaxed ${theme.soft}`}>
                Geen losse mascotte-loop meer, maar een korte uitleg met concrete punten uit deze fase.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["richting", "keuzes", "resultaat"].map((label) => (
                  <span key={label} className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[hsl(144.9_80.4%_10%)] ${theme.badge}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className={`${videoFirst ? "lg:order-1" : ""} ${videoWide ? "border-t-[3px] border-[hsl(144.9_80.4%_10%)]" : ""}`}>
              <video
                className={`${videoWide ? "max-h-[520px]" : "h-full min-h-[300px]"} w-full bg-black object-cover`}
                controls
                muted
                playsInline
                preload="metadata"
                poster={step.poster}
              >
                <source src={step.video} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section data-award-reveal className="rounded-xl border-[3px] border-[hsl(144.9_80.4%_10%)] bg-white p-8 shadow-xl md:p-12">
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
              data-award-hover
              className="mt-5 inline-flex rounded-full bg-[hsl(141_78.9%_85.1%)] px-5 py-3 font-bold text-[hsl(144.9_80.4%_10%)] transition-transform hover:-translate-y-1 md:mt-0"
            >
              {step.nextLabel} →
            </Link>
          </div>
        </section>

        <Link
          href="/webdesign#werkwijze"
          data-award-hover
          className="mb-24 inline-flex rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] bg-[hsl(140.6_84.2%_92.5%)] px-5 py-3 font-semibold text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(141_78.9%_85.1%)]"
        >
          Terug naar overzicht
        </Link>
      </main>

      <StickyFooter />
    </div>
  );
}
