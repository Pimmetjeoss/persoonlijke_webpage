/**
 * De projecten die op de papierrol geprint worden.
 *
 * Dit is het ENIGE bestand dat je hoeft aan te passen om de rol te vullen.
 * Elk project wordt procedureel op een canvas getekend (geen screenshots nodig),
 * dus je hebt alleen tekst + een accentkleur nodig. Voeg optioneel een
 * `image` toe (pad in /public) als je later wel een echte schermafbeelding wilt.
 *
 * Let op: het aantal projecten bepaalt de omtrek-verdeling van de rol. Elk
 * aantal werkt, maar 6-10 kaarten leest het prettigst.
 */

/** De visuele opzet van een kaart. Bepaalt hoe de kaart getekend wordt. */
export type ProjectLayout =
  | "hero" // groot kleurvlak met cirkel — sterke opener
  | "shot" // grote schermafbeelding bovenaan, titel eronder
  | "type" // typografische kaart, groot woordmerk
  | "grid" // raster van zes kleine studies
  | "device" // laptop/telefoon-mock op een gekleurde band
  | "quote" // rustige kaart met een klantcitaat
  | "closing" // donkere afsluiter

export interface Project {
  /** Stabiele id, ook gebruikt als React key. */
  id: string
  /** Klantnaam, wordt in hoofdletters getoond. */
  client: string
  /** Korte omschrijving van het project. */
  title: string
  /** Eén regel context: wat is er gebouwd. */
  description: string
  /** Jaartal of periode, klein weergegeven. */
  year: string
  /** Type werk, bijv. "WEBDESIGN" of "AI-AGENT". */
  discipline: string
  /** Accentkleur van de kaart (hex). Kies uit BRAND_ACCENTS hieronder. */
  accent: string
  /** Tekenopzet van de kaart. */
  layout: ProjectLayout
  /**
   * Waar de kaart naartoe linkt bij klikken.
   * Interne route (`/webdesign`) of externe URL (`https://...`).
   * Laat leeg als de kaart niet klikbaar moet zijn.
   */
  href?: string
  /** Optionele schermafbeelding in /public, bijv. "/screenshots/klant.png". */
  image?: string
}

/**
 * Merkkleuren uit kleuren.txt, omgezet naar hex.
 * Gebruik deze als `accent` zodat de rol in jouw palet blijft.
 */
export const BRAND_ACCENTS = {
  /** hsl(144.9 80.4% 10%) — bijna zwart groen, de inktkleur */
  ink: "#052e16",
  /** hsl(142.8 64.2% 24.1%) — diep bosgroen */
  forest: "#166534",
  /** hsl(142.1 76.2% 36.3%) — vol merkgroen */
  brand: "#15a34a",
  /** hsl(142.1 70.6% 45.3%) — helder groen */
  bright: "#22c55e",
  /** hsl(141.9 69.2% 58%) — zacht groen */
  soft: "#4ade80",
  /** hsl(141.7 76.6% 73.1%) — mintgroen */
  mint: "#86efac",
  /** hsl(141 78.9% 85.1%) — de achtergrondkleur van de site */
  pale: "#bbf7d0",
} as const

/** Papierkleuren — hierop wordt geprint. */
export const PAPER = {
  /** Basis van de papierstrook. */
  base: "#f3faf5",
  /** Kaartvlak, iets lichter dan de strook. */
  card: "#fbfdfb",
  /** Inkt voor koptekst. */
  ink: "#052e16",
  /** Zachtere inkt voor bijschriften. */
  muted: "#5b7a66",
} as const

/**
 * PLACEHOLDERS — vervang deze door je echte projecten.
 *
 * Per project heb je nodig: client, title, description, year, discipline,
 * accent (uit BRAND_ACCENTS), layout, en optioneel href.
 */
export const projects: Project[] = [
  {
    id: "placeholder-1",
    client: "Klantnaam 01",
    title: "Corporate website",
    description: "Volledige nieuwbouw met CMS en meertalige structuur.",
    year: "2025",
    discipline: "WEBDESIGN",
    accent: BRAND_ACCENTS.brand,
    layout: "hero",
    href: "/webdesign",
  },
  {
    id: "placeholder-2",
    client: "Klantnaam 02",
    title: "Webshop migratie",
    description: "Van verouderd platform naar Shopify, zonder omzetverlies.",
    year: "2025",
    discipline: "E-COMMERCE",
    accent: BRAND_ACCENTS.forest,
    layout: "shot",
    href: "/webdesign",
  },
  {
    id: "placeholder-3",
    client: "Klantnaam 03",
    title: "Merkidentiteit online",
    description: "Typografisch sterke onepager met eigen fotografie.",
    year: "2024",
    discipline: "BRANDING",
    accent: BRAND_ACCENTS.bright,
    layout: "type",
    href: "/webdesign",
  },
  {
    id: "placeholder-4",
    client: "Klantnaam 04",
    title: "Campagne landingspagina's",
    description: "Zes varianten, doorlopend getest op conversie.",
    year: "2024",
    discipline: "CONVERSIE",
    accent: BRAND_ACCENTS.soft,
    layout: "grid",
    href: "/webdesign",
  },
  {
    id: "placeholder-5",
    client: "Klantnaam 05",
    title: "Klantenportaal",
    description: "Beveiligde omgeving met dashboards en documentbeheer.",
    year: "2024",
    discipline: "WEBAPP",
    accent: BRAND_ACCENTS.mint,
    layout: "device",
    href: "/klantenportaal",
  },
  {
    id: "placeholder-6",
    client: "Klantnaam 06",
    title: "AI-agent voor support",
    description: "Beantwoordt zelfstandig terugkerende klantvragen.",
    year: "2026",
    discipline: "AI-AGENT",
    accent: BRAND_ACCENTS.pale,
    layout: "quote",
    href: "/ai-agents",
  },
  {
    id: "placeholder-7",
    client: "Klantnaam 07",
    title: "Vindbaarheid herbouwd",
    description: "Technische SEO, structuur en content in één traject.",
    year: "2026",
    discipline: "SEO",
    accent: BRAND_ACCENTS.brand,
    layout: "shot",
    href: "/seo-dashboard",
  },
  {
    id: "placeholder-8",
    client: "Code Lieshout",
    title: "Meer werk bekijken",
    description: "De rol blijft doorlopen — bekijk het volledige portfolio.",
    year: "",
    discipline: "PORTFOLIO",
    accent: BRAND_ACCENTS.bright,
    layout: "closing",
    href: "/portfolio",
  },
]
