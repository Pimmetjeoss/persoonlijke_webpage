import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent-Scan — Gratis AI-Agent Check (100+ checks, score 0-100)",
  description:
    "De complete agent-scan van Is Agentic: hoe klaar is jouw website voor AI-agents? 100+ checks, een duidelijke score van 0-100 en concrete fixes. Gratis, geen account.",
  keywords: [
    "agent scan",
    "AI agent website check",
    "agentic readiness",
    "is agentic",
    "llms.txt check",
    "MCP server check",
    "AI vindbaarheid",
    "GEO check Nederland",
  ],
  alternates: {
    canonical: "https://code-lieshout.nl/agent-scan",
  },
  openGraph: {
    title: "Agent-Scan — Gratis AI-Agent Check (score 0-100)",
    description:
      "Hoe klaar is jouw website voor AI-agents? 100+ checks, score 0-100 en concrete fixes. Gratis en zonder account.",
    url: "https://code-lieshout.nl/agent-scan",
    type: "website",
  },
};

export default function AgentScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
