# Architecture Reference

**GitHub repo**: https://github.com/Pimmetjeoss/persoonlijke_webpage
```bash
git clone https://github.com/Pimmetjeoss/persoonlijke_webpage.git && cd persoonlijke_webpage && npm install
```

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 4 (CSS-first config, `@import "tailwindcss"` in globals.css)
- Three.js + React Three Fiber + Drei + R3F Postprocessing
- GSAP 3.13 (page transitions, complex timelines)
- motion 12 (Framer Motion successor, component animations)
- Lenis (smooth scrolling)
- Lottie React (animated icons)
- Radix UI (accordion primitives)
- gray-matter + react-markdown + remark-gfm (blog)

## Directory Structure

```
app/
  layout.tsx              # Root layout: fonts, TransitionProvider
  globals.css             # Tailwind 4 import, theme tokens, body reset
  page.tsx                # Homepage (re-exports achtergrondfrontpage)
  components/             # Global shared components
    achtergrondfrontpage.tsx  # Fullscreen video intro -> auto-nav to /portfolio
    transition_provider.tsx   # TransitionProvider context + useTransition() hook
    slider_transition.tsx     # GSAP 3-block page transition overlay
    sticky-header.tsx         # Reusable collapsible sticky header
    sticky-footer.tsx         # Fixed bottom bar with Lottie social icons
    random_tekst.tsx          # Scramble-reveal text effect
    typing_text.tsx           # GSAP typewriter effect
  portfolio/              # Main hub/menu page
    page.tsx
    data/work-experience.ts   # 17 nav items (data source)
    components/
      work-experience.tsx     # Clickable list (7xl-9xl text, hover colors)
      navigation.tsx          # Top nav + PLAY button (Pacman)
      pacman-popup.tsx        # Fullscreen Pacman game
      timeline-animation.tsx  # motion useInView blur-in
      accordion.tsx           # Custom motion accordion
  ai-agents/              # WebGL dithering shader landing
  ai-agents1/             # AI agents full content page
  blog/                   # Blog system (masonry grid + [slug] pages)
    lib/blog.ts               # FS-based markdown reader
    lib/types.ts              # BlogPost interfaces
  contact/                # Horizontal scroll contact page
  about-me/               # Interactive blur-reveal about page
  FAQ/                    # FAQ with StickyHeader + accordion
  test/                   # Sandbox/template page
  under-construction/     # Fallback for unbuilt pages
components/ui/            # Shadcn-style primitives (text-scramble, accordion)
content/posts/            # Markdown blog posts with frontmatter
lib/utils.ts              # cn() utility (clsx + tailwind-merge)
public/                   # Static assets (video, images, Lottie JSON, Pacman)
```

## Route Map

| Route | Purpose | Status |
|---|---|---|
| `/` | Video intro, auto-transitions to /portfolio | Done |
| `/portfolio` | Main hub: 17 clickable service/page items | Done |
| `/ai-agents` | Dithering shader landing | Done |
| `/ai-agents1` | Multi-agent system explainer | Done |
| `/blog` | Masonry blog grid | Done |
| `/blog/[slug]` | Individual post (SSG) | Done |
| `/contact` | Horizontal scroll contact info | Done |
| `/about-me` | Interactive text reveal | Done |
| `/FAQ` | FAQ accordion | Done (placeholder content) |
| `/test` | BentoGrid + SectionCard sandbox | Done |
| `/under-construction` | Fallback for unbuilt pages | Done |

## Alias

`@/*` maps to project root. Use `@/app/components/...`, `@/lib/utils`, etc.
