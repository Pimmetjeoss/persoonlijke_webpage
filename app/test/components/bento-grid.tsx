"use client"

import { ComponentPropsWithoutRef, ReactNode, useState } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/app/test/components/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background?: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
  hoverColor?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[8rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  hoverColor = "hsl(141 78.9% 85.1%)",
  ...props
}: BentoCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      "border-[3px]",
      "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "dark:[box-shadow:0_0_0_1px_rgba(255,255,255,.05),0_2px_4px_rgba(0,0,0,.2),0_12px_24px_rgba(0,0,0,.2)]",
      "transform-gpu transition-colors duration-300",
      className
    )}
    style={{
      backgroundColor: isHovered ? hoverColor : "white",
      borderColor: "hsl(144.9 80.4% 10%)"
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
        <Icon
          className="h-8 w-8 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75"
          style={{ color: isHovered ? "white" : "hsl(144.9 80.4% 10%)" }}
        />
        <h3
          className="text-xl font-semibold uppercase transition-colors duration-300"
          style={{ fontFamily: "var(--font-fjalla-one)", color: isHovered ? "white" : "hsl(144.9 80.4% 10%)" }}
        >
          {name}
        </h3>
        <p
          className="max-w-lg transition-colors duration-300"
          style={{ color: isHovered ? "rgba(255,255,255,0.8)" : "rgb(163 163 163)" }}
        >
          {description}
        </p>
      </div>

      <div
        className={cn(
          "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden"
        )}
      >
        <Button
          variant="link"
          asChild
          size="sm"
          className="pointer-events-auto p-0"
        >
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault()
              document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
      )}
    >
      <Button
        variant="link"
        asChild
        size="sm"
        className="pointer-events-auto p-0"
      >
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault()
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
  )
}

export { BentoCard, BentoGrid }
