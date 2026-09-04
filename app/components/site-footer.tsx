const NAV_LINKS = [
  { href: "/jouw-website", label: "Jouw website" },
  { href: "/ai-agents", label: "AI-agents" },
  { href: "/agent-ready", label: "Agent-ready scan" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/**
 * Server-side gerenderde footer (B2/B5/C4): NAP-gegevens, KvK, kernlinks,
 * privacy, machineleesbare bestanden en sameAs-profielen — allemaal in ruwe HTML.
 */
export function SiteFooter() {
  return (
    <footer
      className="px-4 py-10 md:px-8"
      style={{
        backgroundColor: "hsl(141 78.9% 85.1%)",
        color: "hsl(144.9 80.4% 10%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Code Lieshout</p>
          <address className="mt-2 text-sm not-italic leading-relaxed">
            Eventer 17
            <br />
            5351 SK Berghem
            <br />
            KvK 99344882
            <br />
            <a className="underline" href="mailto:pim@code-lieshout.nl">
              pim@code-lieshout.nl
            </a>
            <br />
            <a className="underline" href="tel:+31612419980">
              +31 6 12419980
            </a>
          </address>
        </div>
        <nav aria-label="Footermenu">
          <p className="text-lg font-bold">Pagina&apos;s</p>
          <ul className="mt-2 space-y-1 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a className="underline" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-lg font-bold">Voor mens &amp; machine</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a className="underline" href="/privacy">
                Privacyverklaring
              </a>
            </li>
            <li>
              <a className="underline" href="/llms.txt">
                llms.txt (voor AI-agents)
              </a>
            </li>
            <li>
              <a className="underline" href="/pricing.md">
                Prijzen (machineleesbaar)
              </a>
            </li>
            <li>
              <a className="underline" href="/sitemap.xml">
                Sitemap
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.linkedin.com/in/pim-van-lieshout"
                rel="me noopener"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://www.youtube.com/@PimvanLieshout"
                rel="me noopener"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs opacity-80">
        © 2026 Code Lieshout (KvK 99344882) — Webdesign &amp; AI-agents, Lieshout (Noord-Brabant).
      </p>
    </footer>
  );
}
