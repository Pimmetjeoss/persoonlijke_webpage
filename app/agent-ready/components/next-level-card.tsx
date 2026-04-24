import { checkLabel } from "@/lib/agent-ready/scoring"
import type { IsItAgentReadyResponse } from "@/lib/agent-ready/schemas"

type NextLevelCardProps = {
  nextLevel: IsItAgentReadyResponse["nextLevel"]
}

export function NextLevelCard({ nextLevel }: NextLevelCardProps) {
  if (!nextLevel || !nextLevel.requirements?.length) return null

  const preview = nextLevel.requirements.slice(0, 2)
  const remaining = nextLevel.requirements.length - preview.length

  return (
    <div
      className="rounded-xl border-[3px] p-6 md:p-8"
      style={{
        borderColor: "hsl(144.9 80.4% 10%)",
        backgroundColor: "hsl(141 78.9% 85.1%)",
      }}
    >
      <p
        className="uppercase text-xs tracking-widest mb-1"
        style={{ color: "hsl(142.1 76.2% 36.3%)" }}
      >
        Volgend niveau: Level {nextLevel.target}
      </p>
      <h3
        className="text-3xl md:text-4xl font-bold mb-4"
        style={{
          color: "hsl(144.9 80.4% 10%)",
          fontFamily: "var(--font-fjalla-one)",
        }}
      >
        {nextLevel.name ?? "Volgend niveau"}
      </h3>
      <ul className="space-y-3">
        {preview.map((req) => (
          <li
            key={req.check}
            className="flex items-start gap-3 text-sm md:text-base"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
          >
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
              style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)" }}
            >
              →
            </span>
            <span>
              <strong>{checkLabel(req.check)}:</strong>{" "}
              {req.description ?? req.shortPrompt ?? ""}
            </span>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <p className="mt-4 text-sm italic text-gray-700">
          + nog {remaining} verbeterpunt{remaining === 1 ? "" : "en"} in het
          volledige rapport.
        </p>
      )}
    </div>
  )
}
