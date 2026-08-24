"use client"

/**
 * Het paneel dat verschijnt zodra een bezoeker een project aantikt.
 *
 * Op een touchscreen bestaat geen zweven, dus kan de bezoeker niet zien wat
 * hij aanraakt. Daarom is selecteren daar een aparte stap: dit paneel toont
 * welk project geraakt is en pas de knop erin opent het.
 */

import type { Project } from "../data/projects"

interface SelectedProjectPanelProps {
  /** Het geselecteerde project, of null als er niets geselecteerd is. */
  project: Project | null
  /** Opent het geselecteerde project. */
  onOpen: () => void
  /** Sluit het paneel zonder te openen. */
  onDismiss: () => void
}

const INK = "hsl(144.9 80.4% 10%)"

export default function SelectedProjectPanel({
  project,
  onOpen,
  onDismiss,
}: SelectedProjectPanelProps) {
  if (!project) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 p-4 pb-6"
      role="dialog"
      aria-label={`Geselecteerd project: ${project.client}`}
    >
      <div
        className="mx-auto w-full max-w-md rounded-2xl border-[3px] bg-white p-5 shadow-2xl"
        style={{ borderColor: INK }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "hsl(142.8 64.2% 24.1%)" }}
            >
              {project.discipline}
            </p>
            <h2
              className="mt-1 font-[family-name:var(--font-fjalla-one)] text-2xl uppercase leading-tight"
              style={{ color: INK }}
            >
              {project.client}
            </h2>
          </div>

          {/* Ruime raakzone: op een telefoon is een klein kruisje lastig te
              raken zonder de rol eronder te verschuiven. */}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Selectie sluiten"
            className="-mr-2 -mt-2 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-2xl leading-none transition-colors hover:bg-[hsl(140.6_84.2%_92.5%)]"
            style={{ color: INK }}
          >
            &times;
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {project.description}
        </p>

        {project.href ? (
          <button
            type="button"
            onClick={onOpen}
            className="mt-4 flex w-full items-center justify-center rounded-full border-[3px] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] transition-colors hover:bg-[hsl(141_78.9%_85.1%)]"
            style={{ borderColor: INK, color: INK }}
          >
            Open project &rarr;
          </button>
        ) : (
          <p className="mt-4 text-sm italic text-gray-500">
            Dit project heeft nog geen pagina.
          </p>
        )}
      </div>
    </div>
  )
}
