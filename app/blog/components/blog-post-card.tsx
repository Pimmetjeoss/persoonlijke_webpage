"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";

interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  featuredImage?: string;
  index: number;
}

export function BlogPostCard({
  slug,
  title,
  excerpt,
  date,
  category,
  featuredImage,
  index,
}: BlogPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
      }}
      className="group"
    >
      <Link href={`/blog/${slug}`}>
        <article className="bg-white rounded-lg border-[3px] border-[hsl(144.9,80.4%,10%)] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          {/* Featured Image */}
          {featuredImage && (
            <div className="relative w-full h-48 overflow-hidden bg-[hsl(141,78.9%,85.1%)]">
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-[hsl(142.1,76.2%,36.3%)]" />
              <span className="text-sm font-medium text-[hsl(142.1,76.2%,36.3%)] uppercase tracking-wide">
                {category}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(144.9,80.4%,10%)] mb-3 group-hover:text-[hsl(142.1,76.2%,36.3%)] transition-colors duration-300">
              {title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
              {excerpt}
            </p>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <time dateTime={date}>{new Date(date).toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
            </div>

            {/* Read More Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-[hsl(142.1,76.2%,36.3%)] font-medium group-hover:translate-x-2 inline-block transition-transform duration-300">
                Lees meer →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
