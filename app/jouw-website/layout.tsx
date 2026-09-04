import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webdesign Lieshout — Website laten maken?",
  description:
    "Website laten maken in Lieshout? Moderne, snelle site op maat voor het MKB — van ontwerp tot livegang. Vraag een vrijblijvende offerte aan.",
  alternates: {
    canonical: "https://code-lieshout.nl/jouw-website",
    types: {
      "text/markdown": "https://code-lieshout.nl/jouw-website.md",
    },
  },
  openGraph: {
    title: "Webdesign Lieshout — Website laten maken?",
    description:
      "Moderne, snelle website op maat voor het MKB in Lieshout en omgeving. Vraag een vrijblijvende offerte aan.",
    url: "https://code-lieshout.nl/jouw-website",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webdesign Lieshout — Website laten maken?",
    description:
      "Moderne, snelle website op maat voor het MKB. Vraag een vrijblijvende offerte aan.",
    images: ["/og-image.png"],
  },
};

export default function JouwWebsiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
