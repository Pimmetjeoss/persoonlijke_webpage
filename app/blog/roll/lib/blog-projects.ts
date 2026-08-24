import type { Project } from "../lib/project"
import { BRAND_ACCENTS } from "../lib/atlas"

/**
 * Blogkaarten voor de papierrol.
 *
 * De server rendert eerst de blogposts (gray-matter frontmatter) en zet ze
 * hier om naar het kaartformaat van de rol. Klikken opent `/blog/<slug>`.
 */

const ACCENTS = [
  BRAND_ACCENTS.brand,
  BRAND_ACCENTS.forest,
  BRAND_ACCENTS.bright,
  BRAND_ACCENTS.mint,
]

const LAYOUTS = ["hero", "shot", "type", "device"] as const

/** Zet één blogpost om naar een rolkaart. */
export function postToProject(post: {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
}, index: number): Project {
  return {
    id: post.slug,
    client: post.category.toUpperCase(),
    title: post.title,
    description: post.excerpt,
    year: post.date.slice(0, 4),
    discipline: "BLOG",
    accent: ACCENTS[index % ACCENTS.length],
    layout: LAYOUTS[index % LAYOUTS.length],
    href: `/blog/${post.slug}`,
  }
}
