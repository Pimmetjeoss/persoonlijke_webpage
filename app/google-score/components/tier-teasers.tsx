import { ArrowRightIcon } from "@radix-ui/react-icons"

type Tier = {
  name: string
  description: string
  cta: string
  accent: string
  href: string
  external?: boolean
}

const TIERS: Tier[] = [
  {
    name: "Laatste plaats",
    description:
      "Je concurrenten hebben nu een betere kans om gevonden te worden. Geen paniek: stuur mij een kort appje, dan lossen we dit direct samen op.",
    cta: "Direct contact opnemen",
    accent: "hsl(0 72% 47%)",
    href: "https://wa.me/31612419980?text=Hoi%20Pim%2C%20ik%20sta%20laatste%20in%20de%20Google%20Score%20vergelijking.%20Kun%20je%20me%20helpen%20met%20SEO%20en%20GEO%3F",
    external: true,
  },
  {
    name: "Level up",
    description:
      "Je zit in de buurt. Vraag een gratis SEO/GEO scan aan en ontdek welke stappen je naar het volgende level brengen.",
    cta: "Gratis SEO/GEO scan",
    accent: "hsl(32 95% 44%)",
    href: "/seo-geo-scan",
  },
  {
    name: "Overtuigend wereldkampioen",
    description:
      "Je website staat sterk. Test nu of AI jouw site ook beter begrijpt dan de concurrentie.",
    cta: "Doe de volgende test",
    accent: "hsl(142.1 76.2% 36.3%)",
    href: "/chatgpt-check",
  },
]

export function TierTeasers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TIERS.map((tier) => (
        <div
          key={tier.name}
          className="rounded-xl border-[3px] p-6 bg-white flex flex-col"
          style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
        >
          <div
            className="h-2 -mx-6 -mt-6 mb-4 rounded-t-[9px]"
            style={{ backgroundColor: tier.accent }}
          />
          <h3
            className="text-2xl font-bold mb-4"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {tier.name}
          </h3>
          <p className="text-sm text-gray-700 mb-6">{tier.description}</p>
          <div className="flex-1" />
          <a
            href={tier.href}
            target={tier.external ? "_blank" : undefined}
            rel={tier.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:underline"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
          >
            {tier.cta}
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      ))}
    </div>
  )
}
