import { ArrowRightIcon } from "@radix-ui/react-icons"

type Tier = {
  name: string
  cta: string
  accent: string
}

const TIERS: Tier[] = [
  {
    name: "Rapport",
    cta: "Bestel rapport",
    accent: "hsl(141.7 76.6% 73.1%)",
  },
  {
    name: "Implementatie-dossier",
    cta: "Plan een gesprek",
    accent: "hsl(141.9 69.2% 58%)",
  },
  {
    name: "Subscription",
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
            className="text-2xl font-bold mb-4"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {tier.name}
          </h3>
          <div className="flex-1" />
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
