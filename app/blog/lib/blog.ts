import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMetadata } from './types';

// Absolute path to content directory
const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

/**
 * Get all blog post slugs from filesystem
 * Used by generateStaticParams for build-time generation
 */
export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(POSTS_DIRECTORY);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param slug - Post identifier (filename without .md)
 * @returns BlogPost with parsed frontmatter and content
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(POSTS_DIRECTORY, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      console.error(`Post not found: ${slug}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse frontmatter
    const { data, content } = matter(fileContents);

    // Validate required fields
    const metadata = data as BlogPostMetadata;
    if (!metadata.title || !metadata.date || !metadata.category || !metadata.excerpt) {
      console.error(`Invalid frontmatter in ${slug}.md`);
      return null;
    }

    return {
      slug,
      title: metadata.title,
      excerpt: metadata.excerpt,
      date: metadata.date,
      category: metadata.category,
      featuredImage: metadata.featuredImage,
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all blog posts sorted by date (newest first)
 * Used by blog listing page
 */
export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null);

  // Sort by date descending
  return posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get posts filtered by category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(post => post.category === category);
}

/**
 * Get unique categories from all posts
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = posts.map(post => post.category);
  return Array.from(new Set(categories)).sort();
}
