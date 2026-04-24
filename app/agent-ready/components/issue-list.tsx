import type { IssueEntry } from "@/lib/agent-ready/scoring"

type IssueListProps = {
  issues: IssueEntry[]
}

const BADGE: Record<IssueEntry["status"], { label: string; bg: string; fg: string }> = {
  fail: { label: "ACTIE NODIG", bg: "#b91c1c", fg: "white" },
  pass: { label: "OK", bg: "hsl(142.1 76.2% 36.3%)", fg: "white" },
  neutral: { label: "N.V.T.", bg: "hsl(141 78.9% 85.1%)", fg: "hsl(144.9 80.4% 10%)" },
  unableToCheck: { label: "NIET TE CHECKEN", bg: "#a16207", fg: "white" },
}

export function IssueList({ issues }: IssueListProps) {
  const filtered = issues.filter((i) => i.category !== "commerce")
  return (
    <ul className="divide-y" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
      {filtered.map((issue) => {
        const badge = BADGE[issue.status]
        return (
          <li
            key={issue.id}
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
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {issue.categoryLabel}
                </span>
              </div>
              {issue.message && (
                <p className="text-sm text-gray-600 mt-1">{issue.message}</p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
