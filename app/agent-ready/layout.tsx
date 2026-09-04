import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-vindbaarheid testen — Gratis scan",
  description:
    "Hoe klaar is je site voor AI-agents als ChatGPT en Claude? Gratis scan met resultaat in 10 seconden. Start direct, geen account nodig.",
  keywords: [
    "agent ready scan",
    "AI agent website check",
    "ChatGPT crawler test",
    "llms.txt check",
    "MCP server card",
    "AI vindbaarheid",
    "GEO check Nederland",
  ],
  alternates: {
    canonical: "https://code-lieshout.nl/agent-ready",
    types: {
      "text/markdown": "https://code-lieshout.nl/agent-ready.md",
    },
  },
  openGraph: {
    title: "AI-vindbaarheid testen — Gratis scan",
    description:
      "Hoe vindbaar is jouw website voor AI-agents? Gratis scan in 10 seconden.",
    url: "https://code-lieshout.nl/agent-ready",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-vindbaarheid testen — Gratis scan",
    description:
      "Gratis scan: hoe klaar is jouw site voor ChatGPT, Claude en Perplexity?",
    images: ["/og-image.png"],
  },
};

export default function AgentReadyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
