import Link from "next/link"
import {
  BarChartIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  RocketIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons"
import { SectionCard } from "@/app/test/components/section-card"
import type { Report, Issue } from "@/lib/agent-scan/schemas"

type Tone = "green" | "orange" | "red" | "gray"

function toneForScore(score: number | null): Tone {
  if (score === null) return "gray"
  if (score >= 80) return "green"
  if (score >= 60) return "orange"
  return "red"
}

const TONE_COLORS: Record<Tone, { track: string; progress: string }> = {
  green: {
    track: "hsl(141 78.9% 85.1%)",
    progress: "hsl(142.1 76.2% 36.3%)",
  },
  orange: {
    track: "hsl(35 92% 86%)",
    progress: "hsl(32 95% 44%)",
  },
  red: {
    track: "hsl(0 86% 90%)",
    progress: "hsl(0 72% 47%)",
  },
  gray: {
    track: "hsl(0 0% 88%)",
    progress: "hsl(0 0% 60%)",
  },
}

function ScoreCircle({ score }: { score: number | null }) {
  const normalized = score === null ? 0 : Math.max(0, Math.min(100, score))
  const circumference = 2 * Math.PI * 70
  const dash = (normalized / 100) * circumference
  const colors = TONE_COLORS[toneForScore(score)]

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full -rotate-90"
          aria-hidden
        >
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={colors.track}
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={colors.progress}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl md:text-6xl font-bold leading-none"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {score === null ? "—" : Math.round(normalized)}
          </span>
          <span className="text-sm text-gray-600">van 100</span>
        </div>
      </div>
    </div>
  )
}

function BreakdownBar({
  label,
  earned,
  available,
  note,
}: {
  label: string
  earned: number
  available: number
  note: string
}) {
  const pct =
    available > 0 ? Math.max(0, Math.min(100, (earned / available) * 100)) : 0
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span
          className="font-semibold uppercase tracking-wide text-sm"
          style={{ color: "hsl(144.9 80.4% 10%)" }}
        >
          {label}
        </span>
        <span className="text-sm text-gray-700">{note}</span>
      </div>
      <div
        className="h-4 rounded-full overflow-hidden border-2"
        style={{
          borderColor: "hsl(144.9 80.4% 10%)",
          backgroundColor: "hsl(141 78.9% 85.1%)",
        }}
      >
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            backgroundColor: "hsl(142.1 76.2% 36.3%)",
          }}
        />
      </div>
    </div>
  )
}

function IssueCard({ issue }: { issue: Issue }) {
  const failed = issue.result === "failed"
  return (
    <div
      className="rounded-xl border-2 bg-white p-5"
      style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide text-white whitespace-nowrap"
          style={{
            backgroundColor: failed ? "hsl(0 72% 47%)" : "hsl(32 95% 44%)",
          }}
        >
          {failed ? "Fout" : "Deels"}
        </span>
        <h3
          className="text-lg font-bold leading-snug"
          style={{
            color: "hsl(144.9 80.4% 10%)",
            fontFamily: "var(--font-fjalla-one)",
          }}
        >
          {issue.name}
        </h3>
      </div>
      {issue.details && (
        <p className="mt-3 text-sm text-gray-700">
          <span className="font-semibold">Bewijs:</span> {issue.details}
        </p>
      )}
      {issue.recommendation && (
        <p
          className="mt-2 text-sm font-medium"
          style={{ color: "hsl(142.1 76.2% 36.3%)" }}
        >
          <span className="font-semibold">Fix:</span> {issue.recommendation}
        </p>
      )}
    </div>
  )
}

const TIER_META: Record<
  Issue["tier"],
  { title: string; description: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  essential: {
    title: "Essentiële verbeterpunten",
    description: "Deze checks dragen het zwaarst bij aan je score.",
    Icon: ExclamationTriangleIcon,
  },
  recommended: {
    title: "Aanbevolen verbeterpunten",
    description:
      "Worden actief wanneer je site relevante interfaces aanbiedt (API, MCP, betalingen).",
    Icon: CheckCircledIcon,
  },
  bonus: {
    title: "Bonus (optioneel)",
    description:
      "Extra punten voor opkomende standaarden. Het ontbreken ervan verlaagt je score nooit.",
    Icon: RocketIcon,
  },
}

export function ReportContent({
  domain,
  report,
}: {
  domain: string
  report: Report
}) {
  const { essential, recommended, bonus } = report.score_breakdown
  const byTier = (tier: Issue["tier"]) =>
    report.issues.filter((i) => i.tier === tier)
  const tiers: Issue["tier"][] = ["essential", "recommended", "bonus"]
  const scannedAt = new Date(report.scanned_at)

  return (
    <div className="space-y-10">
      <div>
        <p
          className="uppercase text-xs tracking-widest mb-1"
          style={{ color: "hsl(142.1 76.2% 36.3%)" }}
        >
          Agent-scan · Is Agentic
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
        <p className="mt-2 text-gray-700">
          Gescand op{" "}
          {scannedAt.toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {report.eligible_checks} checks van toepassing ·{" "}
          <a
            href={report.report_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          >
            Volledig rapport op Is Agentic{" "}
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </p>
      </div>

      <SectionCard
        id="score"
        title="Jouw score"
        description={report.score_label}
        Icon={BarChartIcon}
      >
        <div className="space-y-8">
          <ScoreCircle score={report.score} />
          <div className="space-y-4">
            <BreakdownBar
              label="Essentieel"
              earned={essential.earned}
              available={essential.available}
              note={`${essential.passing}/${essential.total} geslaagd`}
            />
            <BreakdownBar
              label="Aanbevolen"
              earned={recommended.earned}
              available={recommended.available}
              note={`${recommended.passing}/${recommended.total} geslaagd`}
            />
            <div className="flex items-baseline justify-between">
              <span
                className="font-semibold uppercase tracking-wide text-sm"
                style={{ color: "hsl(144.9 80.4% 10%)" }}
              >
                Bonus
              </span>
              <span className="text-sm text-gray-700">
                +{bonus.points} punten · {bonus.positive_signals} positieve
                signalen
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {tiers.map((tier) => {
        const issues = byTier(tier)
        if (!issues.length) return null
        const meta = TIER_META[tier]
        return (
          <SectionCard
            key={tier}
            id={tier}
            title={meta.title}
            description={meta.description}
            Icon={meta.Icon}
          >
            <div className="space-y-3">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </SectionCard>
        )
      })}

      {report.issues.length === 0 && (
        <SectionCard
          id="geen-bevindingen"
          title="Geen verbeterpunten"
          description="Deze site slaagt voor alle toepasselijke checks."
          Icon={CheckCircledIcon}
        >
          <p className="text-gray-700">
            Uitstekend! Er zijn geen gezakte of deels gezakte checks gevonden.
          </p>
        </SectionCard>
      )}

      <div className="text-center space-y-4">
        <Link
          href="/agent-scan"
          className="inline-block px-6 py-3 rounded-lg border-[3px] bg-white font-semibold uppercase tracking-wide text-sm"
          style={{
            color: "hsl(144.9 80.4% 10%)",
            borderColor: "hsl(144.9 80.4% 10%)",
            fontFamily: "var(--font-fjalla-one)",
          }}
        >
          Scan nog een site
        </Link>
        <p className="text-xs text-gray-600">
          Scan uitgevoerd door{" "}
          <a
            href="https://is-agentic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Is Agentic
          </a>
          .
        </p>
      </div>
    </div>
  )
}
