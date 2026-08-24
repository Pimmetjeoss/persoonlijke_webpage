"use client"

/**
 * De overlay boven de papierrol: merknaam, teller, hint en de naam van het
 * project waar de muis op staat.
 *
 * Puur presentatie — alle waarden komen van de pagina, die ze van de rol krijgt.
 */

import type { Project } from "../lib/project"

interface RollHudProps {
  /** Aantal geprinte kaarten. */
  printed: number
  /** Project onder de muis, of null. */
  hovered: Project | null
  /** Of de rol stilstaat. */
  paused: boolean
  /** Of het apparaat met aanraking bediend wordt. */
  isTouch?: boolean
  /** Of er een project geselecteerd is; dan neemt het paneel het over. */
  hasSelection?: boolean
}

/** Getal met voorloopnullen, bijv. 42 -> "0042". */
function pad4(value: number): string {
  return String(value).padStart(4, "0")
}

const INK = "hsl(144.9 80.4% 10%)"
const MUTED = "hsl(142.8 64.2% 24.1%)"

export default function RollHud({
  printed,
  hovered,
  paused,
  isTouch = false,
  hasSelection = false,
}: RollHudProps) {
  // Zodra het selectiepaneel opent, verdwijnen teller en hint: op een smal
  // scherm zouden ze anders achter het paneel doorlopen.
  if (hasSelection) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      {/* Merk linksboven */}
      <div className="absolute left-6 top-24 flex items-baseline gap-3 md:left-10">
        <span
          className="font-[family-name:var(--font-fjalla-one)] text-2xl tracking-tight md:text-3xl"
          style={{ color: INK }}
        >
          CODE LIESHOUT
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: MUTED }}
        >
          Blog
        </span>
      </div>

      {/* Editie rechtsboven */}
      <div
        className="absolute right-6 top-24 text-right text-[10px] font-semibold uppercase leading-[1.9] tracking-[0.28em] md:right-10"
        style={{ color: MUTED }}
      >
        Laatste artikelen
        <br />
        <b style={{ color: INK }}>Editie 2024 &mdash; 2026</b>
      </div>

      {/* Teller rechtsonder */}
      <div className="absolute bottom-8 right-6 text-right md:right-10">
        <div
          className="font-[family-name:var(--font-fjalla-one)] text-3xl tabular-nums leading-none md:text-5xl"
          style={{ color: INK }}
        >
          {pad4(printed)}
        </div>
        <div
          className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: MUTED }}
        >
          Pagina&apos;s geprint
        </div>
      </div>

      {/* Hint en hover-informatie linksonder */}
      <div className="absolute bottom-9 left-6 max-w-[70vw] md:left-10">
        {hovered ? (
          <div>
            <div
              className="font-[family-name:var(--font-fjalla-one)] text-xl md:text-2xl"
              style={{ color: INK }}
            >
              {hovered.client}
            </div>
            <div className="mt-1 text-sm" style={{ color: MUTED }}>
              {hovered.description}
            </div>
            {hovered.href && (
              <div
                className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: INK }}
              >
                Klik om te openen
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: MUTED }}
          >
            <span
              className="h-[7px] w-[7px] rounded-full motion-safe:animate-pulse"
              style={{ background: "hsl(142.1 76.2% 36.3%)" }}
            />
            <span>
              {isTouch
                ? paused
                  ? "Tik naast de strook om verder te gaan"
                  : "Sleep om te sturen — tik op een kaart"
                : paused
                  ? "Gepauzeerd — klik om verder te rollen"
                  : "Beweeg om te sturen — klik op een kaart"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
