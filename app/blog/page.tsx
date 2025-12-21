import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { BlogPostCard } from "./components/blog-post-card";
import { MasonryGrid } from "./components/masonry-grid";
import { getAllPosts } from "./lib/blog";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div
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
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[hsl(144.9,80.4%,10%)] text-xl">Geen blog posts gevonden.</p>
            <p className="text-gray-600 mt-2">Voeg .md bestanden toe aan de content/posts/ folder.</p>
          </div>
        ) : (
          <MasonryGrid>
            {posts.map((post, index) => (
              <BlogPostCard key={post.slug} {...post} index={index} />
            ))}
          </MasonryGrid>
        )}
      </div>

      <StickyFooter />
    </div>
  );
}
