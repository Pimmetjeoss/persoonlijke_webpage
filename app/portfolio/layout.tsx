import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — Werk & Projecten van Pim van Lieshout",
  description:
    "Bekijk het portfolio van Code Lieshout: AI-agents, web-applicaties en automatiseringen voor Nederlandse bedrijven. Van chatbots tot complete platforms.",
  alternates: {
    canonical: "https://code-lieshout.nl/portfolio",
    types: {
      "text/markdown": "https://code-lieshout.nl/portfolio.md",
    },
  },
  openGraph: {
    title: "Portfolio — Werk & Projecten van Pim van Lieshout",
    description:
      "AI-agents, web-applicaties en automatiseringen voor Nederlandse bedrijven door Code Lieshout.",
    url: "https://code-lieshout.nl/portfolio",
    type: "website",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
