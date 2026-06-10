import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { BarChartIcon, RocketIcon } from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { getLatestComparisonByDomain } from "@/lib/google-score/cache"
import { ResultSection } from "../components/result-section"
import { TierTeasers } from "../components/tier-teasers"

export type PageProps = {
  params: Promise<{ domain: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  const decoded = decodeURIComponent(domain)
  return {
    title: `Google Score voor ${decoded}`,
    description: `Vergelijk de domeinscore van ${decoded} met twee concurrenten.`,
    robots: { index: false },
  }
}

export default async function GoogleScoreDetailPage({ params }: PageProps) {
  const { domain: rawDomain } = await params
  const domain = decodeURIComponent(rawDomain).toLowerCase()

  const row = await getLatestComparisonByDomain(domain)
  if (!row) {
    notFound()
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title={row.own_domain.toUpperCase()}
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-10">
        {/* Intro */}
        <div>
          <p
            className="uppercase text-xs tracking-widest mb-1"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          >
            Google Score vergelijking
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {row.own_domain}
          </h1>
        </div>

        {/* Jouw score (grote witte kaart met score) */}
        <ResultSection
          id="score"
          title="Jouw score"
          description="Gebaseerd op de sterkte van het backlink-profiel van jouw domein."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="flex flex-col items-center">
            <div
              className="text-7xl md:text-8xl lg:text-9xl font-bold leading-none"
              style={{
                color: "hsl(144.9 80.4% 10%)",
                fontFamily: "var(--font-fjalla-one)",
              }}
            >
              {row.own_dr ?? "-"}
            </div>
            <p className="text-sm text-gray-600 mt-1">van 100</p>
          </div>
        </ResultSection>

        {/* Vergelijking met concurrenten (twee witte kaarten naast elkaar) */}
        <ResultSection
          id="vergelijking"
          title="Vergelijking met concurrenten"
          description="Zie in één oogopslag hoe jouw domein zich verhoudt tot de gekozen concurrenten."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-6 rounded-lg border-[3px] bg-white flex flex-col items-center"
              style={{ borderColor: "hsl(141.9 69.2% 58%)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                Concurrent 1
              </p>
              <p className="text-sm font-mono text-gray-800 mb-2">
                {row.competitor1}
              </p>
              <div
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {row.competitor1_dr ?? "-"}
              </div>
              <p className="text-xs text-gray-600 mt-1">van 100</p>
            </div>
            <div
              className="p-6 rounded-lg border-[3px] bg-white flex flex-col items-center"
              style={{ borderColor: "hsl(141.7 76.6% 73.1%)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                Concurrent 2
              </p>
              <p className="text-sm font-mono text-gray-800 mb-2">
                {row.competitor2}
              </p>
              <div
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {row.competitor2_dr ?? "-"}
              </div>
              <p className="text-xs text-gray-600 mt-1">van 100</p>
            </div>
          </div>
        </ResultSection>

        {/* Aan de slag */}
        <ResultSection
          id="aan-de-slag"
          title="Aan de slag"
          description="Van rapport tot volledig implementatie-dossier — zo kom je naar 100/100."
          icon={<RocketIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <TierTeasers />
        </ResultSection>

        <div className="text-center">
          <Link
            href="/google-score"
            className="inline-block px-6 py-3 rounded-lg border-[3px] bg-white font-semibold uppercase tracking-wide text-sm"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              borderColor: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Nieuwe vergelijking maken
          </Link>
        </div>

        <div className="h-8" />
      </div>
      <StickyFooter />
    </div>
  )
}
