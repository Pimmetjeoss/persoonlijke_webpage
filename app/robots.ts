import type { MetadataRoute } from "next";

const BASE_URL = "https://code-lieshout.nl";

const AI_ALLOW = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      ...AI_ALLOW.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`, `${BASE_URL}/sitemap_agentic_discovery.xml`],
    host: BASE_URL,
  };
}
