import type { Metadata } from "next";

import { getAllPosts } from "./lib/blog";
import BlogRollClient from "./roll/blog-roll-client";
import { postToProject } from "./roll/lib/blog-projects";

export const metadata: Metadata = {
  title: "Blog — Code Lieshout",
  description:
    "Blogartikelen over AI, automatisering en webdevelopment van Code Lieshout. Kies een artikel vanaf de papierrol.",
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

export default function BlogRollPage() {
  const posts = getAllPosts();
  const projects = posts.map((post, index) => postToProject(post, index));

  return <BlogRollClient projects={projects} />;
}
