type ScoreDisplayProps = {
  score: number
  level: number
  levelName: string
}

export function ScoreDisplay({ score, level, levelName }: ScoreDisplayProps) {
  const circumference = 2 * Math.PI * 70
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
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
            {score}
          </span>
          <span className="text-sm text-gray-600">van 100</span>
        </div>
      </div>

      <div className="text-center md:text-left">
        <p
          className="uppercase text-xs tracking-widest mb-1"
          style={{ color: "hsl(142.1 76.2% 36.3%)" }}
        >
          Level {level} / 5
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold"
          style={{
            color: "hsl(144.9 80.4% 10%)",
            fontFamily: "var(--font-fjalla-one)",
          }}
        >
          {levelName}
        </h2>
        <p className="text-gray-700 mt-2 max-w-md">
          Jouw website&apos;s agent-readiness score, gebaseerd op 14 checks over
          4 categorieën.
        </p>
      </div>
    </div>
  )
}
