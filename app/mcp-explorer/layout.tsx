import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Explorer — Wat is een MCP-server?",
  description:
    "Ontdek interactief wat een MCP-server (Model Context Protocol) is, hoe het werkt en welke servers er bestaan — in een retro Windows 98-desktop.",
  alternates: {
    canonical: "https://code-lieshout.nl/mcp-explorer",
  },
  openGraph: {
    title: "MCP Explorer — Wat is een MCP-server?",
    description:
      "Interactieve uitleg over MCP-servers in een retro Windows 98-look.",
    url: "https://code-lieshout.nl/mcp-explorer",
    type: "website",
  },
};

export default function McpExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
