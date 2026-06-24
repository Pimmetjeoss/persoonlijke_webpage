type ScoreCircleProps = {
  score: number
  tone?: "green" | "orange" | "red"
}

const TONE_COLORS = {
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
} as const

export function ScoreCircle({ score, tone = "green" }: ScoreCircleProps) {
  const normalized = Math.max(0, Math.min(100, score))
  const circumference = 2 * Math.PI * 70
  const dash = (normalized / 100) * circumference
  const colors = TONE_COLORS[tone]

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
            {normalized}
          </span>
          <span className="text-sm text-gray-600">van 100</span>
        </div>
      </div>
    </div>
  )
}
