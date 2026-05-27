import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — AI Nieuws, Agents & Tech Insights",
  description:
    "AI-nieuws, agent-ontwikkelingen en tech-insights door Pim van Lieshout. Diepgaande analyses over DeepSeek, Claude, Kimi, AI-infrastructuur en de toekomst van AI agents.",
  alternates: {
    canonical: "https://code-lieshout.nl/blog",
    types: {
      "text/markdown": "https://code-lieshout.nl/blog.md",
    },
  },
  openGraph: {
    title: "Blog — AI Nieuws & Tech Insights | Code Lieshout",
    description:
      "Diepgaande analyses over AI, agents, en tech door Pim van Lieshout.",
    url: "https://code-lieshout.nl/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
