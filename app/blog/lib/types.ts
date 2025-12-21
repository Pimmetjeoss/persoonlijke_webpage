export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  featuredImage?: string;
  content: string;
}

export interface BlogPostMetadata {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  featuredImage?: string;
}
