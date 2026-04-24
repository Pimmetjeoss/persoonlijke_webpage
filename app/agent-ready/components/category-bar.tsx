import type { CategorySummary } from "@/lib/agent-ready/scoring"

type CategoryBarProps = {
  categories: CategorySummary[]
}

export function CategoryBar({ categories }: CategoryBarProps) {
  const sorted = [...categories].sort((a, b) => {
    if (a.key === "commerce") return 1
    if (b.key === "commerce") return -1
    return 0
  })
  return (
    <div className="space-y-4">
      {sorted.map((cat) => {
        const isOptional = cat.key === "commerce"
        const denominator = cat.total
        const barPercentage =
          denominator === 0 ? 0 : Math.round((cat.pass / denominator) * 100)

        return (
          <div key={cat.key}>
            <div className="flex justify-between items-baseline mb-1 gap-2 flex-wrap">
              <span
                className="uppercase text-sm font-bold tracking-wide flex items-center gap-2"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {cat.label}
                {isOptional && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest"
                    style={{
                      backgroundColor: "hsl(141 78.9% 85.1%)",
                      color: "hsl(144.9 80.4% 10%)",
                    }}
                  >
                    OPTIONEEL
                  </span>
                )}
              </span>
              <span className="text-sm text-gray-600">
                {cat.pass}/{denominator} checks
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden border-[2px]"
              style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${barPercentage}%`,
                  backgroundColor: isOptional
                    ? "hsl(141 78.9% 85.1%)"
                    : "hsl(142.1 76.2% 36.3%)",
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
