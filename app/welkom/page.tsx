"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  CheckCircledIcon,
  LaptopIcon,
  RocketIcon,
  GearIcon,
  MagnifyingGlassIcon,
  FileTextIcon,
  ChatBubbleIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/app/test/components/bento-grid";
import { SectionCard } from "@/app/test/components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { Accordion05, FAQItem } from "@/app/test/components/accordion-05";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";

/* ── Prijzen ───────────────────────────────────────── */

const pakketten = [
  {
    naam: "Website",
    prijs: "€250",
    periode: "eenmalig",
    beschrijving: "Professionele website op basis van jouw huidige site of wensen.",
    features: [
      "Volledig nieuw design",
      "Mobiel-vriendelijk (responsive)",
      "Basis SEO-optimalisatie",
      "Snelle laadtijd",
      "1 jaar hosting inbegrepen",
    ],
    accent: "hsl(142.1 76.2% 36.3%)",
  },
  {
    naam: "Website + Aanpassingen",
    prijs: "€350",
    periode: "eenmalig",
    beschrijving: "Alles van het basispakket, plus maatwerk naar jouw wensen.",
    features: [
      "Alles uit het Website pakket",
      "Extra pagina's of secties",
      "Aangepaste functionaliteit",
      "Eigen kleurenschema & stijl",
      "Prioriteit support bij oplevering",
    ],
    accent: "hsl(142.4 71.8% 29.2%)",
    popular: true,
  },
  {
    naam: "Onderhoud",
    prijs: "€10",
    periode: "per maand",
    beschrijving: "Zorgeloos online blijven met maandelijks onderhoud.",
    features: [
      "Hosting & uptime monitoring",
      "Kleine tekstuele aanpassingen",
      "Beveiligingsupdates",
      "Maandelijkse backup",
      "E-mail support",
    ],
    accent: "hsl(142.1 70.6% 45.3%)",
  },
  {
    naam: "Logo Pakket",
    prijs: "€50",
    periode: "eenmalig",
    beschrijving: "5 unieke logo-varianten voor jouw bedrijf.",
    features: [
      "5 professionele logo's",
      "Verschillende stijlen",
      "Hoge resolutie bestanden",
      "Geschikt voor web & print",
      "1 revisieronde",
    ],
    accent: "hsl(141.9 69.2% 58%)",
  },
];

/* ── FAQ ───────────────────────────────────────────── */

const faqItems: FAQItem[] = [
  {
    id: "1",
    title: "Hoe lang duurt het voordat mijn website klaar is?",
    content:
      "In de meeste gevallen is je nieuwe website binnen 1-3 werkdagen live. Bij het pakket met aanpassingen kan dit iets langer duren, afhankelijk van de complexiteit.",
  },
  {
    id: "2",
    title: "Moet ik zelf iets aanleveren?",
    content:
      "Nee, wij halen alle informatie op uit je huidige website, Google en openbare bronnen. Heb je specifieke wensen of materiaal? Dan verwerken we dat uiteraard graag.",
  },
  {
    id: "3",
    title: "Wat houdt de basis SEO-optimalisatie in?",
    content:
      "Je website wordt gebouwd met schone code, snelle laadtijden, correcte meta-tags en een mobiel-vriendelijk design. Dit zorgt ervoor dat Google je site goed kan indexeren. Voor uitgebreide SEO (keyword strategie, content optimalisatie, linkbuilding) bieden we aparte pakketten aan.",
  },
  {
    id: "4",
    title: "Kan ik later nog aanpassingen laten doen?",
    content:
      "Zeker. Met het onderhoudspakket (€10/maand) kun je kleine aanpassingen laten doorvoeren. Voor grotere wijzigingen maken we een maatwerkofferte.",
  },
  {
    id: "5",
    title: "Wat als ik niet tevreden ben?",
    content:
      "We werken pas aan de live-gang als jij tevreden bent. Je krijgt eerst een preview te zien en kunt feedback geven voordat de site online gaat.",
  },
  {
    id: "6",
    title: "Waar wordt mijn website gehost?",
    content:
      "We hosten op Vercel — een van de snelste en betrouwbaarste platformen ter wereld. Je site laadt razendsnel en is altijd bereikbaar.",
  },
  {
    id: "7",
    title: "Kan ik mijn eigen domeinnaam gebruiken?",
    content:
      "Absoluut. We koppelen je bestaande domeinnaam aan de nieuwe website. Heb je nog geen domein? Dan helpen we je er eentje te registreren.",
  },
  {
    id: "8",
    title: "Hoe werkt het onderhoudspakket?",
    content:
      "Voor €10 per maand zorgen wij dat je site online blijft, beveiligd is en up-to-date. Kleine tekstwijzigingen en updates zijn inbegrepen. Je hoeft nergens naar om te kijken.",
  },
];

