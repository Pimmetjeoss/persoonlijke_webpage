import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jouw Website — Maatwerk Websites & Web-apps door Code Lieshout",
  description:
    "Een moderne, snelle en agent-ready website laten bouwen door Code Lieshout. Van ontwerp tot livegang met Next.js, React en aandacht voor SEO en AI-vindbaarheid.",
  alternates: {
    canonical: "https://code-lieshout.nl/jouw-website",
    types: {
      "text/markdown": "https://code-lieshout.nl/jouw-website.md",
    },
  },
  openGraph: {
    title: "Jouw Website — Maatwerk door Code Lieshout",
    description:
      "Een moderne, snelle en agent-ready website op maat. Next.js, React, SEO en AI-vindbaarheid.",
    url: "https://code-lieshout.nl/jouw-website",
    type: "website",
  },
};

export default function JouwWebsiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
