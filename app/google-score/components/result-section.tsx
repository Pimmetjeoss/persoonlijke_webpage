import { ReactNode } from "react"

interface ResultSectionProps {
  id: string
  title: string
  description: string
  icon?: ReactNode
  children: ReactNode
}

export function ResultSection({
  id,
  title,
  description,
  icon,
  children,
}: ResultSectionProps) {
  return (
    <section id={id} className="space-y-4">
      <div className="flex items-center gap-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div>
          <h2
            className="text-xl md:text-2xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {title}
          </h2>
          <p className="text-xs text-gray-600 max-w-xl">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </section>
  )
}
