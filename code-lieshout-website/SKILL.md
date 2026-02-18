---
name: sir_prikkel_webpagebuilder
description: >
  Build, extend, and maintain the Code Lieshout personal portfolio website (Next.js 16, React 19, Tailwind CSS 4, GSAP, motion).
  Use when: (1) Creating new pages or sections, (2) Adding content (blog posts, service pages), (3) Modifying existing pages,
  (4) Working with the page transition system, (5) Adding animations or 3D effects, (6) Updating navigation/portfolio items,
  (7) Styling with the green color palette, (8) Any task involving the Code Lieshout website codebase.
---

# Code Lieshout Website Skill

## Quick Reference

- **GitHub repo**: `https://github.com/Pimmetjeoss/persoonlijke_webpage` - clone als je geen lokale toegang hebt
- **Dev server**: `npm run dev` (localhost:3000)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Alias**: `@/*` maps to project root

## Critical Rules

1. **Never use `router.push()`** - Always use `startTransition(url)` from `useTransition()` hook
2. **All pages are `"use client"`** - The transition system requires client components
3. **Import motion from `"motion/react"`** - Not from `"framer-motion"`
4. **Colors are inline HSL strings** - No centralized theme tokens, use the green palette from references
5. **Dutch language** - All user-facing text must be in Dutch
6. **Fjalla One is the default font** - Available as `font-sans` in Tailwind

## Creating a New Page

1. **Copy `app/test/`** as starting point - it is the canonical template page with BentoGrid, SectionCard, and Accordion examples
2. Rename the directory and adapt `page.tsx` content
3. Add route in `app/portfolio/data/work-experience.ts` and `app/portfolio/components/work-experience.tsx`
4. Use `StickyHeader` + `StickyFooter` + section content pattern
5. Apply green palette colors and blur-in scroll animations

See [patterns.md](references/patterns.md#new-page-template) for the full template code.

## Adding a Blog Post

Create `content/posts/your-slug.md` with frontmatter: `title`, `date`, `category`, `excerpt` (required), `featuredImage` (optional). See [patterns.md](references/patterns.md#blog-system).

## Verificatie

Na elke wijziging:
1. `npm run lint` - fix alle lint errors
2. `npm run build` - zorg dat de build slaagt
3. `npm run dev` - controleer lokaal op localhost:3000

Na push naar GitHub:
4. Gebruik de **e2e-runner** agent (`/e2e`) met agent-browser om de live deployment visueel te testen
   - Installeer indien nodig: `npm install -g agent-browser && agent-browser install`
   - Test kritieke flows: homepage video, portfolio navigatie, page transitions, blog pagina's

## Reference Files

- **[architecture.md](references/architecture.md)** - Full directory structure, route map, tech stack
- **[patterns.md](references/patterns.md)** - Code patterns: transitions, templates, colors, fonts, animations, blog API, navigation, components
- **[content-guide.md](references/content-guide.md)** - Brand identity, service offerings, design principles

Read `references/patterns.md` first when building or modifying pages. Read `references/architecture.md` when exploring the codebase structure. Read `references/content-guide.md` when writing content or creating service pages.
