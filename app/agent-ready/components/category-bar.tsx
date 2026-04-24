import type { CategorySummary } from "@/lib/agent-ready/scoring"

type CategoryBarProps = {
  categories: CategorySummary[]
}

export function CategoryBar({ categories }: CategoryBarProps) {
  return (
    <div className="space-y-4">
      {categories
        .filter((c) => c.key !== "commerce")
        .map((cat) => (
          <div key={cat.key}>
            <div className="flex justify-between items-baseline mb-1">
              <span
                className="uppercase text-sm font-bold tracking-wide"
                style={{
                  color: "hsl(144.9 80.4% 10%)",
                  fontFamily: "var(--font-fjalla-one)",
                }}
              >
                {cat.label}
              </span>
              <span className="text-sm text-gray-600">
                {cat.pass}/{cat.pass + cat.fail} checks
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden border-[2px]"
              style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: "hsl(142.1 76.2% 36.3%)",
                }}
              />
            </div>
          </div>
        ))}
    </div>
  )
}
