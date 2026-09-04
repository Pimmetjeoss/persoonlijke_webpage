import type { Metadata } from "next";

import { getAllPosts } from "./lib/blog";
import BlogRollClient from "./roll/blog-roll-client";
import { postToProject } from "./roll/lib/blog-projects";

export const metadata: Metadata = {
  title: "AI & Webdesign Blog",
  description:
    "Blogartikelen over AI, automatisering en webdevelopment van Code Lieshout.",
  alternates: {
    canonical: "https://code-lieshout.nl/blog",
  },
  openGraph: {
    title: "AI & Webdesign Blog",
    description: "Blogartikelen over AI, automatisering en webdevelopment.",
    url: "https://code-lieshout.nl/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & Webdesign Blog",
    description: "AI, automatisering en webdevelopment — artikelen van Code Lieshout.",
    images: ["/og-image.png"],
  },
};

export default function BlogRollPage() {
  const posts = getAllPosts();
  const projects = posts.map((post, index) => postToProject(post, index));

  return <BlogRollClient projects={projects} />;
}
