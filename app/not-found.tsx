import Link from "next/link";

const HELPFUL_LINKS = [
  { href: "/", label: "Home" },
  { href: "/jouw-website", label: "Jouw website" },
  { href: "/ai-agents", label: "AI-agents" },
  { href: "/agent-ready", label: "Agent-ready scan" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main
      className="min-h-screen px-6 py-24 md:py-32"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <div className="mx-auto max-w-3xl">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "hsl(142.1 76.2% 36.3%)" }}
        >
          404 — Pagina niet gevonden
        </p>
        <h1
          className="mt-4 text-4xl md:text-6xl font-bold tracking-tight"
          style={{ color: "hsl(144.9 80.4% 10%)" }}
        >
          Deze pagina bestaat niet (meer).
        </h1>
        <p
          className="mt-6 text-lg md:text-xl leading-relaxed"
          style={{ color: "hsl(144.9 80.4% 10%)" }}
        >
          De link klopt niet of de pagina is verhuisd. Zoek hieronder verder —
          of neem direct contact op, dan wijs ik je de weg.
        </p>

        {/* Zoekveld (site-breed via Google) */}
        <form
          action="https://www.google.com/search"
          method="get"
          role="search"
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <input type="hidden" name="q" value="site:code-lieshout.nl" />
          <input
            type="search"
            name="q"
            placeholder="Zoek op code-lieshout.nl…"
            aria-label="Zoeken op code-lieshout.nl"
            className="flex-1 rounded-xl border-[3px] bg-white px-5 py-3 text-lg outline-none"
            style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
          />
          <button
            type="submit"
            className="rounded-xl px-6 py-3 text-lg font-bold text-white"
            style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)" }}
          >
            Zoeken
          </button>
        </form>

        {/* Standaardnavigatie, server-side gerenderd */}
        <nav aria-label="404-navigatie" className="mt-10">
          <ul className="flex flex-wrap gap-3">
            {HELPFUL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-full border-2 bg-white px-5 py-2 font-medium transition-transform hover:scale-105"
                  style={{
                    borderColor: "hsl(144.9 80.4% 10%)",
                    color: "hsl(144.9 80.4% 10%)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Machineleesbare ingangen voor agents */}
        <div
          className="mt-10 rounded-xl border-[3px] bg-white p-6 text-base"
          style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
        >
          <p className="font-bold">Voor AI-agents:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>
              <Link className="underline" href="/sitemap.xml">
                Sitemap (alle pagina&apos;s)
              </Link>
            </li>
            <li>
              <Link className="underline" href="/llms.txt">
                llms.txt (agent-overzicht)
              </Link>
            </li>
            <li>
              <Link className="underline" href="/pricing.md">
                pricing.md (prijzen, machineleesbaar)
              </Link>
            </li>
            <li>
              <Link className="underline" href="/contact">
                Contact met Pim
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
