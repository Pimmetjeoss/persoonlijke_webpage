/**
 * Bouwt de textuur-atlas voor de papierrol: één canvas met alle projectkaarten
 * naast elkaar. De rol en de afgerolde strook delen deze atlas, waardoor de
 * kaart op de rol exact overgaat in de kaart op de vloer.
 *
 * Alles wordt procedureel getekend in de merkkleuren — er zijn geen
 * schermafbeeldingen nodig. Optioneel kan per project een `image` meegegeven
 * worden; die wordt dan ingeladen en over de kaart getekend.
 */

import type { Project } from "../data/projects"
import { PAPER } from "../data/projects"

/** Resolutie per kaart in de atlas. */
export const CELL_SIZE = 512

/** Inspringing van de kaart binnen zijn cel. */
const MARGIN = 30

/** Deterministische pseudo-random, zodat de papiervezel elke render gelijk is. */
function createRandom(initialSeed: number) {
  let seed = initialSeed
  return function random() {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

/** Het rechthoekige vlak van één kaart binnen de atlas. */
interface CardFrame {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Tekenhulpjes, gebonden aan één canvascontext.
 * Bewust klein gehouden zodat elke layout-functie kort blijft.
 */
function createPainter(g: CanvasRenderingContext2D, random: () => number) {
  /** Zet tekst in de merkfont (Fjalla One, met veilige fallbacks). */
  function display(
    x: number,
    y: number,
    text: string,
    color: string,
    size: number,
  ) {
    g.fillStyle = color
    g.font = `${size}px "Fjalla One", "Bebas Neue", Impact, sans-serif`
    g.fillText(text.toUpperCase(), x, y)
  }

  /** Klein bijschrift in monospace. */
  function caption(
    x: number,
    y: number,
    text: string,
    color: string = PAPER.muted,
    size: number = 11,
  ) {
    g.fillStyle = color
    g.font = `600 ${size}px "SF Mono", Menlo, Consolas, monospace`
    g.fillText(text, x, y)
  }

  /** Suggestie van bodytekst: een blokje van korte balkjes. */
  function textBars(
    x: number,
    y: number,
    width: number,
    lines: number,
    lineHeight: number,
    color: string = "#c6dbcd",
  ) {
    g.fillStyle = color
    for (let row = 0; row < lines; row++) {
      const barWidth = width * (0.55 + random() * 0.45)
      g.fillRect(x, y + row * lineHeight, barWidth, Math.max(2, lineHeight * 0.42))
    }
  }

  /** Abstracte "foto": kleurverloop met losse vlakken erover. */
  function abstractPhoto(
    x: number,
    y: number,
    w: number,
    h: number,
    from: string,
    to: string,
  ) {
    const gradient = g.createLinearGradient(x, y, x + w, y + h)
    gradient.addColorStop(0, from)
    gradient.addColorStop(1, to)
    g.fillStyle = gradient
    g.fillRect(x, y, w, h)

    for (let i = 0; i < 9; i++) {
      const bw = w * (0.08 + random() * 0.3)
      const bh = h * (0.1 + random() * 0.5)
      const bx = x + random() * (w - bw)
      const by = y + h - bh - random() * h * 0.25
      const tint = random() < 0.5 ? "5,46,22" : "245,252,247"
      g.fillStyle = `rgba(${tint},${(0.12 + random() * 0.3).toFixed(3)})`
      g.fillRect(bx, by, bw, bh)
    }

    const highlight = g.createLinearGradient(x, y, x, y + h * 0.5)
    highlight.addColorStop(0, "rgba(255,255,255,0.28)")
    highlight.addColorStop(1, "rgba(255,255,255,0)")
    g.fillStyle = highlight
    g.fillRect(x, y, w, h * 0.5)
  }

  /** Tekst die netjes afbreekt binnen een maximale breedte. */
  function wrappedText(
    x: number,
    y: number,
    text: string,
    maxWidth: number,
    lineHeight: number,
    color: string,
    size: number,
  ) {
    g.fillStyle = color
    g.font = `${size}px "Fjalla One", "Bebas Neue", Impact, sans-serif`
    const words = text.split(" ")
    let line = ""
    let cursorY = y

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (g.measureText(candidate).width > maxWidth && line) {
        g.fillText(line, x, cursorY)
        line = word
        cursorY += lineHeight
      } else {
        line = candidate
      }
    }
    if (line) g.fillText(line, x, cursorY)
    return cursorY
  }

  return { display, caption, textBars, abstractPhoto, wrappedText }
}

type Painter = ReturnType<typeof createPainter>

/** Tekent de kop van een kaart: klantnaam links, jaartal rechts. */
function drawHeader(
  g: CanvasRenderingContext2D,
  p: Painter,
  f: CardFrame,
  project: Project,
) {
  p.display(f.x + 22, f.y + 40, project.client, PAPER.ink, 22)
  if (project.year) {
    g.textAlign = "right"
    p.caption(f.x + f.w - 22, f.y + 38, project.year)
    g.textAlign = "left"
  }
}

/** Tekent de voet van een kaart: discipline links, omschrijving eronder. */
function drawFooter(p: Painter, f: CardFrame, project: Project) {
  p.caption(f.x + 22, f.y + f.h - 26, project.discipline, PAPER.muted, 11)
}

/** De layout-varianten. Elke functie vult één kaart. */
const layouts: Record<
  Project["layout"],
  (
    g: CanvasRenderingContext2D,
    p: Painter,
    f: CardFrame,
    project: Project,
  ) => void
> = {
  hero(g, p, f, project) {
    drawHeader(g, p, f, project)
    const blockY = f.y + 58
    const blockH = f.h - 168
    g.fillStyle = project.accent
    g.fillRect(f.x + 22, blockY, f.w - 44, blockH)

    g.fillStyle = "rgba(5,46,22,0.85)"
    g.beginPath()
    g.arc(f.x + f.w / 2, blockY + blockH / 2, blockH * 0.31, 0, Math.PI * 2)
    g.fill()

    g.fillStyle = "rgba(255,255,255,0.9)"
    g.fillRect(f.x + 44, blockY + blockH * 0.68, f.w - 200, 5)

    p.wrappedText(
      f.x + 22,
      f.y + f.h - 74,
      project.title,
      f.w - 60,
      26,
      PAPER.ink,
      24,
    )
    drawFooter(p, f, project)
  },

  shot(g, p, f, project) {
    p.abstractPhoto(
      f.x + 20,
      f.y + 20,
      f.w - 40,
      f.h * 0.58,
      project.accent,
      PAPER.ink,
    )
    const textTop = f.y + f.h * 0.58 + 52
    p.display(f.x + 22, textTop, project.client, PAPER.ink, 24)
    p.wrappedText(
      f.x + 22,
      textTop + 30,
      project.title,
      f.w - 60,
      24,
      PAPER.muted,
      19,
    )
    drawFooter(p, f, project)
  },

  type(g, p, f, project) {
    p.display(f.x + 26, f.y + 150, project.client, PAPER.ink, 76)
    g.fillStyle = project.accent
    g.fillRect(f.x + 30, f.y + 176, 66, 10)
    p.wrappedText(
      f.x + 30,
      f.y + 236,
      project.title,
      f.w - 80,
      30,
      PAPER.ink,
      26,
    )
    p.textBars(f.x + 30, f.y + f.h - 120, f.w - 90, 4, 20)
    drawFooter(p, f, project)
  },

  grid(g, p, f, project) {
    drawHeader(g, p, f, project)
    const shades = [
      project.accent,
      PAPER.ink,
      "#4ade80",
      "#166534",
      "#86efac",
      "#15a34a",
    ]
    const cellW = (f.w - 44 - 24) / 3
    const cellH = (f.h - 190) / 2

    for (let i = 0; i < 6; i++) {
      const gx = f.x + 22 + (i % 3) * (cellW + 12)
      const gy = f.y + 62 + Math.floor(i / 3) * (cellH + 12)
      p.abstractPhoto(gx, gy, cellW, cellH, shades[i], PAPER.ink)
    }

    p.wrappedText(
      f.x + 22,
      f.y + f.h - 66,
      project.title,
      f.w - 60,
      24,
      PAPER.ink,
      20,
    )
    drawFooter(p, f, project)
  },

  device(g, p, f, project) {
    g.fillStyle = project.accent
    g.fillRect(f.x + 20, f.y + f.h * 0.58, f.w - 40, f.h * 0.42 - 20)
    p.display(f.x + 24, f.y + 44, project.client, PAPER.ink, 22)
    p.textBars(f.x + 24, f.y + 60, f.w * 0.55, 2, 14)

    const dw = f.w * 0.44
    const dh = f.h * 0.52
    const dx = f.x + f.w / 2 - dw / 2
    const dy = f.y + f.h * 0.3

    g.save()
    g.shadowColor = "rgba(5,46,22,0.35)"
    g.shadowBlur = 18
    g.shadowOffsetY = 8
    g.fillStyle = PAPER.ink
    g.fillRect(dx, dy, dw, dh)
    g.restore()

    g.fillStyle = PAPER.card
    g.fillRect(dx + 8, dy + 8, dw - 16, dh - 16)
    p.abstractPhoto(
      dx + 8,
      dy + 8,
      dw - 16,
      (dh - 16) * 0.5,
      project.accent,
      "#166534",
    )
    p.textBars(dx + 16, dy + 12 + (dh - 16) * 0.5 + 8, dw - 44, 4, 12)

    p.caption(f.x + 26, f.y + f.h - 32, project.title, "rgba(5,46,22,0.8)", 12)
    drawFooter(p, f, project)
  },

  quote(g, p, f, project) {
    g.fillStyle = project.accent
    g.fillRect(f.x + 20, f.y + 20, f.w - 40, f.h - 40)

    g.fillStyle = "rgba(5,46,22,0.9)"
    g.font = `120px "Fjalla One", Georgia, serif`
    g.fillText("“", f.x + 44, f.y + 140)

    p.wrappedText(
      f.x + 46,
      f.y + 190,
      project.description,
      f.w - 100,
      34,
      PAPER.ink,
      27,
    )
    p.display(f.x + 46, f.y + f.h - 74, project.client, "rgba(5,46,22,0.75)", 20)
    p.caption(
      f.x + 46,
      f.y + f.h - 46,
      project.discipline,
      "rgba(5,46,22,0.6)",
      11,
    )
  },

  closing(g, p, f, project) {
    g.fillStyle = PAPER.ink
    g.fillRect(f.x + 20, f.y + 20, f.w - 40, f.h - 40)

    g.strokeStyle = "rgba(187,247,208,0.3)"
    g.lineWidth = 1
    for (let i = 0; i < 6; i++) {
      g.beginPath()
      g.moveTo(f.x + 44, f.y + 74 + i * 26)
      g.lineTo(f.x + f.w - 44, f.y + 74 + i * 26)
      g.stroke()
    }

    g.fillStyle = project.accent
    g.beginPath()
    g.arc(f.x + f.w - 78, f.y + 100, 16, 0, Math.PI * 2)
    g.fill()

    p.display(f.x + 44, f.y + f.h - 96, project.client, "#f0fdf4", 44)
    p.caption(
      f.x + 44,
      f.y + f.h - 58,
      project.title,
      "rgba(240,253,244,0.65)",
      12,
    )
  },
}

/**
 * Tekent de basis van de papierstrook: vlakke kleur met lichte vezelstructuur.
 */
function paintPaperBase(
  g: CanvasRenderingContext2D,
  width: number,
  height: number,
  random: () => number,
) {
  g.fillStyle = PAPER.base
  g.fillRect(0, 0, width, height)

  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(90,120,100,${(0.015 + random() * 0.03).toFixed(3)})`
    g.fillRect(random() * width, random() * height, 1 + random() * 2, 1)
  }
}

/** Tekent het kaartvlak met schaduw en dunne rand, en geeft de maten terug. */
function paintCardFrame(g: CanvasRenderingContext2D, cellX: number): CardFrame {
  const frame: CardFrame = {
    x: cellX + MARGIN,
    y: MARGIN,
    w: CELL_SIZE - MARGIN * 2,
    h: CELL_SIZE - MARGIN * 2,
  }

  g.save()
  g.shadowColor = "rgba(5,46,22,0.10)"
  g.shadowBlur = 14
  g.shadowOffsetY = 3
  g.fillStyle = PAPER.card
  g.fillRect(frame.x, frame.y, frame.w, frame.h)
  g.restore()

  g.strokeStyle = "rgba(5,46,22,0.10)"
  g.lineWidth = 1
  g.strokeRect(frame.x + 0.5, frame.y + 0.5, frame.w - 1, frame.h - 1)

  return frame
}

/** Verticaal indexlabel rechtsonder op de kaart, bijv. "03/008". */
function paintIndexTag(
  g: CanvasRenderingContext2D,
  p: Painter,
  frame: CardFrame,
  index: number,
  total: number,
) {
  g.save()
  g.translate(frame.x + frame.w - 12, frame.y + frame.h - 14)
  g.rotate(-Math.PI / 2)
  const label = `${String(index).padStart(2, "0")}/${String(total).padStart(3, "0")}`
  p.caption(0, 0, label, "#9ab5a5", 11)
  g.restore()
}

/** Spiegelt een canvas horizontaal en geeft een nieuw canvas terug. */
function mirrorHorizontally(source: HTMLCanvasElement): HTMLCanvasElement {
  const mirrored = document.createElement("canvas")
  mirrored.width = source.width
  mirrored.height = source.height

  const g = mirrored.getContext("2d")
  if (!g) throw new Error("Kon de projectatlas niet spiegelen")

  g.translate(source.width, 0)
  g.scale(-1, 1)
  g.drawImage(source, 0, 0)

  return mirrored
}

/**
 * Bouwt het atlas-canvas voor de meegegeven projecten.
 *
 * Geeft het canvas terug; de aanroeper maakt er een THREE.CanvasTexture van.
 * Wordt los gehouden van Three.js zodat het zelfstandig te testen is.
 */
export function buildAtlasCanvas(projects: Project[]): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = CELL_SIZE * projects.length
  canvas.height = CELL_SIZE

  const g = canvas.getContext("2d")
  if (!g) {
    throw new Error("Kon geen 2D-context maken voor de projectatlas")
  }

  const random = createRandom(7)
  const painter = createPainter(g, random)

  paintPaperBase(g, canvas.width, canvas.height, random)

  projects.forEach((project, index) => {
    const frame = paintCardFrame(g, index * CELL_SIZE)
    g.save()
    // Kaarten mogen niet buiten hun eigen cel tekenen.
    g.beginPath()
    g.rect(frame.x, frame.y, frame.w, frame.h)
    g.clip()
    layouts[project.layout](g, painter, frame, project)
    g.restore()
    paintIndexTag(g, painter, frame, index + 1, projects.length)
  })

  // De strook loopt tegengesteld aan de tekenrichting van het canvas, dus
  // zonder deze spiegeling zou alle tekst in spiegelbeeld geprint worden.
  return mirrorHorizontally(canvas)
}
