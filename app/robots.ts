import type { MetadataRoute } from "next";
import { MAINTENANCE_ENABLED } from "../lib/site-maintenance";

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
        // Let crawlers render the public blog and observe temporary 503s elsewhere.
        disallow: MAINTENANCE_ENABLED ? ["/api/"] : ["/api/", "/_next/"],
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
    sitemap: MAINTENANCE_ENABLED
      ? [`${BASE_URL}/sitemap.xml`]
      : [`${BASE_URL}/sitemap.xml`, `${BASE_URL}/sitemap_agentic_discovery.xml`],
    host: BASE_URL,
  };
}
