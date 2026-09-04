---
name: Code Lieshout Personal Site
version: 1.0.0
---

# Code Lieshout Personal Site Design Notes

## Visual system
- Primary surface: pale green `hsl(140.6 84.2% 92.5%)`.
- Ink: deep green/black mix `hsl(144.9 80.4% 10%)` and solid black for structural borders.
- Accent greens rotate through saturated brand greens used by the portfolio accordion.
- Typography: oversized condensed uppercase display rows, tight leading, bold weight, playful but direct Dutch copy.

## AI Agents page
- Preserve the existing `/ai-agents` sticky header: title `AI-AGENTS`, pale green background, green hover color, expanded start state.
- Replace generic content blocks with a portfolio-style full-width accordion/list:
  - thick black top borders
  - oversized uppercase agent names
  - circular plus icon
  - hover lift with green color changes
  - optional expanded detail content beneath the display row
- Agent rows: Shopify, SEO, Dataset, Google Workspace, Second Brain, Linkedin, CLI, Website Builder.

## Responsive rules
- Mobile rows use large but contained type (`clamp`-like Tailwind sizes) so names wrap cleanly.
- Desktop rows should feel monumental like `/portfolio` without causing horizontal overflow.
- Keep adequate bottom spacer for sticky footer.

## Webdesign page placeholder
- `/webdesign` is intentionally a scaffold that mirrors `/test` so it can be filled out later into a full sales/service page.
- Keep the same pale-green surface, sticky header, bento-grid entry block, section cards, FAQ accordion, timeline animation, and sticky footer pattern as `/test`.
- Portfolio accordion item `webdesign` routes directly to `/webdesign`; it must not fall back to `/under-construction`.
- The `Werkwijze` section uses a slowly rotating, interactive Three.js point cube behind the editorial content. Hover proximity enlarges one point at a time; colors stay within the Code Lieshout green palette, and reduced-motion preferences must be respected.

## Cactus 3D page
- `/cactus-3d` is an experimental brand showcase that reconstructs the canonical cactus-ridder as procedural Three.js geometry; it must not load GLB/OBJ/FBX assets.
- Preserve the pale-green paper surface, near-black structural borders, condensed uppercase typography, and sparse mono labels from the wider Code Lieshout identity.
- The model must retain the mascot’s rounded ribbed cactus body, angry drop eyes, silver riveted knight helmet, short arms/feet, dark illustrated outline, and optional tablet prop.
- Use warm key light, cool fill, a restrained green rim and a contact shadow. The full desktop experience may auto-rotate; reduced-motion and narrow screens keep a composed static view.
- Keep the canvas as a focused interactive stage rather than a full-site background. Pair it with semantic view controls and nearby source-reference imagery.

## WebMCP page
- `/webmcp` is a regular Next.js route: `app/webmcp/page.tsx` (server component) plus the scoped `app/webmcp/webmcp.module.css`. It is no longer a static one-pager in an iframe — `public/webmcp/` now only holds the images the page references at `/webmcp/images/`.
- The design system is isolated by scoping, not by an iframe. Keep it that way: tokens live on `.page` (never `:root`), and the base element rules (`a`, `img`, `*`, `strong`, `:focus-visible`) are wrapped in `:where(.page)` so they keep their original zero-class specificity. Dropping the `:where()` lifts `a` above `.arrowButton`/`.brandBadge`/`.mediaCardControl` and turns the round arrow buttons blue and underlined.
- Tailwind preflight (via `globals.css`) zeroes heading/paragraph margins, so the four spots that relied on UA defaults carry explicit margins: `.sectionHead h2` (`0.83em`), `.manualStripInner`, `.storyCardText`, and `.footerFineprint` (all `1em`). Do not "clean these up".
- The page keeps its own IKEA/PRIKKEL design system (yellow `#ffdb00` only as CTA/panel fills, ink-black text, 8px radius, no shadows, Noto IKEA fallback stack) — do not restyle it into the Code Lieshout green identity.
- The portfolio accordion row `WEBMCP` must link to `/webmcp`, not fall back to `/under-construction`.
- `.page` carries `display: flow-root`. Without it the footer's `margin-block-end` collapses out of `.page`, the white surface stops 80px short of the page end, and `globals.css` (`html, body { background: var(--background) }`, `#0a0a0a` under `prefers-color-scheme: dark`) shows through as a dark band. Do not swap it for a plain `display: block`.
- `--color-steel-gray` is `#767676`, not the `#818181` from the original token dump: it is only ever used for 13px text, where `#818181` is 3.9:1 on white and fails WCAG AA.
- Internal destinations are internal links. The two Agent-Ready CTAs use `next/link` to `/agent-ready`; they must not go back to an absolute `https://code-lieshout.nl/...` URL with `target="_blank"`. They skip the slider transition on purpose — turning this server component into a client component for two CTAs is not worth it, and a real anchor beats an `onClick` span.
- The FAQ renders from the `FAQ` array and the FAQPage JSON-LD is derived from that same array. Keep them derived, never hand-maintained side by side.

## Pitfalls
- Do not replace the `/ai-agents` header/navigation behavior.
- Do not touch unrelated portfolio/tool changes unless requested.
- Avoid generic SaaS cards; this site’s strongest pattern is bold border-led accordion rows.
- Do not redesign the cactus-ridder into a generic cactus or import an external mesh for `/cactus-3d`.

## SEO/agent-readiness sprint (4 sep 2026, handoff sporen A–C + §7)

- SSR-chrome: `app/components/site-nav.tsx` + `app/components/site-footer.tsx`
  (server components in root-layout) — menu + NAP/KvK-footer op elke pagina in ruwe HTML.
- 1 H1 per pagina: accordion-titels en markdown-content h1 → h2; `StickyHeader`
  kreeg `titleAs`-prop ("p" waar de pagina al een H1 heeft); portfolio kreeg sr-only H1.
- Contact: NAP-blok (Eventer 17, 5351 SK Berghem, KvK 99344882), telefoon gedemaskeerd
  naar +31612419980 (ook in JSON-LD + contactPoint).
- Nieuwe routes: `/privacy`, `/not-found` (met zoekveld + sitemap/llms-links);
  `/FAQ` → 301 `/faq`; www → apex 301; `/about-me` → `/about` (redirect-typo gefixt).
- Markdown-negotiation via middleware (`Accept: text/markdown` → .md-variant,
  `Vary: Accept`; markdown-404 met sitemap/llms-links bij onbekende paden).
- Assets: `public/og-image.png` (1200×630, merkstijl) nieuw; blogimages → WebP ≤1600px.
- Machineleesbaar: `public/llms.txt`, `public/pricing.md` (gelinkt uit footer,
  jouw-website en agentic sitemap); `when_to_use` in agent-skills index.
- GA4-events: `email_click` (naast bestaand), `generate_lead` (mailto/tel/scan),
  `scan_complete` (resultaatpagina). Geen formulier → geen `contact_submit`.
