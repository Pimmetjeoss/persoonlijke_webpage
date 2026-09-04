import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webdesigner Lieshout — Pim van Lieshout",
  description:
    "Pim van Lieshout (Code Lieshout): webdesigner en AI-specialist in Lieshout. Maatwerk websites en AI-agents voor het MKB. Maak kennis.",
  alternates: {
    canonical: "https://code-lieshout.nl/about",
    types: {
      "text/markdown": "https://code-lieshout.nl/about.md",
    },
  },
  openGraph: {
    title: "Webdesigner Lieshout — Pim van Lieshout",
    description:
      "Oprichter Code Lieshout: webdesigner en AI-specialist uit Lieshout voor het MKB.",
    url: "https://code-lieshout.nl/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webdesigner Lieshout — Pim van Lieshout",
    description:
      "Maak kennis met Pim van Lieshout: webdesigner en AI-specialist in Lieshout.",
    images: ["/og-image.png"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
