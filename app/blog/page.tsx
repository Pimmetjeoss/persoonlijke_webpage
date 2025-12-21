"use client";

import { useRef } from "react";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { BlogPostCard } from "./components/blog-post-card";
import { MasonryGrid } from "./components/masonry-grid";

// Sample blog post data - replace with real data later
const blogPosts = [
  {
    slug: "ai-in-healthcare",
    title: "De toekomst van AI in de gezondheidszorg",
    excerpt: "Ontdek hoe kunstmatige intelligentie de medische sector transformeert en wat dit betekent voor patiënten en zorgverleners.",
    date: "2025-03-15",
    category: "AI & Technologie",
    featuredImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
  },
  {
    slug: "sustainable-web-design",
    title: "Duurzaam webdesign: Waarom het belangrijk is",
    excerpt: "Leer hoe je websites kunt bouwen die niet alleen mooi zijn, maar ook vriendelijk voor het milieu.",
    date: "2025-03-10",
    category: "Webdesign",
    featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  },
  {
    slug: "react-19-features",
    title: "React 19: De belangrijkste nieuwe features",
    excerpt: "Een diepgaande analyse van de nieuwste React versie en wat dit betekent voor developers.",
    date: "2025-03-05",
    category: "Development",
  },
  {
    slug: "minimalist-portfolio",
    title: "Minimalisme in portfolio design",
    excerpt: "Waarom minder vaak meer is als het gaat om het presenteren van je werk online.",
    date: "2025-02-28",
    category: "Design",
    featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop",
  },
  {
    slug: "typescript-tips",
    title: "10 TypeScript tips voor betere code",
    excerpt: "Praktische tips om je TypeScript code robuuster en onderhoudbaarder te maken.",
    date: "2025-02-20",
    category: "Development",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
  },
  {
    slug: "ui-animation-principles",
    title: "Animaties die je UX verbeteren",
    excerpt: "Leer de principes van goede UI animaties en wanneer je ze wel (en niet) moet gebruiken.",
    date: "2025-02-15",
    category: "Design",
  },
  {
    slug: "nextjs-performance",
    title: "Next.js performance optimalisatie",
    excerpt: "Concrete stappen om je Next.js applicatie sneller te maken voor betere gebruikerservaring.",
    date: "2025-02-10",
    category: "Development",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    slug: "color-theory-web",
    title: "Kleurtheorie voor webdesigners",
    excerpt: "Ontdek hoe je kleur effectief inzet om emotie en hiërarchie te creëren in je designs.",
    date: "2025-02-05",
    category: "Design",
    featuredImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop",
  },
  {
    slug: "accessibility-matters",
    title: "Toegankelijkheid is geen optie",
    excerpt: "Waarom elke website toegankelijk moet zijn en hoe je dit bereikt zonder concessies te doen aan design.",
    date: "2025-01-30",
    category: "Webdesign",
  },
  {
    slug: "framer-motion-guide",
    title: "Motion design met Framer Motion",
    excerpt: "Een complete gids voor het bouwen van soepele, professionele animaties in React applicaties.",
    date: "2025-01-25",
    category: "Development",
    featuredImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
  },
  {
    slug: "three-js-beginners",
    title: "3D op het web: Three.js voor beginners",
    excerpt: "Stap voor stap leren hoe je interactieve 3D experiences bouwt met Three.js en React.",
    date: "2025-01-20",
    category: "Development",
  },
  {
    slug: "design-systems",
    title: "Design systems die echt werken",
    excerpt: "Hoe je een design system opzet dat teams helpt consistente producten te bouwen.",
    date: "2025-01-15",
    category: "Design",
    featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
  },
];

function BlogPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen pb-32"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="BLOG"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-32">
        <MasonryGrid>
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.slug} {...post} index={index} />
          ))}
        </MasonryGrid>
      </div>

      <StickyFooter />
    </div>
  );
}

export default BlogPage;
