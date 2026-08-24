/**
 * Bewegingssolver van de rol: een zware veer-demper die naar een doelpunt
 * toe rolt, plus een ringbuffer met het afgelegde pad.
 *
 * Het pad wordt bemonsterd op afstand, nooit op tijd. Daardoor blijft de
 * papierstrook gelijkmatig, ook als de framerate schommelt.
 */

import { DAMPING, MAX_POINTS, MAX_SPEED, PATH_STEP, SPRING } from "./roll-config"

/** Eén bemonsterd punt van het afgelegde pad. */
export interface PathPoint {
  x: number
  z: number
  /** Totale afgelegde afstand tot dit punt. */
  s: number
}

/**
 * Ringbuffer met padpunten. Vast geheugenbudget, geen allocaties per frame.
 */
export class PathHistory {
  private readonly xs = new Float32Array(MAX_POINTS)
  private readonly zs = new Float32Array(MAX_POINTS)
  private readonly ss = new Float32Array(MAX_POINTS)
  private head = -1
  private length = 0

  /** Aantal opgeslagen punten. */
  get count(): number {
    return this.length
  }

  /** Voegt een punt toe; overschrijft het oudste als de buffer vol is. */
  push(x: number, z: number, s: number): void {
    this.head = (this.head + 1) % MAX_POINTS
    this.xs[this.head] = x
    this.zs[this.head] = z
    this.ss[this.head] = s
    if (this.length < MAX_POINTS) this.length++
  }

  /**
   * Leest punt `index` (0 = oudste, count-1 = nieuwste) in `out`.
   * Schrijft in een bestaand object om allocaties te vermijden.
   */
  read(index: number, out: PathPoint): void {
    const k =
      (this.head - (this.length - 1) + index + MAX_POINTS * 2) % MAX_POINTS
    out.x = this.xs[k]
    out.z = this.zs[k]
    out.s = this.ss[k]
  }

  /** X van het nieuwste punt. */
  get lastX(): number {
    return this.xs[this.head]
  }

  /** Z van het nieuwste punt. */
  get lastZ(): number {
    return this.zs[this.head]
  }
}

/** Interpoleert tussen twee hoeken via de kortste weg. */
export function angleLerp(a: number, b: number, t: number): number {
  let delta = b - a
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return a + delta * t
}

/** De veranderlijke toestand van de rol. */
export interface RollState {
  posX: number
  posZ: number
  velX: number
  velZ: number
  targetX: number
  targetZ: number
  /** Kijkrichting in radialen. */
  yaw: number
  /** Totaal afgelegde afstand — bepaalt hoeveel er geprint is. */
  distance: number
}

/** Maakt een verse begintoestand aan. */
export function createRollState(): RollState {
  return {
    posX: 0,
    posZ: 0,
    velX: 0,
    velZ: 0,
    targetX: 0,
    targetZ: 0,
    yaw: 0,
    distance: 0,
  }
}

/**
 * Zet de simulatie één stap vooruit en bemonstert het pad indien nodig.
 *
 * @param state Wordt ter plekke bijgewerkt.
 * @param history Ringbuffer die het spoor bijhoudt.
 * @param dt Tijdstap in seconden.
 */
export function stepMotion(
  state: RollState,
  history: PathHistory,
  dt: number,
): void {
  // Veer naar het doel, met demping op de snelheid.
  const accX = (state.targetX - state.posX) * SPRING - state.velX * DAMPING
  const accZ = (state.targetZ - state.posZ) * SPRING - state.velZ * DAMPING

  state.velX += accX * dt
  state.velZ += accZ * dt

  const speed = Math.hypot(state.velX, state.velZ)
  if (speed > MAX_SPEED) {
    const scale = MAX_SPEED / speed
    state.velX *= scale
    state.velZ *= scale
  }

  const deltaX = state.velX * dt
  const deltaZ = state.velZ * dt
  const moved = Math.hypot(deltaX, deltaZ)
  if (moved <= 1e-6) return

  state.posX += deltaX
  state.posZ += deltaZ
  state.distance += moved

  // Draai mee met de rijrichting, maar alleen bij noemenswaardige snelheid —
  // anders gaat de rol trillen als de snelheid door nul heen gaat.
  if (speed > 0.06) {
    const targetYaw = Math.atan2(state.velX, state.velZ)
    state.yaw = angleLerp(state.yaw, targetYaw, 1 - Math.exp(-7 * dt))
  }

  // Bemonster op afstand, niet op tijd.
  const gapX = state.posX - history.lastX
  const gapZ = state.posZ - history.lastZ
  if (gapX * gapX + gapZ * gapZ >= PATH_STEP * PATH_STEP) {
    history.push(state.posX, state.posZ, state.distance)
  }
}
