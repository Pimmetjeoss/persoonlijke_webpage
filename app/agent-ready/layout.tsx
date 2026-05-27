import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent-Ready Scan — Gratis Check voor AI-Agents (19 standaarden)",
  description:
    "Hoe klaar is jouw website voor AI-agents zoals ChatGPT, Claude en Perplexity? Gratis scan tegen 19 actuele standaarden. Resultaat in 10 seconden, geen account vereist.",
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
    title: "Agent-Ready Scan — Gratis Check voor AI-Agents",
    description:
      "Hoe vindbaar is jouw website voor AI-agents? Gratis scan in 10 seconden tegen 19 standaarden.",
    url: "https://code-lieshout.nl/agent-ready",
    type: "website",
  },
};

export default function AgentReadyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