/* ── BentoGrid features ────────────────────────────── */

const features = [
  {
    Icon: LaptopIcon,
    name: "Professioneel design",
    description: "Een moderne website die past bij jouw bedrijf. Geen templates — op maat gemaakt.",
    href: "#wat-je-krijgt",
    cta: "",
    background: <div />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: RocketIcon,
    name: "Snel live",
    description: "Binnen 1-3 werkdagen een werkende website. Geen maandenlange trajecten.",
    href: "#pakketten",
    cta: "Bekijk pakketten",
    background: <div />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: GearIcon,
    name: "Onderhoud geregeld",
    description: "Hosting, updates en kleine aanpassingen — wij regelen het.",
    href: "#pakketten",
    cta: "Meer info",
    background: <div />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: MagnifyingGlassIcon,
    name: "SEO-basis",
    description: "Gevonden worden in Google, direct vanaf dag één.",
    href: "#faq",
    cta: "Lees meer",
    background: <div />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: ChatBubbleIcon,
    name: "Persoonlijke aanpak",
    description: "Direct contact, korte lijnen. Geen ticketsystemen of wachtrijen.",
    href: "#contact",
    cta: "Neem contact op",
    background: <div />,
    className: "col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

/* ── Page ──────────────────────────────────────────── */

export default function WelkomPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="WELKOM"
        backgroundColor="hsl(142.1 76.2% 36.3%)"
        hoverColor="hsl(141.9 69.2% 58%)"
        startExpanded={true}
      />

      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        {/* ── Hero ──────────────────────────────────── */}
        <TimelineContent animationNum={0} timelineRef={pageRef} once={true}>
          <section className="flex flex-col lg:flex-row items-center gap-8 py-12 lg:py-20">
            <div className="flex-1 space-y-6">
              <h1
                className="text-5xl lg:text-7xl font-sans leading-tight"
                style={{ color: "hsl(144.9 80.4% 10%)" }}
              >
                JOUW NIEUWE WEBSITE IS KLAAR
              </h1>
              <p
                className="text-lg lg:text-xl max-w-xl"
                style={{ color: "hsl(143.8 61.2% 20.2%)" }}
              >
                Gefeliciteerd! Je nieuwe website is gebouwd en klaar om live te
                gaan. Op deze pagina lees je precies wat je hebt gekregen, wat de
                mogelijkheden zijn en hoe we verder gaan.
              </p>
              <a
                href="#pakketten"
                className="inline-block px-8 py-4 text-white font-sans text-lg rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: "hsl(142.1 76.2% 36.3%)",
                  border: "3px solid black",
                }}
              >
                BEKIJK DE PAKKETTEN
              </a>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/cactus_laptop_transparent.png"
                alt="Code Lieshout mascotte"
                width={280}
                height={280}
                className="drop-shadow-lg"
              />
            </div>
          </section>
        </TimelineContent>

        {/* ── BentoGrid: Wat je krijgt ─────────────── */}
        <TimelineContent animationNum={1} timelineRef={pageRef} once={true}>
          <section id="wat-je-krijgt" className="py-12">
            <h2
              className="text-4xl lg:text-5xl font-sans mb-8"
              style={{ color: "hsl(144.9 80.4% 10%)" }}
            >
              WAT ZIT ERIN?
            </h2>
            <BentoGrid className="lg:grid-rows-3">
              {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
              ))}
            </BentoGrid>
          </section>
        </TimelineContent>

        {/* ── Pakketten & Prijzen ──────────────────── */}
        <TimelineContent animationNum={2} timelineRef={pageRef} once={true}>
          <section id="pakketten" className="py-12">
            <h2
              className="text-4xl lg:text-5xl font-sans mb-4"
              style={{ color: "hsl(144.9 80.4% 10%)" }}
            >
              PAKKETTEN & PRIJZEN
            </h2>
            <p
              className="text-lg mb-10 max-w-2xl"
              style={{ color: "hsl(143.8 61.2% 20.2%)" }}
            >
              Transparante prijzen, geen verrassingen. Kies wat bij je past.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pakketten.map((pkg) => (
                <div
                  key={pkg.naam}
                  className="relative bg-white rounded-xl p-8 transition-all hover:scale-[1.02]"
                  style={{ border: "3px solid black" }}
                >
                  {pkg.popular && (
                    <span
                      className="absolute -top-3 right-6 px-4 py-1 text-white text-sm font-sans rounded-full"
                      style={{ backgroundColor: pkg.accent }}
                    >
                      POPULAIR
                    </span>
                  )}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-4xl font-sans"
                      style={{ color: pkg.accent }}
                    >
                      {pkg.prijs}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "hsl(143.8 61.2% 20.2%)" }}
                    >
                      {pkg.periode}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-sans mb-2"
                    style={{ color: "hsl(144.9 80.4% 10%)" }}
                  >
                    {pkg.naam}
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{ color: "hsl(142.8 64.2% 24.1%)" }}
                  >
                    {pkg.beschrijving}
                  </p>
                  <ul className="space-y-3">
                    {pkg.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm"
                        style={{ color: "hsl(143.8 61.2% 20.2%)" }}
                      >
                        <CheckCircledIcon
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: pkg.accent }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </TimelineContent>

        {/* ── Hoe werkt het? ──────────────────────── */}
        <TimelineContent animationNum={3} timelineRef={pageRef} once={true}>
          <section className="py-12">
            <SectionCard
              id="proces"
              title="Hoe werkt het?"
              description="Van eerste contact tot live website in 3 simpele stappen."
              Icon={StarIcon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[
                  {
                    stap: "01",
                    titel: "Kies je pakket",
                    tekst: "Laat ons weten welk pakket bij je past. We bespreken eventuele wensen en gaan direct aan de slag.",
                  },
                  {
                    stap: "02",
                    titel: "Preview & feedback",
                    tekst: "Je ontvangt een preview van je nieuwe website. Tevreden? Dan gaan we live. Aanpassingen nodig? Geen probleem.",
                  },
                  {
                    stap: "03",
                    titel: "Live!",
                    tekst: "Je website gaat online. Wij koppelen je domein en zorgen dat alles perfect draait. Klaar om klanten te ontvangen.",
                  },
                ].map((item) => (
                  <div key={item.stap} className="text-center space-y-3">
                    <span
                      className="text-5xl font-sans"
                      style={{ color: "hsl(142.1 76.2% 36.3%)" }}
                    >
                      {item.stap}
                    </span>
                    <h4
                      className="text-xl font-sans"
                      style={{ color: "hsl(144.9 80.4% 10%)" }}
                    >
                      {item.titel}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: "hsl(143.8 61.2% 20.2%)" }}
                    >
                      {item.tekst}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>
        </TimelineContent>

        {/* ── FAQ ─────────────────────────────────── */}
        <TimelineContent animationNum={4} timelineRef={pageRef} once={true}>
          <section id="faq" className="py-12">
            <SectionCard
              id="veelgestelde-vragen"
              title="Veelgestelde vragen"
              description="Alles wat je wilt weten over onze diensten."
              Icon={FileTextIcon}
            >
              <Accordion05 items={faqItems} />
            </SectionCard>
          </section>
        </TimelineContent>

        {/* ── CTA / Contact ──────────────────────── */}
        <TimelineContent animationNum={5} timelineRef={pageRef} once={true}>
          <section id="contact" className="py-12 pb-24">
            <div
              className="rounded-xl p-10 lg:p-16 text-center space-y-6"
              style={{
                backgroundColor: "hsl(142.1 76.2% 36.3%)",
                border: "3px solid black",
              }}
            >
              <h2 className="text-4xl lg:text-5xl font-sans text-white">
                KLAAR OM TE STARTEN?
              </h2>
              <p className="text-lg text-white/90 max-w-xl mx-auto">
                Neem contact op en we bespreken de mogelijkheden. Geen
                verplichtingen, geen kleine lettertjes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@code-lieshout.nl"
                  className="inline-block px-8 py-4 bg-white font-sans text-lg rounded-xl transition-all hover:scale-105"
                  style={{
                    color: "hsl(142.1 76.2% 36.3%)",
                    border: "3px solid black",
                  }}
                >
                  STUUR EEN MAIL
                </a>
                <a
                  href="https://wa.me/31612419980"
                  className="inline-block px-8 py-4 font-sans text-lg rounded-xl text-white transition-all hover:scale-105"
                  style={{
                    backgroundColor: "hsl(142.4 71.8% 29.2%)",
                    border: "3px solid black",
                  }}
                >
                  WHATSAPP
                </a>
              </div>
            </div>
          </section>
        </TimelineContent>
      </div>

      <StickyFooter />
    </div>
  );
}
