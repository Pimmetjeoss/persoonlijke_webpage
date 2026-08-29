import type { Metadata } from "next"
import Link from "next/link"
import { BarChartIcon, RocketIcon } from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { getLatestComparisonByDomain } from "@/lib/google-score/cache"
import { ResultSection } from "../components/result-section"
import { ScoreCircle } from "../components/score-circle"
import { TierTeasers } from "../components/tier-teasers"

export type PageProps = {
  params: Promise<{ domain: string }>
}

type GoogleScoreLevel = {
  level: number
  name: string
  range: string
  description: string
  next?: string
  accent: string
}

const GOOGLE_SCORE_LEVELS: GoogleScoreLevel[] = [
  {
    level: 1,
    name: "Nog nauwelijks zichtbaar",
    range: "0-9",
    description:
      "Je website heeft nog weinig autoriteit. Concurrenten hebben een grotere kans om eerder gevonden te worden.",
    next: "Werk eerst aan technische basis, indexeerbaarheid en de eerste betrouwbare vermeldingen.",
    accent: "hsl(0 72% 47%)",
  },
  {
    level: 2,
    name: "Basis aanwezig",
    range: "10-29",
    description:
      "Er is online tractie, maar je website heeft nog te weinig kracht om structureel mee te doen.",
    next: "Bouw aan relevante content, lokale signalen en kwalitatieve links.",
    accent: "hsl(32 95% 44%)",
  },
  {
    level: 3,
    name: "In de wedstrijd",
    range: "30-49",
    description:
      "Je website staat redelijk, maar sterke concurrenten kunnen je nog makkelijk voorbij.",
    next: "Versterk je belangrijkste pagina's en autoriteit binnen je niche.",
    accent: "hsl(48 96% 44%)",
  },
  {
    level: 4,
    name: "Sterke speler",
    range: "50-69",
    description:
      "Je website heeft duidelijke autoriteit en kan op veel zoekopdrachten concurreren.",
    next: "Richt je op thought leadership, digitale PR en AI-vindbaarheid.",
    accent: "hsl(142.1 76.2% 36.3%)",
  },
  {
    level: 5,
    name: "Autoriteit",
    range: "70-100",
    description:
      "Je website hoort bij de sterke autoriteiten. De volgende stap is dominantie in Google en AI-antwoorden.",
    accent: "hsl(142.4 71.8% 29.2%)",
  },
]

function googleScoreLevel(score: number | null): GoogleScoreLevel {
  const normalized = Math.max(0, Math.min(100, score ?? 0))

  if (normalized >= 70) return GOOGLE_SCORE_LEVELS[4]
  if (normalized >= 50) return GOOGLE_SCORE_LEVELS[3]
  if (normalized >= 30) return GOOGLE_SCORE_LEVELS[2]
  if (normalized >= 10) return GOOGLE_SCORE_LEVELS[1]
  return GOOGLE_SCORE_LEVELS[0]
}

function scoreTone(
  score: number | null,
  allScores: [number | null, number | null, number | null],
): "green" | "orange" | "red" {
  const normalized = score ?? 0
  const scores = allScores.map((value) => value ?? 0)
  const betterCount = scores.filter((value) => value > normalized).length

  if (betterCount === 0) return "green"
  if (betterCount === 1) return "orange"
  return "red"
}

function ScoreValue({
  score,
  tone,
}: {
  score: number | null
  tone: "green" | "orange" | "red"
}) {
  if (score === null) {
    return (
      <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full border-[12px] border-gray-200 text-center text-sm font-semibold text-gray-600">
        Score niet beschikbaar
      </div>
    )
  }

  return <ScoreCircle score={score} tone={tone} />
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
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
      >
        <StickyHeader
          title="GOOGLE SCORE"
          backgroundColor="hsl(140.6 84.2% 92.5%)"
          hoverColor="hsl(141 78.9% 85.1%)"
          startExpanded={true}
        />
        <div className="mx-auto max-w-3xl p-6 lg:p-10 space-y-6">
          <p
            className="uppercase text-xs tracking-widest mb-1"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          >
            Vergelijking niet opgeslagen
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Maak een nieuwe Google Score vergelijking
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-xl">
            Deze vergelijking is niet beschikbaar als losse detailpagina. Start opnieuw; de scores worden direct op de pagina getoond.
          </p>
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
        <StickyFooter />
      </div>
    )
  }

  const scores: [number | null, number | null, number | null] = [
    row.own_dr,
    row.competitor1_dr,
    row.competitor2_dr,
  ]
  const ownTone = scoreTone(row.own_dr, scores)
  const competitor1Tone = scoreTone(row.competitor1_dr, scores)
  const competitor2Tone = scoreTone(row.competitor2_dr, scores)
  const ownLevel = googleScoreLevel(row.own_dr)

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

        {/* Jouw score (witte kaart + cirkel) */}
        <ResultSection
          id="score"
          title="Jouw score"
          description="Gebaseerd op hoe sterk jouw website online staat."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreValue score={row.own_dr} tone={ownTone} />
            <div className="text-center md:text-left max-w-md">
              <p className="text-sm text-gray-700">
                Deze score loopt van 0 tot 100. Hoe hoger de score, hoe sterker
                jouw domein staat ten opzichte van andere websites qua
                autoriteit en vindbaarheid.
              </p>
              <p className="mt-3 text-xs text-gray-500">
                Domain Rating by{" "}
                <a
                  href="https://ahrefs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Ahrefs
                </a>
                .
              </p>
            </div>
          </div>
        </ResultSection>

        <ResultSection
          id="level"
          title={`Level ${ownLevel.level}: ${ownLevel.name}`}
          description="Deze indeling maakt snel duidelijk waar je website nu staat en wat de volgende stap is."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-stretch">
            <div
              className="rounded-xl border-[3px] p-6 flex flex-col justify-center"
              style={{
                borderColor: "hsl(144.9 80.4% 10%)",
                backgroundColor: ownLevel.accent,
                color: "white",
              }}
            >
              <p className="text-xs uppercase tracking-widest font-bold">Score range</p>
              <p
                className="text-5xl font-bold mt-2"
                style={{ fontFamily: "var(--font-fjalla-one)" }}
              >
                {ownLevel.range}
              </p>
            </div>
            <div className="rounded-xl border-[3px] p-6 bg-white" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
              <p className="text-base text-gray-700">{ownLevel.description}</p>
              {ownLevel.next && (
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Volgende stap:</strong> {ownLevel.next}
                </p>
              )}
            </div>
          </div>
        </ResultSection>

        {/* Vergelijking met concurrenten */}
        <ResultSection
          id="vergelijking"
          title="Vergelijking met concurrenten"
          description="Zie in één oogopslag hoe jouw domein zich verhoudt tot de gekozen concurrenten."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                {row.competitor1}
              </p>
              <ScoreValue score={row.competitor1_dr} tone={competitor1Tone} />
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                {row.competitor2}
              </p>
              <ScoreValue score={row.competitor2_dr} tone={competitor2Tone} />
            </div>
          </div>
        </ResultSection>

        {/* Aan de slag */}
        <ResultSection
          id="aan-de-slag"
          title="Aan de slag"
          description="Kies de vervolgstap die past bij jouw positie: herstellen, level up gaan of je AI-zichtbaarheid testen."
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
