import type { NextConfig } from "next";

const AGENT_LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"',
  '</robots.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/agent-card.json>; rel="describedby"; type="application/json"',
].join(", ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Filmposters van de WebMCP-demo /webmcp/demos/bioscoop; ze komen
        // uit de ticket-booking-demo van Google Chrome Labs.
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about-me',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.code-lieshout.nl' }],
        destination: 'https://code-lieshout.nl/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Link", value: AGENT_LINK_HEADER }],
      },
      {
        source: "/.well-known/api-catalog",
        headers: [
          { key: "Content-Type", value: "application/linkset+json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/.well-known/openid-configuration",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/.well-known/oauth-authorization-server",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/.well-known/oauth-protected-resource",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
