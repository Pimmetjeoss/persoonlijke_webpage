import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Werk — Code Lieshout",
  description:
    "Bekijk eerder opgeleverd werk van Code Lieshout. Klik een project aan om het te openen.",
  alternates: {
    canonical: "https://code-lieshout.nl/werk",
  },
  openGraph: {
    title: "Werk — Code Lieshout",
    description:
      "Bekijk eerder opgeleverd werk van Code Lieshout.",
    url: "https://code-lieshout.nl/werk",
    type: "website",
  },
};

export default function WerkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
