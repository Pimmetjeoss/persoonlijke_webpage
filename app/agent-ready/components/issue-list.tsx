import type { IssueEntry } from "@/lib/agent-ready/scoring"

type IssueListProps = {
  issues: IssueEntry[]
  groupByCategory?: boolean
}

const BADGE: Record<IssueEntry["status"], { label: string; bg: string; fg: string }> = {
  fail: { label: "ACTIE NODIG", bg: "#b91c1c", fg: "white" },
  pass: { label: "OK", bg: "hsl(142.1 76.2% 36.3%)", fg: "white" },
  neutral: { label: "N.V.T.", bg: "hsl(141 78.9% 85.1%)", fg: "hsl(144.9 80.4% 10%)" },
  unableToCheck: { label: "NIET TE CHECKEN", bg: "#a16207", fg: "white" },
}

const CATEGORY_ORDER = [
  "discoverability",
  "contentAccessibility",
  "botAccessControl",
  "discovery",
  "commerce",
] as const

const STATUS_ORDER: Record<IssueEntry["status"], number> = {
  fail: 0,
  unableToCheck: 1,
  neutral: 2,
  pass: 3,
}

function IssueRow({ issue, showCategory }: { issue: IssueEntry; showCategory: boolean }) {
  const badge = BADGE[issue.status]
  return (
    <li
      className="py-4 flex items-start gap-4 border-b last:border-b-0"
      style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
    >
      <span
        className="shrink-0 text-[10px] font-bold px-2 py-1 rounded tracking-widest mt-1"
        style={{ backgroundColor: badge.bg, color: badge.fg }}
      >
        {badge.label}
      </span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h3
            className="text-lg md:text-xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {issue.title}
          </h3>
          {showCategory && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {issue.categoryLabel}
            </span>
          )}
        </div>
        {issue.message && (
          <p className="text-sm text-gray-600 mt-1">{issue.message}</p>
        )}
      </div>
    </li>
  )
}

export function IssueList({ issues, groupByCategory = false }: IssueListProps) {
  if (!groupByCategory) {
    return (
      <ul className="divide-y" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} showCategory />
        ))}
      </ul>
    )
  }

  const groups = new Map<string, IssueEntry[]>()
  for (const issue of issues) {
    const list = groups.get(issue.category) ?? []
    list.push(issue)
    groups.set(issue.category, list)
  }

  const orderedKeys = CATEGORY_ORDER.filter((k) => groups.has(k))

  return (
    <div className="space-y-8">
      {orderedKeys.map((key) => {
        const groupIssues = [...(groups.get(key) ?? [])].sort(
          (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
        )
        const label = groupIssues[0]?.categoryLabel ?? key
        return (
          <div key={key}>
            <h3
              className="uppercase text-sm font-bold tracking-widest mb-2 pb-2 border-b-2"
              style={{
                color: "hsl(144.9 80.4% 10%)",
                borderColor: "hsl(144.9 80.4% 10%)",
                fontFamily: "var(--font-fjalla-one)",
              }}
            >
              {label}
            </h3>
            <ul className="divide-y" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
              {groupIssues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} showCategory={false} />
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
