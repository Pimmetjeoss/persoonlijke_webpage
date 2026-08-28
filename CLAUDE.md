# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

This is a personal portfolio website built with Next.js 16 (App Router), React 19, Three.js, and GSAP.

### Key Patterns

**Page Transitions**: All page navigation uses a custom transition system:
- `TransitionProvider` wraps the app in `app/layout.tsx` - manages state and renders `SliderTransition`
- Use `useTransition()` hook to navigate: `startTransition('/portfolio')` instead of `router.push()`
- The slider creates 3 animated blocks that cover the screen during navigation

**3D Graphics**: Three.js components live in `app/components/`:
- `achtergrondfrontpage.tsx` - Main 3D blob with Perlin noise displacement
- Uses React Three Fiber (`@react-three/fiber`) and Drei helpers (`@react-three/drei`)
- Post-processing effects: Bloom, N8AO, Noise via `@react-three/postprocessing`

**Animation Libraries**:
- GSAP for page transitions and complex animations
- `motion` (Framer Motion successor) for UI animations
- `lenis` for smooth scrolling

**Fonts**: 10+ Google Fonts loaded in `app/layout.tsx` with CSS variables (e.g., `--font-bebas-neue`)

**Styling**: Tailwind CSS 4 with `cn()` utility from `lib/utils.ts` for class merging

### Directory Structure

```
app/
├── components/          # Shared components (transitions, headers, 3D)
├── portfolio/          # Portfolio page with work experience, accordion
├── test/               # Test/sandbox page with BentoGrid
├── contact/            # Contact page with horizontal scroll sections
├── ai-agents/          # AI agents showcase page
└── about-me/           # About page

components/ui/          # UI primitives (accordion from UI Layouts)
lib/utils.ts            # Utility functions (cn for class merging)
```

### Remote Images

`next.config.ts` allows images from `images.unsplash.com`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
