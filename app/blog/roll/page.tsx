"use client"

/**
 * /werk — een oneindig rollende papierstrook die het portfolio print.
 *
 * De rol volgt de muis en print in zijn spoor projectkaarten. Klikken op een
 * kaart opent het project via de bestaande paginatransitie.
 */

import { useCallback, useState, useSyncExternalStore } from "react"

import StickyHeader from "@/app/components/sticky-header"
import { useTransition } from "@/app/components/transition_provider"
import PaperRoll from "./components/paper-roll"
import RollHud from "./components/roll-hud"
import SelectedProjectPanel from "./components/selected-project-panel"
import { projects, type Project } from "./data/projects"

/** Apparaten zonder zweefaanwijzer, oftewel touchscreens. */
const TOUCH_QUERY = "(hover: none), (pointer: coarse)"

/** Leest of dit apparaat met aanraking bediend wordt. */
function getIsTouch(): boolean {
  return window.matchMedia(TOUCH_QUERY).matches
}

/** Abonneert op wisselingen, bijvoorbeeld als een muis wordt aangesloten. */
function subscribeToPointerType(onChange: () => void): () => void {
  const query = window.matchMedia(TOUCH_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

export default function WerkPage() {
  const { startTransition } = useTransition()
  const [printed, setPrinted] = useState(0)
  const [hovered, setHovered] = useState<Project | null>(null)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<Project | null>(null)

  /**
   * Of dit apparaat met aanraking bediend wordt. Bepaalt of een tik op een
   * kaart direct navigeert (muis) of eerst selecteert (touch).
   *
   * De serversnapshot is `false`, zodat server en client dezelfde markup
   * opleveren; na hydratie geldt de echte mediaquery.
   */
  const isTouch = useSyncExternalStore(
    subscribeToPointerType,
    getIsTouch,
    () => false,
  )

  // Stabiele callbacks, zodat de 3D-scène niet opnieuw opgebouwd wordt.
  const handleHover = useCallback((project: Project | null) => {
    setHovered(project)
  }, [])
  const handlePrinted = useCallback((count: number) => {
    setPrinted(count)
  }, [])
  const handlePaused = useCallback((next: boolean) => {
    setPaused(next)
  }, [])

  const handleSelect = useCallback((project: Project | null) => {
    setSelected(project)
  }, [])

  const handleOpenSelected = useCallback(() => {
    if (!selected?.href) return
    if (selected.href.startsWith("http")) {
      window.open(selected.href, "_blank", "noopener,noreferrer")
      return
    }
    startTransition(selected.href)
  }, [selected, startTransition])

  const handleDismissSelected = useCallback(() => {
    setSelected(null)
  }, [])

  const handleBack = useCallback(() => {
    startTransition("/portfolio")
  }, [startTransition])

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[hsl(140.6_84.2%_92.5%)]">
      {/* Geen `startExpanded`: deze pagina scrollt niet, dus de header zou
          anders altijd volledig uitgeklapt blijven staan. Zonder die vlag staat
          hij half in beeld en schuift hij bij hover volledig open — hetzelfde
          gedrag als op /webdesign zodra je daar gescrold hebt. */}
      <StickyHeader title="WERK" />

      <PaperRoll
        projects={projects}
        onHoverChange={handleHover}
        onPrintedChange={handlePrinted}
        onPausedChange={handlePaused}
        onSelectChange={handleSelect}
        selectOnly={isTouch}
      />

      <RollHud
        printed={printed}
        hovered={hovered}
        paused={paused}
        isTouch={isTouch}
        hasSelection={selected !== null}
      />

      {/* Terugknop, gecentreerd boven de rol. Eigen laag met pointer events,
          omdat de HUD eromheen bewust niet klikbaar is. Verbergt zich zodra
          het selectiepaneel diezelfde ruimte inneemt. */}
      {!selected && (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-20 flex justify-center">
          <button
            type="button"
            onClick={handleBack}
            data-award-hover
            className="pointer-events-auto inline-flex rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] bg-[hsl(140.6_84.2%_92.5%)] px-5 py-3 font-semibold text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(141_78.9%_85.1%)]"
          >
            Terug naar portfolio
          </button>
        </div>
      )}

      <SelectedProjectPanel
        project={selected}
        onOpen={handleOpenSelected}
        onDismiss={handleDismissSelected}
      />

      {/* Tekstuele fallback voor zoekmachines en schermlezers: de canvas zelf
          bevat geen leesbare inhoud. */}
      <div className="sr-only">
        <h1>Werk van Code Lieshout</h1>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              {project.href ? (
                <a href={project.href}>
                  {project.client} — {project.title}
                </a>
              ) : (
                <span>
                  {project.client} — {project.title}
                </span>
              )}
              <span> {project.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
