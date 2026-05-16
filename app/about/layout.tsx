import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over Pim van Lieshout — AI & Webontwikkelaar in Lieshout",
  description:
    "Pim van Lieshout, oprichter van Code Lieshout. AI-specialist en webontwikkelaar in Lieshout (Noord-Brabant). Procesoptimalisatie met moderne AI-agents en maatwerk websites.",
  alternates: {
    canonical: "https://code-lieshout.nl/about",
  },
  openGraph: {
    title: "Over Pim van Lieshout — AI & Webontwikkelaar in Lieshout",
    description:
      "Oprichter Code Lieshout. AI-specialist en webontwikkelaar uit Lieshout — procesoptimalisatie met AI-agents.",
    url: "https://code-lieshout.nl/about",
    type: "profile",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
