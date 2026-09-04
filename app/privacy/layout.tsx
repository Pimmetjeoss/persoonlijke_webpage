import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description:
    "Privacyverklaring van Code Lieshout: welke gegevens we verwerken, waarom, en wat jouw rechten zijn. Kort en leesbaar.",
  alternates: {
    canonical: "https://code-lieshout.nl/privacy",
  },
  openGraph: {
    title: "Privacyverklaring | Code Lieshout",
    description:
      "Welke gegevens Code Lieshout verwerkt en wat jouw rechten zijn.",
    url: "https://code-lieshout.nl/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacyverklaring",
    description:
      "Welke gegevens Code Lieshout verwerkt en wat jouw rechten zijn.",
    images: ["/og-image.png"],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
