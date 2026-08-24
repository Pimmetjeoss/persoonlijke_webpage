import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Code Lieshout",
  description:
    "Blogartikelen over AI, automatisering en webdevelopment van Code Lieshout.",
  alternates: {
    canonical: "https://code-lieshout.nl/blog",
  },
  openGraph: {
    title: "Blog — Code Lieshout",
    description: "Blogartikelen over AI, automatisering en webdevelopment.",
    url: "https://code-lieshout.nl/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
