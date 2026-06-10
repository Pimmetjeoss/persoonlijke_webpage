type ScoreCircleProps = {
  score: number
}

export function ScoreCircle({ score }: ScoreCircleProps) {
  const normalized = Math.max(0, Math.min(100, score))
  const circumference = 2 * Math.PI * 70
  const dash = (normalized / 100) * circumference

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
            stroke="hsl(141 78.9% 85.1%)"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="hsl(142.1 76.2% 36.3%)"
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
