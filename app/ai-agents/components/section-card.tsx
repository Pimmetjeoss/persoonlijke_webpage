"use client"

import { cn } from "@/lib/utils"

interface SectionCardProps {
  id: string
  title: string
  description: string
  Icon: React.ComponentType<{ className?: string }>
  className?: string
  children?: React.ReactNode
}

export function SectionCard({
  id,
  title,
  description,
  Icon,
  className,
  children,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full rounded-xl border-[3px] bg-white p-8 md:p-12",
        "shadow-xl",
        "scroll-mt-32",
        className
      )}
      style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
    >
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0" style={{ color: "hsl(144.9 80.4% 10%)" }}>
          <Icon className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <div className="flex-1">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
          >
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            {description}
          </p>
          {children ? (
            <div className="text-gray-500">{children}</div>
          ) : (
            <div className="text-gray-500">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
