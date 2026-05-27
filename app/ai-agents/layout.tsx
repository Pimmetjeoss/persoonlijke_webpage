import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agents Bouwen voor MKB — Maatwerk Automatisering",
  description:
    "Code Lieshout bouwt AI-agents voor Nederlandse MKB-bedrijven. Autonome digitale medewerkers die e-mail, planning, data-analyse en klantcontact 24/7 afhandelen. Eerlijke prijs, snel live.",
  keywords: [
    "AI agents bouwen",
    "AI agent ontwikkelaar Nederland",
    "agentic AI MKB",
    "ChatGPT alternatief bedrijf",
    "AI automatisering Nederland",
    "Pim van Lieshout AI",
  ],
  alternates: {
    canonical: "https://code-lieshout.nl/ai-agents",
    types: {
      "text/markdown": "https://code-lieshout.nl/ai-agents.md",
    },
  },
  openGraph: {
    title: "AI Agents Bouwen voor MKB — Maatwerk Automatisering",
    description:
      "Autonome AI-agents voor Nederlandse MKB-bedrijven door Code Lieshout. Slim, snel, betaalbaar.",
    url: "https://code-lieshout.nl/ai-agents",
    type: "website",
  },
};

export default function AIAgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
