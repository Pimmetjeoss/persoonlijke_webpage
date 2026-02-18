# Code Patterns Reference

## Table of Contents

1. [Page Transitions](#page-transitions)
2. [New Page Template](#new-page-template)
3. [Green Color Palette](#green-color-palette)
4. [Font System](#font-system)
5. [Animation Patterns](#animation-patterns)
6. [Blog System](#blog-system)
7. [Adding Navigation Items](#adding-navigation-items)
8. [Component Reuse](#component-reuse)

---

## Page Transitions

NEVER use `router.push()`. Always use the custom transition system:

```tsx
"use client";
import { useTransition } from "@/app/components/transition_provider";

function MyComponent() {
  const { startTransition } = useTransition();
  return <button onClick={() => startTransition("/target-route")}>Go</button>;
}
```

The transition renders 3 green overlay blocks animated with GSAP. The page change happens while the screen is covered.

## New Page Template

**`app/test/` is the canonical template page.** Copy this directory as starting point for any new page. It contains a working example with BentoGrid, SectionCard, and Accordion components on the green background with StickyHeader + StickyFooter.

Canonical pattern for new pages (based on FAQ/test pages):

```tsx
"use client";
import StickyHeader from "@/app/components/sticky-header";
import StickyFooter from "@/app/components/sticky-footer";

export default function NewPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}>
      <StickyHeader
        title="PAGE TITLE"
        backgroundColor="hsl(142.1 76.2% 36.3%)"
        hoverColor="hsl(141.9 69.2% 58%)"
        startExpanded={true}
      />

      {/* Page content */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        {/* ... */}
      </section>

      <StickyFooter />
    </main>
  );
}
```

### StickyHeader Props

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Header text (uppercase recommended) |
| `backgroundColor` | `string` | HSL color string |
| `hoverColor` | `string` | HSL color on hover |
| `startExpanded` | `boolean` | Whether to start visible |

### StickyFooter

No props needed. Renders 5 Lottie social icons (home, email, instagram, linkedin, whatsapp) + copyright.

## Green Color Palette

All colors are inline HSL strings. From darkest to lightest:

```
hsl(144.9 80.4% 10%)    -- darkest (primary text)
hsl(143.8 61.2% 20.2%)  -- very dark
hsl(142.8 64.2% 24.1%)  -- dark
hsl(142.4 71.8% 29.2%)  -- dark medium
hsl(142.1 76.2% 36.3%)  -- medium dark (primary action/accent)
hsl(142.1 70.6% 45.3%)  -- medium
hsl(141.9 69.2% 58%)    -- medium light
hsl(141.7 76.6% 73.1%)  -- light
hsl(141 78.9% 85.1%)    -- very light
hsl(140.6 84.2% 92.5%)  -- page background (nearly lightest)
hsl(138.5 76.5% 96.7%)  -- lightest
```

Design language: Large bold type (text-7xl to text-9xl), 3px black borders, rounded-xl white cards.

## Font System

3 Google Fonts loaded in `layout.tsx` as CSS variables:

| Variable | Font | Usage |
|---|---|---|
| `--font-fjalla-one` | Fjalla One | **Primary/default** (set as `--font-sans`) |
| `--font-geist-mono` | Geist Mono | Monospace (`--font-mono`, code blocks) |
| `--font-homemade-apple` | Homemade Apple | Script accent ("ai oplossingen" in nav) |

Usage: `style={{ fontFamily: "var(--font-homemade-apple)" }}` or Tailwind: `font-sans` (Fjalla One), `font-mono` (Geist Mono).

## Animation Patterns

### Blur-in on scroll (motion)

```tsx
import { motion, useInView } from "motion/react";

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
      animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
```

### TimelineContent (existing component)

```tsx
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";

<TimelineContent animateIn="fadeInUp">
  <div>Content that blurs in on scroll</div>
</TimelineContent>
```

### GSAP (for complex timelines)

```tsx
import gsap from "gsap";

useEffect(() => {
  const tl = gsap.timeline();
  tl.to(ref.current, { y: 0, duration: 1, ease: "power2.inOut" });
  return () => tl.kill();
}, []);
```

### Lottie icons (play on hover)

```tsx
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "@/public/animations/email.json";

const lottieRef = useRef<LottieRefCurrentProps>(null);

<Lottie
  lottieRef={lottieRef}
  animationData={animationData}
  loop={false}
  autoplay={false}
  onMouseEnter={() => { lottieRef.current?.stop(); lottieRef.current?.play(); }}
/>
```

## Blog System

### Adding a blog post

Create `content/posts/your-slug.md`:

```markdown
---
title: "Post Title"
date: "2026-02-18"
category: "AI & Technologie"
excerpt: "Short description for the card."
featuredImage: "/blog/images/your-image.jpg"
---

Markdown content here...
```

Required frontmatter: `title`, `date`, `category`, `excerpt`.
Optional: `featuredImage`.

### Blog API (`app/blog/lib/blog.ts`)

```tsx
import { getAllPosts, getPostBySlug, getAllCategories } from "@/app/blog/lib/blog";

const posts = getAllPosts();          // sorted by date desc
const post = getPostBySlug("slug");   // single post with content
const cats = getAllCategories();       // unique category list
```

## Adding Navigation Items

The portfolio page is the main site hub. To add a new page:

1. Add entry in `app/portfolio/data/work-experience.ts`:
```ts
{ id: "your-page", company: "YOUR PAGE TITLE", role: "", date: "" }
```

2. Add route mapping in `app/portfolio/components/work-experience.tsx`:
```ts
const routes: Record<string, string> = {
  // ... existing routes
  "your-page": "/your-page",
};
```

3. Create the page at `app/your-page/page.tsx` using the new page template above.

Without a route mapping, clicking the item navigates to `/under-construction`.

## Component Reuse

### Available reusable components

| Component | Location | Purpose |
|---|---|---|
| `BentoGrid` / `BentoCard` | `app/test/components/bento-grid.tsx` | CSS grid cards with hover effects |
| `SectionCard` | `app/test/components/section-card.tsx` | White card with icon, title, description |
| `Accordion05` | `app/test/components/accordion-05.tsx` | Large FAQ-style accordion |
| `TextScramble` | `components/ui/text-scramble.tsx` | Character scramble reveal |
| `RandomizedTextEffect` | `app/components/random_tekst.tsx` | Full text scramble |
| `TypingText` | `app/components/typing_text.tsx` | GSAP typewriter |
| `DitheringShader` | `app/ai-agents/components/dithering-shader.tsx` | WebGL2 dithering canvas |

Note: `bento-grid`, `section-card`, `accordion-05` exist as copies in `app/test/`, `app/blog/`, and `app/FAQ/`. Import from the location closest to your page, or from `app/test/` as the canonical source.

### cn() utility

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", conditional && "extra-classes")} />
```
