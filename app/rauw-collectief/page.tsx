"use client"

import {
  Layers,
  Recycle,
  Users,
  Wrench,
  MapPin,
} from "lucide-react";

import { BentoCard, BentoGrid } from "./components/bento-grid";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { Accordion05, FAQItem } from "./components/accordion-05";

const faqItems: FAQItem[] = [
  {
    id: "1",
    title: "Wat doet Code Lieshout voor Rauw Collectief?",
    content: "Code Lieshout onderzoekt hoe AI automatisering ingezet kan worden om de werkprocessen bij Rauw Collectief slimmer en efficiënter te maken — van offertes tot klantcommunicatie.",
  },
  {
    id: "2",
    title: "Wat is Rauw Collectief?",
    content: "Rauw Collectief is een werkplaats in Oss voor vakmanschap, waar meubelmakers en makers in opleiding samenwerken aan duurzame, op maat gemaakte interieurs en meubels. Ze bieden ruimte aan jonge talenten en mensen die willen groeien in het vak.",
  },
  {
    id: "3",
    title: "Wat maakt Rauw Collectief bijzonder?",
    content: "Het unieke aan Rauw Collectief is de combinatie van vakmanschap en sociaal ondernemen. Ervaren makers en jonge talenten werken zij aan zij — met focus op duurzaamheid, kwaliteit en het overdragen van ambacht. Elk meubelstuk vertelt een verhaal.",
  },
  {
    id: "4",
    title: "Welke producten en diensten levert Rauw Collectief?",
    content: "Rauw Collectief maakt maatwerk meubels (tafels, kasten, balies), verzorgt projectinrichting voor thuis, kantoor en horeca, en biedt complete Turn-Key verbouwingen aan — van idee tot oplevering, volledig ontzorgd.",
  },
  {
    id: "5",
    title: "Waar is Rauw Collectief gevestigd?",
    content: "Rauw Collectief is gevestigd aan de Spoorlaan 64A, 5348KC Oss. Een werkplaats die uitnodigt om langs te komen en te zien hoe ambacht tot leven komt.",
  },
];

const features = [
  {
    Icon: Wrench,
    name: "Maatwerk meubels",
    description: "Uniek ontworpen en duurzaam gemaakt — van tafel tot complete interieuroplossing.",
    href: "#maatwerk",
    cta: "Bekijk projecten",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(143.8 61.2% 20.2%)",
  },
  {
    Icon: Users,
    name: "Sociaal vakmanschap",
    description: "Ervaren makers en jonge talenten werken zij aan zij in de werkplaats.",
    href: "#team",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: Recycle,
    name: "Duurzame productie",
    description: "De juiste materialen, met oog voor de toekomst.",
    href: "#duurzaamheid",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(142.4 71.8% 29.2%)",
  },
  {
    Icon: Layers,
    name: "Turn-Key verbouwingen",
    description: "Van idee tot oplevering — volledig ontzorgd van A tot Z.",
    href: "#turn-key",
    cta: "",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "col-span-2 lg:col-start-1 lg:col-end-3 lg:row-start-4 lg:row-end-5",
    hoverColor: "hsl(142.8 64.2% 24.1%)",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "3px solid hsl(144.9 80.4% 10%)",
  borderRadius: "12px",
  padding: "2rem",
};

export default function RauwCollectiefPage() {
  return (
    <main className="min-h-screen" style={{ background: "hsl(138.5 76.5% 96.7%)" }}>
      <StickyHeader
        title="RAUW COLLECTIEF"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
      />

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Hero */}
        <div style={cardStyle}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🪵</span>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>
                  Klantcase — Ambacht &amp; Vakmanschap
                </p>
                <h1 className="text-5xl font-sans font-normal uppercase tracking-tight" style={{ color: "hsl(144.9 80.4% 10%)" }}>
                  Rauw Collectief
                </h1>
              </div>
            </div>

            <p className="text-lg leading-relaxed" style={{ color: "hsl(143.8 61.2% 20.2%)" }}>
              Rauw Collectief is een werkplaats voor vakmanschap in Oss — waar meubelmakers en
              makers in opleiding samenwerken aan duurzame, op maat gemaakte interieurs en meubels.
              Met oog voor detail, duurzaamheid en een praktische aanpak creëren ze functionele
              producten met karakter.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Maatwerk meubels", "Projectinrichting", "Turn-Key verbouwingen", "Sociaal ondernemen", "Opleidingspartner"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm font-semibold rounded-full border-2"
                  style={{ borderColor: "hsl(144.9 80.4% 10%)", color: "hsl(144.9 80.4% 10%)", background: "hsl(140.6 84.2% 92.5%)" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "hsl(142.1 70.6% 45.3%)" }}>
              <MapPin size={14} />
              <span>Spoorlaan 64A, Oss &middot; <a href="https://rauwcollectief.nl" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>rauwcollectief.nl</a></span>
            </div>
          </div>
        </div>

        {/* BentoGrid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-sans font-normal uppercase tracking-wider" style={{ color: "hsl(144.9 80.4% 10%)" }}>
            Wat maakt Rauw bijzonder?
          </h2>
          <BentoGrid className="auto-rows-[12rem]">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>

        {/* Code Lieshout sectie */}
        <div style={cardStyle}>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌵</span>
              <h2 className="text-2xl font-sans font-normal uppercase tracking-wider" style={{ color: "hsl(144.9 80.4% 10%)" }}>
                Hoe helpt Code Lieshout?
              </h2>
            </div>
            <p style={{ color: "hsl(143.8 61.2% 20.2%)", lineHeight: "1.8" }}>
              Een meubelmakerij heeft geen tijd om bezig te zijn met administratie, offertes
              uittypen of klantopvolging. Code Lieshout onderzoekt samen met Rauw Collectief
              welke taken slim geautomatiseerd kunnen worden — zodat de makers kunnen doen waar
              ze goed in zijn: bouwen.
            </p>
            <ul className="space-y-3">
              {[
                "Automatische offerte- en factuurgeneratie",
                "AI-assistentie voor klantcommunicatie",
                "Slimme administratie zonder handmatig werk",
                "Inzicht in projectplanning en doorlooptijden",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3" style={{ color: "hsl(143.8 61.2% 20.2%)" }}>
                  <span className="mt-1 text-xs font-bold" style={{ color: "hsl(142.1 76.2% 36.3%)" }}>→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-sans font-normal uppercase tracking-wider" style={{ color: "hsl(144.9 80.4% 10%)" }}>
            Veelgestelde vragen
          </h2>
          <Accordion05 items={faqItems} />
        </div>

        {/* CTA */}
        <div style={{ ...cardStyle, background: "hsl(144.9 80.4% 10%)", borderColor: "hsl(144.9 80.4% 10%)" }}>
          <div className="text-center space-y-4 py-4">
            <p className="text-lg font-medium" style={{ color: "hsl(138.5 76.5% 96.7%)" }}>
              Benieuwd wat AI kan betekenen voor jouw ambachtsbedrijf?
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 font-sans font-normal uppercase tracking-widest text-sm border-2 rounded-none transition-all"
              style={{ background: "hsl(142.1 76.2% 36.3%)", color: "#ffffff", borderColor: "hsl(141 78.9% 85.1%)" }}
            >
              Neem contact op
            </a>
          </div>
        </div>

      </div>

      <StickyFooter />
    </main>
  );
}
