import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import {
  BarChartIcon,
} from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { getLatestComparisonByDomain } from "@/lib/google-score/cache"

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
          <p className="mt-2 text-sm text-gray-700 max-w-2xl">
            Laatste vergelijking van jouw domein met twee concurrenten. Cijfers
            komen uit een externe bron met een officiële domeinscore (0–100).
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChartIcon className="w-8 h-8" style={{ color: "hsl(142.1 76.2% 36.3%)" }} />
            <div>
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                Scores
              </h2>
              <p className="text-xs text-gray-600">
                Hoe hoger de score (0–100), hoe sterker het backlink‑profiel van
                het domein.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border-[3px] bg-white" style={{ borderColor: "hsl(142.1 76.2% 36.3%)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                Jouw domein
              </p>
              <p className="text-sm font-mono text-gray-800 mb-1">{row.own_domain}</p>
              <p
                className="text-3xl md:text-4xl font-bold"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {row.own_dr ?? "-"}
              </p>
            </div>
            <div className="p-4 rounded-lg border-[3px] bg-white" style={{ borderColor: "hsl(141.9 69.2% 58%)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                Concurrent 1
              </p>
              <p className="text-sm font-mono text-gray-800 mb-1">{row.competitor1}</p>
              <p
                className="text-3xl md:text-4xl font-bold"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {row.competitor1_dr ?? "-"}
              </p>
            </div>
            <div className="p-4 rounded-lg border-[3px] bg-white" style={{ borderColor: "hsl(141.7 76.6% 73.1%)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                Concurrent 2
              </p>
              <p className="text-sm font-mono text-gray-800 mb-1">{row.competitor2}</p>
              <p
                className="text-3xl md:text-4xl font-bold"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {row.competitor2_dr ?? "-"}
              </p>
            </div>
          </div>
        </section>

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
