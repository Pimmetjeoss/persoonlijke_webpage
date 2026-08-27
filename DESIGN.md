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
- `/webmcp` shows the static PRIKKEL-styled one-pager from `public/webmcp/` inside a fullscreen iframe (same pattern as `/mcp-explorer`); the static files are the single source of truth for content and styling.
- The page keeps its own IKEA/PRIKKEL design system (yellow `#ffdb00` only as CTA/panel fills, ink-black text, 8px radius, no shadows, Noto IKEA fallback stack) — do not restyle it into the Code Lieshout green identity.
- The portfolio accordion row `WEBMCP` must link to `/webmcp`, not fall back to `/under-construction`.

## Pitfalls
- Do not replace the `/ai-agents` header/navigation behavior.
- Do not touch unrelated portfolio/tool changes unless requested.
- Avoid generic SaaS cards; this site’s strongest pattern is bold border-led accordion rows.
- Do not redesign the cactus-ridder into a generic cactus or import an external mesh for `/cactus-3d`.
