import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google Score — Vergelijk jouw domein met concurrenten",
  description:
    "Vergelijk de Google-autoriteit (Ahrefs Domain Rating) van jouw domein met twee concurrenten.",
  alternates: {
    canonical: "https://code-lieshout.nl/google-score",
  },
  openGraph: {
    title: "Google Score — Vergelijk jouw domein met concurrenten",
    description:
      "Check gratis de Ahrefs Domain Rating van jouw domein en twee concurrenten.",
    url: "https://code-lieshout.nl/google-score",
    type: "website",
  },
  robots: { index: false },
};

export default function GoogleScoreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
