import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-agent laten maken — Automatisering MKB",
  description:
    "AI-agent laten maken voor je MKB-bedrijf? Code Lieshout bouwt maatwerk agents voor e-mail, planning en klantcontact. Vraag een demo aan.",
  keywords: [
    "AI agents bouwen",
    "AI agent ontwikkelaar Nederland",
    "agentic AI MKB",
    "ChatGPT alternatief bedrijf",
    "AI automatisering Nederland",
    "Pim van Lieshout AI",
  ],
  alternates: {
    canonical: "https://code-lieshout.nl/ai-agents",
    types: {
      "text/markdown": "https://code-lieshout.nl/ai-agents.md",
    },
  },
  openGraph: {
    title: "AI-agent laten maken — Automatisering MKB",
    description:
      "Maatwerk AI-agents voor het MKB: e-mail, planning en klantcontact. Vraag een demo aan.",
    url: "https://code-lieshout.nl/ai-agents",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-agent laten maken — Automatisering MKB",
    description:
      "Maatwerk AI-agents voor het MKB. Vraag een demo aan bij Code Lieshout.",
    images: ["/og-image.png"],
  },
};

export default function AIAgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
