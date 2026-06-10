import type { ReactNode } from "react"

type ResultSectionProps = {
  id: string
  title: string
  description: string
  icon: ReactNode
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
    <section
      id={id}
      className="w-full rounded-xl border-[3px] bg-white p-8 md:p-12 shadow-xl scroll-mt-32"
      style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
    >
      <div className="flex items-start gap-6">
        <div
          className="flex-shrink-0"
          style={{ color: "hsl(144.9 80.4% 10%)" }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
          >
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">{description}</p>
          <div>{children}</div>
        </div>
      </div>
    </section>
  )
}
