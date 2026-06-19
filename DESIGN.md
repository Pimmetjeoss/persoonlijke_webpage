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

## Pitfalls
- Do not replace the `/ai-agents` header/navigation behavior.
- Do not touch unrelated portfolio/tool changes unless requested.
- Avoid generic SaaS cards; this site’s strongest pattern is bold border-led accordion rows.
