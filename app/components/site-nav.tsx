const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/jouw-website", label: "Jouw website" },
  { href: "/ai-agents", label: "AI-agents" },
  { href: "/agent-ready", label: "Agent-ready scan" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/**
 * Server-side gerenderde hoofdnavigatie (B2). Staat in de ruwe HTML zodat
 * zoekmachines en AI-crawlers (geen JS) het menu + alle kernpagina's zien,
 * inclusief /contact.
 */
export function SiteNav() {
  return (
    <header
      style={{ backgroundColor: "hsl(144.9 80.4% 10%)" }}
    >
      <nav
        aria-label="Hoofdmenu"
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2.5 text-sm font-medium md:px-8 md:text-base"
      >
        <a
          href="/"
          className="font-bold uppercase tracking-wide"
          style={{ color: "hsl(141 78.9% 85.1%)" }}
        >
          Code&nbsp;Lieshout
        </a>
        {NAV_LINKS.slice(1).map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="transition-opacity hover:opacity-80 hover:underline underline-offset-4"
            style={{ color: "hsl(140.6 84.2% 92.5%)" }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
