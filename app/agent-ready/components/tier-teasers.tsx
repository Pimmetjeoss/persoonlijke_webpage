import { ArrowRightIcon } from "@radix-ui/react-icons"

type Tier = {
  name: string
  price: string
  pitch: string
  bullets: string[]
  cta: string
  accent: string
}

const TIERS: Tier[] = [
  {
    name: "Rapport",
    price: "vanaf €97",
    pitch: "Alle fixes uitgelegd in het Nederlands, copy-paste klaar.",
    bullets: [
      "Volledige uitleg per check",
      "Code-voorbeelden voor WordPress, Shopify en custom",
      "PDF + web-versie",
    ],
    cta: "Bestel rapport",
    accent: "hsl(141.7 76.6% 73.1%)",
  },
  {
    name: "Implementatie-dossier",
    price: "€1.500 – 2.500",
    pitch: "Developer-ready dossier, zodat jouw team het kan uitvoeren.",
    bullets: [
      "Stack-specifieke instructies",
      "1 strategie-call",
      "2 her-scans + badge",
    ],
    cta: "Plan een gesprek",
    accent: "hsl(141.9 69.2% 58%)",
  },
  {
    name: "Subscription",
    price: "€149 / maand",
    pitch: "Je site blijft up-to-date met nieuwe standaarden en her-scans.",
    bullets: [
      "Maandelijkse her-scan",
      "Updates op nieuwe specs",
      "Kwartaal-call",
    ],
    cta: "Neem contact op",
    accent: "hsl(142.1 76.2% 36.3%)",
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
            className="text-2xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {tier.name}
          </h3>
          <p
            className="uppercase text-xs tracking-widest mt-1 mb-3"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          >
            {tier.price}
          </p>
          <p className="text-sm text-gray-700 mb-4">{tier.pitch}</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6 flex-1">
            {tier.bullets.map((b) => (
              <li key={b} className="flex gap-2 items-start">
                <span
                  className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)" }}
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <a
            href="/contact"
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
