import Link from "next/link";
import { getAllPosts } from "../lib/blog";

/**
 * Gerelateerde artikelen (zelfde categorie eerst) + CTA-blok naar /contact.
 * Server component: links staan in de ruwe HTML (B4).
 */
export function RelatedPosts({ slug, category }: { slug: string; category: string }) {
  const posts = getAllPosts().filter((p) => p.slug !== slug);
  const sameCategory = posts.filter((p) => p.category === category);
  const others = posts.filter((p) => p.category !== category);
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <div className="mt-12 space-y-8">
      {related.length > 0 && (
        <section aria-label="Gerelateerde artikelen">
          <h2 className="text-2xl md:text-3xl font-bold text-[hsl(144.9,80.4%,10%)] mb-4">
            Verder lezen
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {related.map((post) => (
              <li
                key={post.slug}
                className="bg-white rounded-xl border-[3px] border-[hsl(144.9,80.4%,10%)] p-5 flex flex-col"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[hsl(142.1,76.2%,36.3%)]">
                  {post.category}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-2 text-lg font-bold leading-snug text-[hsl(144.9,80.4%,10%)] hover:underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        aria-label="Hulp nodig met AI of je website?"
        className="rounded-xl p-8 md:p-10 text-center space-y-4"
        style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)", border: "3px solid black" }}
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Zelf aan de slag met AI of een nieuwe website?
        </h2>
        <p className="text-lg text-white/90 max-w-xl mx-auto">
          Code Lieshout bouwt het voor je — vaste prijs vooraf, reactie binnen één werkdag.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white font-sans text-lg rounded-xl transition-all hover:scale-105"
            style={{ color: "hsl(142.1 76.2% 36.3%)", border: "3px solid black" }}
          >
            NEEM CONTACT OP
          </Link>
          <Link
            href="/agent-ready"
            className="inline-block px-8 py-3 font-sans text-lg rounded-xl text-white transition-all hover:scale-105"
            style={{ backgroundColor: "hsl(142.4 71.8% 29.2%)", border: "3px solid black" }}
          >
            GRATIS WEBSITE-SCAN
          </Link>
        </div>
      </section>
    </div>
  );
}
