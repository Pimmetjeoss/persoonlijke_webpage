import type { NextConfig } from "next";

const AGENT_LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"',
  '</robots.txt>; rel="describedby"; type="text/plain"',
].join(", ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about-me!',
        destination: '/about',
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
    ];
  },
};

export default nextConfig;
