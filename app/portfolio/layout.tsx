import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — AI-agents en websites",
  description:
    "Portfolio van Code Lieshout: AI-agents, web-apps en automatiseringen voor Nederlandse bedrijven. Bekijk het werk.",
  alternates: {
    canonical: "https://code-lieshout.nl/portfolio",
    types: {
      "text/markdown": "https://code-lieshout.nl/portfolio.md",
    },
  },
  openGraph: {
    title: "Portfolio — AI-agents en websites",
    description:
      "AI-agents, web-applicaties en automatiseringen voor Nederlandse bedrijven.",
    url: "https://code-lieshout.nl/portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — AI-agents en websites",
    description:
      "Bekijk het werk van Code Lieshout: AI-agents en websites voor het MKB.",
    images: ["/og-image.png"],
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
