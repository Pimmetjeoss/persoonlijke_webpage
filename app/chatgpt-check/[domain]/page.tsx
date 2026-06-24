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

type AiMetric = {
  label: string
  own: string
  competitor: string
  explanation: string
  winner: "own" | "competitor" | "neutral"
}

function hostFromUrl(raw: string): string {
  try {
    return new URL(raw).hostname.replace(/^www\./, "")
  } catch {
    return raw
  }
}

function wordCount(markdown: string | null): number {
  return (markdown ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function countMatches(markdown: string | null, pattern: RegExp): number {
  return (markdown ?? "").match(pattern)?.length ?? 0
}

function metaValue(meta: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    const value = meta[key]
    if (value) return value
  }
  return ""
}

function comparePresence(own: boolean, competitor: boolean): AiMetric["winner"] {
  if (own && !competitor) return "own"
  if (!own && competitor) return "competitor"
  return "neutral"
}

function compareRange(
  own: number,
  competitor: number,
  minGood: number,
  maxGood?: number,
): AiMetric["winner"] {
  const ownGood = own >= minGood && (maxGood === undefined || own <= maxGood)
  const competitorGood =
    competitor >= minGood && (maxGood === undefined || competitor <= maxGood)
  if (ownGood && !competitorGood) return "own"
  if (!ownGood && competitorGood) return "competitor"
  return "neutral"
}

function buildAiMetrics(params: {
  ownMarkdown: string | null
  competitorMarkdown: string | null
  ownMeta: Record<string, string>
  competitorMeta: Record<string, string>
}): AiMetric[] {
  const ownTitle = metaValue(params.ownMeta, ["title", "ogTitle", "og:title"])
  const competitorTitle = metaValue(params.competitorMeta, [
    "title",
    "ogTitle",
    "og:title",
  ])
  const ownDescription = metaValue(params.ownMeta, [
    "description",
    "ogDescription",
    "og:description",
  ])
  const competitorDescription = metaValue(params.competitorMeta, [
    "description",
    "ogDescription",
    "og:description",
  ])
  const ownOg = metaValue(params.ownMeta, ["ogImage", "og:image"])
  const competitorOg = metaValue(params.competitorMeta, ["ogImage", "og:image"])
  const ownWords = wordCount(params.ownMarkdown)
  const competitorWords = wordCount(params.competitorMarkdown)
  const ownH1 = countMatches(params.ownMarkdown, /^# /gm)
  const competitorH1 = countMatches(params.competitorMarkdown, /^# /gm)
  const ownH2 = countMatches(params.ownMarkdown, /^## /gm)
  const competitorH2 = countMatches(params.competitorMarkdown, /^## /gm)
  const ownLinks = countMatches(params.ownMarkdown, /\[[^\]]+\]\([^)]+\)/g)
  const competitorLinks = countMatches(
    params.competitorMarkdown,
    /\[[^\]]+\]\([^)]+\)/g,
  )

  return [
    {
      label: "Titel",
      own: ownTitle ? `${ownTitle.length} tekens` : "Ontbreekt",
      competitor: competitorTitle ? `${competitorTitle.length} tekens` : "Ontbreekt",
      explanation:
        "De title tag helpt AI en zoekmachines snel bepalen waar de pagina over gaat.",
      winner: compareRange(ownTitle.length, competitorTitle.length, 30, 70),
    },
    {
      label: "Meta description",
      own: ownDescription ? `${ownDescription.length} tekens` : "Ontbreekt",
      competitor: competitorDescription
        ? `${competitorDescription.length} tekens`
        : "Ontbreekt",
      explanation:
        "Een goede description geeft AI een compacte samenvatting van je aanbod.",
      winner: comparePresence(
        ownDescription.length > 30,
        competitorDescription.length > 30,
      ),
    },
    {
      label: "OG image",
      own: ownOg ? "Aanwezig" : "Ontbreekt",
      competitor: competitorOg ? "Aanwezig" : "Ontbreekt",
      explanation:
        "Een OG image is het preview-beeld voor je link. Het wordt gebruikt door social platforms, chatapps en tools die pagina's samenvatten.",
      winner: comparePresence(Boolean(ownOg), Boolean(competitorOg)),
    },
    {
      label: "Tekstcontext",
      own: `${ownWords.toLocaleString("nl-NL")} woorden`,
      competitor: `${competitorWords.toLocaleString("nl-NL")} woorden`,
      explanation:
        "Meer tekst is niet automatisch beter. Het gaat om genoeg duidelijke context zonder ruis.",
      winner:
        Math.abs(ownWords - competitorWords) < 100
          ? "neutral"
          : ownWords > competitorWords
            ? "own"
            : "competitor",
    },
    {
      label: "H1-structuur",
      own: `${ownH1} H1`,
      competitor: `${competitorH1} H1`,
      explanation:
        "Idealiter heeft een pagina een duidelijke H1. Geen H1 of meerdere H1's maken het hoofdonderwerp minder helder.",
      winner: compareRange(ownH1, competitorH1, 1, 1),
    },
    {
      label: "Subkoppen",
      own: `${ownH2} H2's`,
      competitor: `${competitorH2} H2's`,
      explanation:
        "Subkoppen geven AI structuur: diensten, voordelen, FAQ's en onderwerpen worden makkelijker herkend.",
      winner: compareRange(ownH2, competitorH2, 2),
    },
    {
      label: "Context-links",
      own: `${ownLinks} links`,
      competitor: `${competitorLinks} links`,
      explanation:
        "Links helpen AI relaties leggen tussen pagina's, bronnen, cases en vervolgstappen.",
      winner: compareRange(ownLinks, competitorLinks, 2),
    },
  ]
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
  const competitorDomain = hostFromUrl(row.competitor_url)
  const metrics = buildAiMetrics({
    ownMarkdown: row.own_markdown,
    competitorMarkdown: row.competitor_markdown,
    ownMeta,
    competitorMeta: compMeta,
  })

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
            AI Check vergelijking
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

        <ResultSection
          id="controlepunten"
          title="Wat wordt er gecontroleerd?"
          description="De test kijkt naar meerdere signalen. Karakteraantal is dus niet leidend; het gaat om context, structuur, metadata en samenvatbaarheid."
          icon={<EyeOpenIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border-[3px] bg-white p-5"
                style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: "hsl(144.9 80.4% 10%)",
                      fontFamily: "var(--font-fjalla-one)",
                    }}
                  >
                    {metric.label}
                  </h3>
                  <span
                    className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor:
                        metric.winner === "own"
                          ? "hsl(141 78.9% 85.1%)"
                          : metric.winner === "competitor"
                            ? "hsl(0 86% 90%)"
                            : "hsl(35 92% 86%)",
                      color: "hsl(144.9 80.4% 10%)",
                    }}
                  >
                    {metric.winner === "own"
                      ? "Jij sterker"
                      : metric.winner === "competitor"
                        ? "Concurrent sterker"
                        : "Gelijk / nuance"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Jij
                    </p>
                    <p className="font-semibold text-gray-800">{metric.own}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {competitorDomain}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {metric.competitor}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{metric.explanation}</p>
              </div>
            ))}
          </div>
        </ResultSection>

        {/* Insights */}
        {row.insights && row.insights.length > 0 && (
          <ResultSection
            id="insights"
            title="💡 Inzichten"
            description="De belangrijkste signalen uit de scan, vertaald naar begrijpelijke actiepunten."
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
                {competitorDomain}
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
