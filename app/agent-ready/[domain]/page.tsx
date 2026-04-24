import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  BarChartIcon,
  ExclamationTriangleIcon,
  RocketIcon,
  CardStackIcon,
} from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { getLatestScanByDomain } from "@/lib/agent-ready/cache"
import {
  summarize,
  type CategorySummary,
  type IssueEntry,
} from "@/lib/agent-ready/scoring"
import { IsItAgentReadyResponseSchema } from "@/lib/agent-ready/schemas"
import { ScoreDisplay } from "../components/score-display"
import { CategoryBar } from "../components/category-bar"
import { IssueList } from "../components/issue-list"
import { NextLevelCard } from "../components/next-level-card"
import { TierTeasers } from "../components/tier-teasers"
import { ResultSection } from "../components/result-section"

type PageProps = {
  params: Promise<{ domain: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  const decoded = decodeURIComponent(domain)
  return {
    title: `Agent-readiness score voor ${decoded} — Code Lieshout`,
    description: `Hoe klaar is ${decoded} voor AI-agents? Bekijk de scan-score en verbeterpunten.`,
    robots: { index: false },
  }
}

export default async function ScanResultPage({ params }: PageProps) {
  const { domain: rawDomain } = await params
  const domain = decodeURIComponent(rawDomain).toLowerCase()

  const row = await getLatestScanByDomain(domain)
  if (!row || row.status !== "done" || !row.raw) {
    notFound()
  }

  const parsed = IsItAgentReadyResponseSchema.safeParse(row.raw)
  if (!parsed.success) {
    notFound()
  }

  const summary = summarize(parsed.data)
  const categories: CategorySummary[] = summary.categories
  const issues: IssueEntry[] = summary.issues
  const coreIssues = issues.filter((i) => i.category !== "commerce")
  const commerceIssues = issues.filter((i) => i.category === "commerce")

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
        <div>
          <p
            className="uppercase text-xs tracking-widest mb-1"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          >
            Agent-readiness scan
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
          id="score"
          title="Jouw score"
          description="Gebaseerd op vindbaarheid, content, bot-toegang en protocol-ontdekking."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="space-y-8">
            <ScoreDisplay
              score={summary.score}
              level={summary.level}
              levelName={summary.levelName}
            />
            <CategoryBar categories={categories} />
          </div>
        </ResultSection>

        <NextLevelCard nextLevel={parsed.data.nextLevel} />

        <ResultSection
          id="checks"
          title="Kern-standaarden"
          description="De 14 standaarden die AI-agents gebruiken om jouw site te vinden, begrijpen en te benaderen. Deze bepalen je score."
          icon={<ExclamationTriangleIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <IssueList issues={coreIssues} groupByCategory />
        </ResultSection>

        {commerceIssues.length > 0 && (
          <ResultSection
            id="commerce"
            title="Commerce-protocollen (optioneel)"
            description="Deze 5 protocollen zijn relevant als je via je site betalingen of transacties aanbiedt aan AI-agents. Ze tellen niet mee voor je score."
            icon={<CardStackIcon className="w-10 h-10 md:w-12 md:h-12" />}
          >
            <IssueList issues={commerceIssues} />
          </ResultSection>
        )}

        <ResultSection
          id="pakketten"
          title="Aan de slag"
          description="Van rapport tot volledig implementatie-dossier — zo kom je naar 100/100."
          icon={<RocketIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <TierTeasers />
        </ResultSection>

        <div className="text-center">
          <Link
            href="/agent-ready"
            className="inline-block px-6 py-3 rounded-lg border-[3px] bg-white font-semibold uppercase tracking-wide text-sm"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              borderColor: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Scan nog een site
          </Link>
        </div>

        <div className="h-8" />
      </div>
      <StickyFooter />
    </div>
  )
}
