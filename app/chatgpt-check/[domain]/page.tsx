import Link from "next/link"
import type { Metadata } from "next"
import { EyeOpenIcon, LightningBoltIcon, RocketIcon } from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { getLatestComparisonByDomain } from "@/lib/chatgpt-check/cache"
import { ResultSection } from "@/app/google-score/components/result-section"
import { TierTeasers } from "@/app/google-score/components/tier-teasers"

type PageProps = {
  params: Promise<{ domain: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  const decoded = decodeURIComponent(domain)
  return {
    title: `ChatGPT Check voor ${decoded} — Code Lieshout`,
    description: `Wat ziet ChatGPT van ${decoded}? Vergelijk de AI-weergave met een concurrent.`,
    robots: { index: false },
  }
}

export default async function ChatGPTCheckDetailPage({ params }: PageProps) {
  const { domain: rawDomain } = await params
  const domain = decodeURIComponent(rawDomain).toLowerCase()

  const row = await getLatestComparisonByDomain(domain)
  if (!row || row.status !== "done") {
    // Supabase table might not exist yet — show friendly fallback
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
      >
        <StickyHeader
          title={domain.toUpperCase()}
          backgroundColor="hsl(140.6 84.2% 92.5%)"
          hoverColor="hsl(141 78.9% 85.1%)"
          startExpanded={true}
        />
        <div className="text-center space-y-4 p-10">
          <h1
            className="text-2xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Nog geen scan voor {domain}
          </h1>
          <p className="text-gray-600">
            Deze pagina toont resultaten nadat je een vergelijking hebt gedaan.
          </p>
          <Link
            href="/chatgpt-check"
            className="inline-block px-6 py-3 rounded-lg border-[3px] bg-white font-semibold uppercase tracking-wide text-sm"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              borderColor: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Vergelijking maken
          </Link>
        </div>
        <StickyFooter />
      </div>
    )
  }

  const ownMeta = row.own_metadata ?? {}
  const compMeta = row.competitor_metadata ?? {}

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title={domain.toUpperCase()}
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
            ChatGPT Check vergelijking
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {domain}
          </h1>
        </div>

        {/* Insights */}
        {row.insights && row.insights.length > 0 && (
          <ResultSection
            id="insights"
            title="💡 Inzichten"
            description="Wat valt op als we jouw site en de concurrent naast elkaar leggen?"
            icon={<LightningBoltIcon className="w-10 h-10 md:w-12 md:h-12" />}
          >
            <ul className="space-y-2">
              {row.insights.map((insight, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span style={{ color: "hsl(142.1 76.2% 36.3%)" }}>•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </ResultSection>
        )}

        {/* Side-by-side */}
        <ResultSection
          id="vergelijking"
          title="Side-by-side vergelijking"
          description="Wat een AI-crawler ziet van beide pagina's — platte tekst, zonder opmaak."
          icon={<EyeOpenIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Own site */}
            <div
              className="rounded-xl border-[3px] bg-white p-5"
              style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Jouw site
              </p>
              <h3
                className="text-lg font-bold mb-2 truncate"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {domain}
              </h3>
              {ownMeta.title && (
                <p className="text-xs text-gray-600 mb-2 truncate">
                  {ownMeta.title}
                </p>
              )}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3 text-xs">
                <span className="text-gray-500">OG Image:</span>
                <span className={ownMeta.ogImage ? "text-green-700" : "text-red-700"}>
                  {ownMeta.ogImage ? "✅" : "❌"}
                </span>
                <span className="text-gray-500">Taal:</span>
                <span className="text-gray-700">{ownMeta.language ?? "?"}</span>
              </div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Wat AI ziet:
              </p>
              <pre className="text-xs text-gray-700 bg-gray-50 rounded-lg p-3 max-h-80 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                {row.own_markdown
                  ? row.own_markdown.slice(0, 1500) +
                    (row.own_markdown.length > 1500 ? "\n\n... (verkort)" : "")
                  : "(geen inhoud)"}
              </pre>
            </div>

            {/* Competitor */}
            <div
              className="rounded-xl border-[3px] bg-white p-5"
              style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Concurrent
              </p>
              <h3
                className="text-lg font-bold mb-2 truncate"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {(() => {
                  try { return new URL(row.competitor_url).hostname.replace(/^www\./, "") }
                  catch { return row.competitor_url }
                })()}
              </h3>
              {compMeta.title && (
                <p className="text-xs text-gray-600 mb-2 truncate">
                  {compMeta.title}
                </p>
              )}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3 text-xs">
                <span className="text-gray-500">OG Image:</span>
                <span className={compMeta.ogImage ? "text-green-700" : "text-red-700"}>
                  {compMeta.ogImage ? "✅" : "❌"}
                </span>
                <span className="text-gray-500">Taal:</span>
                <span className="text-gray-700">{compMeta.language ?? "?"}</span>
              </div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Wat AI ziet:
              </p>
              <pre className="text-xs text-gray-700 bg-gray-50 rounded-lg p-3 max-h-80 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                {row.competitor_markdown
                  ? row.competitor_markdown.slice(0, 1500) +
                    (row.competitor_markdown.length > 1500 ? "\n\n... (verkort)" : "")
                  : "(geen inhoud)"}
              </pre>
            </div>
          </div>
        </ResultSection>

        {/* Aan de slag */}
        <ResultSection
          id="aan-de-slag"
          title="Aan de slag"
          description="Van rapport tot volledig implementatie-dossier — zo verbeter je wat AI van je site ziet."
          icon={<RocketIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <TierTeasers />
        </ResultSection>

        <div className="text-center">
          <Link
            href="/chatgpt-check"
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
