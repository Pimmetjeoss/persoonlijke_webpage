import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import StickyHeader from '@/app/components/sticky-header';
import { StickyFooter } from '@/app/components/sticky-footer';
import { MarkdownContent } from '../components/markdown-content';
import { ImageLightbox } from '../components/image-lightbox';
import { getAllPostSlugs, getPostBySlug } from '../lib/blog';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Generate static params at build time
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: 'hsl(140.6 84.2% 92.5%)' }}
    >
      <StickyHeader
        title="BLOG"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={false}
      />

      <article className="mx-auto max-w-4xl px-6 lg:px-10 pt-32">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[hsl(142.1,76.2%,36.3%)] hover:text-[hsl(144.9,80.4%,10%)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Terug naar overzicht</span>
        </Link>

        {/* Featured Image with Lightbox */}
        {post.featuredImage && (
          <ImageLightbox
            src={post.featuredImage}
            alt={post.title}
          />
        )}

        {/* Post Header */}
        <header className="mb-12">
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-[hsl(142.1,76.2%,36.3%)]" />
            <span className="text-sm font-medium text-[hsl(142.1,76.2%,36.3%)] uppercase tracking-wide">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(144.9,80.4%,10%)] mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-5 h-5" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Markdown Content */}
        <div className="bg-white rounded-lg border-[3px] border-[hsl(144.9,80.4%,10%)] shadow-xl p-8 md:p-12">
          <MarkdownContent content={post.content} />
        </div>
      </article>

      <StickyFooter />
    </div>
  );
}
