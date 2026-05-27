import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sir Prikkel — Persoonlijke AI-assistent van Code Lieshout",
  description:
    "Sir Prikkel is de persoonlijke AI-assistent van Code Lieshout — een maatwerk AI-agent met geheugen, integraties en ingebouwde veiligheidsregels.",
  alternates: {
    canonical: "https://code-lieshout.nl/sir-prikkel",
    types: {
      "text/markdown": "https://code-lieshout.nl/sir-prikkel.md",
    },
  },
  openGraph: {
    title: "Sir Prikkel — Persoonlijke AI-assistent",
    description:
      "Een maatwerk AI-agent met geheugen, integraties en ingebouwde veiligheidsregels door Code Lieshout.",
    url: "https://code-lieshout.nl/sir-prikkel",
    type: "website",
  },
};

export default function SirPrikkelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
