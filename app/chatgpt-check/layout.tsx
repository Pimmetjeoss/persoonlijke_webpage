import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChatGPT Check — Wat ziet AI van jouw website?",
  description:
    "Vergelijk wat een mens ziet met wat ChatGPT, Claude en Perplexity van jouw website zien. Gratis scan, direct resultaat.",
  keywords: [
    "chatgpt check",
    "AI website scan",
    "wat ziet chatgpt",
    "AI crawler test",
    "website AI check",
    "SEO AI",
    "vindbaarheid AI",
  ],
  alternates: {
    canonical: "https://code-lieshout.nl/chatgpt-check",
  },
  openGraph: {
    title: "ChatGPT Check — Wat ziet AI van jouw website?",
    description:
      "Scan je website en zie wat AI-agents zoals ChatGPT écht van jouw pagina zien. Side-by-side vergelijking met je concurrent.",
    url: "https://code-lieshout.nl/chatgpt-check",
    type: "website",
  },
  robots: { index: false },
};

export default function ChatGPTCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
