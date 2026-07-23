/**
 * Procedurele texturen voor de papierrol: de opgerolde zijkant (spiraal) en
 * de zachte schaduw onder de rol. Beide worden één keer gebouwd.
 */

/** Deterministische pseudo-random, zodat de spiraal elke render gelijk is. */
function createRandom(initialSeed: number) {
  let seed = initialSeed
  return function random() {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

/**
 * De zijkant van de rol: honderden gewonden papierlagen met een spiraalsnede.
 *
 * @param outerRadius Buitenstraal van de rol in wereldeenheden.
 * @param innerRadius Straal van de kern in wereldeenheden.
 */
export function buildCapCanvas(
  outerRadius: number,
  innerRadius: number,
): HTMLCanvasElement {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const g = canvas.getContext("2d")
  if (!g) throw new Error("Kon geen 2D-context maken voor de rolzijkant")

  const random = createRandom(11)
  const center = size / 2
  const innerPx = (innerRadius / outerRadius) * center

  g.fillStyle = "#eef7f1"
  g.fillRect(0, 0, size, size)

  // Gewonden lagen.
  for (let r = innerPx; r < center - 1; r += 2.1) {
    const alpha = 0.045 + random() * 0.1 + (r % 29 < 2.2 ? 0.12 : 0)
    g.strokeStyle = `rgba(80,110,90,${alpha.toFixed(3)})`
    g.lineWidth = random() < 0.12 ? 1.6 : 0.8
    g.beginPath()
    g.arc(center, center, r, 0, Math.PI * 2)
    g.stroke()
  }

  // De spiraalsnede zelf.
  g.strokeStyle = "rgba(60,90,70,0.35)"
  g.lineWidth = 1.4
  g.beginPath()
  const turns = 26
  for (let t = 0; t <= 1; t += 0.002) {
    const radius = innerPx + t * (center - innerPx - 2)
    const angle = t * turns * Math.PI * 2
    const px = center + Math.cos(angle) * radius
    const py = center + Math.sin(angle) * radius
    if (t === 0) g.moveTo(px, py)
    else g.lineTo(px, py)
  }
  g.stroke()

  // Schaduw rond de kern.
  const coreShade = g.createRadialGradient(
    center,
    center,
    innerPx,
    center,
    center,
    innerPx + 90,
  )
  coreShade.addColorStop(0, "rgba(20,60,35,0.32)")
  coreShade.addColorStop(1, "rgba(20,60,35,0)")
  g.fillStyle = coreShade
  g.beginPath()
  g.arc(center, center, center, 0, Math.PI * 2)
  g.fill()

  // Donkere buitenrand.
  const rim = g.createRadialGradient(
    center,
    center,
    center - 26,
    center,
    center,
    center,
  )
  rim.addColorStop(0, "rgba(20,60,35,0)")
  rim.addColorStop(1, "rgba(20,60,35,0.22)")
  g.fillStyle = rim
  g.beginPath()
  g.arc(center, center, center, 0, Math.PI * 2)
  g.fill()

  return canvas
}

/** Zachte ronde schaduw die onder de rol meeloopt. */
export function buildBlobCanvas(): HTMLCanvasElement {
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const g = canvas.getContext("2d")
  if (!g) throw new Error("Kon geen 2D-context maken voor de schaduw")

  const gradient = g.createRadialGradient(
    size / 2,
    size / 2,
    6,
    size / 2,
    size / 2,
    size / 2,
  )
  gradient.addColorStop(0, "rgba(5,46,22,0.34)")
  gradient.addColorStop(0.55, "rgba(5,46,22,0.14)")
  gradient.addColorStop(1, "rgba(5,46,22,0)")
  g.fillStyle = gradient
  g.fillRect(0, 0, size, size)

  return canvas
}
