"use client"

import Image from "next/image"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { useTransition } from "@/app/components/transition_provider"

export default function UnderConstruction() {
  const { startTransition } = useTransition()

  return (
    <div
      className="min-h-screen pb-16"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader title="Under Construction" startExpanded />

      <main className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
        <div className="max-w-5xl w-full flex flex-col items-center gap-8">
          <Image
            src="/Whisk_986f23e4543de7a857f41974abea4234dr-removebg-preview.png"
            alt="Under construction cactus"
            width={1000}
            height={1000}
            className="w-[576px] h-[576px] md:w-[768px] md:h-[768px] lg:w-[1000px] lg:h-[1000px] object-contain -mt-32 md:-mt-48 lg:-mt-64"
            priority
          />

          <span
            onClick={() => startTransition("/portfolio")}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight underline cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
          >
            Home
          </span>

          <div
            className="w-full rounded-xl border-[3px] bg-white p-8 md:p-12 shadow-xl"
            style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ color: "hsl(144.9 80.4% 10%)" }}
            >
              Dit project is al gerealiseerd, maar deze pagina is nog in de maak.
              Door de vele andere projecten ben ik er nog niet aan toegekomen om
              hier een mooie showcase van te maken.
              <br /><br />
              Wil je meer weten over dit project?{" "}
              <span
                onClick={() => startTransition("/contact")}
                className="underline cursor-pointer hover:opacity-80 transition-opacity"
              >
                Neem gerust contact met me op!
              </span>
            </h2>
          </div>
        </div>
      </main>

      <StickyFooter />
    </div>
  )
}
