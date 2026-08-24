/**
 * De papierstrook: één mesh met een vast vertexbudget dat elk frame op zijn
 * plek herschreven wordt. Geen allocaties in de renderloop.
 *
 * De strook bestaat uit drie delen die naadloos in elkaar overlopen:
 *  1. het platte spoor dat al op de vloer ligt,
 *  2. een brug naar het punt waar de rol de vloer raakt,
 *  3. de krul die nog om de rol heen zit.
 */

import * as THREE from "three"

import {
  CURL_MAX,
  CURL_SEGMENTS,
  MAX_SEGMENTS,
  RIBBON_WIDTH,
  ROLL_RADIUS,
} from "./roll-config"
import type { PathHistory, PathPoint, RollState } from "./motion"

/** Alles wat nodig is om de strook te tekenen en bij te werken. */
export interface RibbonHandle {
  mesh: THREE.Mesh
  geometry: THREE.BufferGeometry
  /** Uniform waarmee de staart in de vloer oplost. */
  tailUniform: { value: number }
  dispose(): void
}

/** Bouwt het mesh met vaste buffers en een index die nooit verandert. */
export function createRibbon(
  material: THREE.Material,
  vertexCount: number = (MAX_SEGMENTS + 1) * 2,
): RibbonHandle {
  const positions = new Float32Array(vertexCount * 3)
  const normals = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)
  const distances = new Float32Array(vertexCount)
  const indices = new Uint16Array(MAX_SEGMENTS * 6)

  // Twee driehoeken per segment; deze volgorde verandert nooit.
  for (let i = 0; i < MAX_SEGMENTS; i++) {
    const v0 = i * 2
    indices[i * 6 + 0] = v0
    indices[i * 6 + 1] = v0 + 1
    indices[i * 6 + 2] = v0 + 2
    indices[i * 6 + 3] = v0 + 1
    indices[i * 6 + 4] = v0 + 3
    indices[i * 6 + 5] = v0 + 2
  }

  const geometry = new THREE.BufferGeometry()
  const dynamic = (attr: THREE.BufferAttribute) =>
    attr.setUsage(THREE.DynamicDrawUsage)

  geometry.setAttribute(
    "position",
    dynamic(new THREE.BufferAttribute(positions, 3)),
  )
  geometry.setAttribute("normal", dynamic(new THREE.BufferAttribute(normals, 3)))
  geometry.setAttribute("uv", dynamic(new THREE.BufferAttribute(uvs, 2)))
  geometry.setAttribute("aS", dynamic(new THREE.BufferAttribute(distances, 1)))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.setDrawRange(0, 0)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  mesh.receiveShadow = true

  return {
    mesh,
    geometry,
    tailUniform: { value: 0 },
    dispose() {
      geometry.dispose()
    },
  }
}

/** Schrijfhulp voor één vertex. Buiten de hot loop gehouden voor leesbaarheid. */
function writeVertex(
  buffers: {
    positions: Float32Array
    normals: Float32Array
    uvs: Float32Array
    distances: Float32Array
  },
  index: number,
  x: number,
  y: number,
  z: number,
  nx: number,
  ny: number,
  nz: number,
  u: number,
  v: number,
  s: number,
): void {
  const p3 = index * 3
  const p2 = index * 2
  buffers.positions[p3] = x
  buffers.positions[p3 + 1] = y
  buffers.positions[p3 + 2] = z
  buffers.normals[p3] = nx
  buffers.normals[p3 + 1] = ny
  buffers.normals[p3 + 2] = nz
  buffers.uvs[p2] = u
  buffers.uvs[p2 + 1] = v
  buffers.distances[index] = s
}

/** Hergebruikte leesobjecten, zodat rebuild niets alloceert. */
const pointA: PathPoint = { x: 0, z: 0, s: 0 }
const pointB: PathPoint = { x: 0, z: 0, s: 0 }
const pointC: PathPoint = { x: 0, z: 0, s: 0 }

/**
 * Herschrijft de strook voor de huidige toestand.
 *
 * @param cardSpan Lengte van één volledige atlas op de strook.
 */
export function rebuildRibbon(
  handle: RibbonHandle,
  history: PathHistory,
  state: RollState,
  cardSpan: number,
): void {
  const { geometry } = handle
  const count = history.count
  if (count < 2) {
    geometry.setDrawRange(0, 0)
    return
  }

  const buffers = {
    positions: geometry.attributes.position.array as Float32Array,
    normals: geometry.attributes.normal.array as Float32Array,
    uvs: geometry.attributes.uv.array as Float32Array,
    distances: geometry.attributes.aS.array as Float32Array,
  }

  history.read(0, pointA)
  const tailDistance = pointA.s
  const halfWidth = RIBBON_WIDTH / 2
  // Houd de UV-basis bij een veelvoud van de atlas, anders verliest een
  // float na lang rollen zijn precisie.
  const uvBase = Math.floor(tailDistance / cardSpan) * cardSpan

  // Voorwaartse richting uit de gedempte yaw — stabieler dan uit de snelheid.
  const forwardX = Math.sin(state.yaw)
  const forwardZ = Math.cos(state.yaw)
  const sideX = forwardZ
  const sideZ = -forwardX

  let vertex = 0
  let prevTanX = 0
  let prevTanZ = 0
  let hasPrevTangent = false

  // ---- 1. Het platte spoor op de vloer ----
  for (let i = 0; i < count; i++) {
    history.read(i, pointB)

    let tanX: number
    let tanZ: number
    if (i === count - 1) {
      tanX = forwardX
      tanZ = forwardZ
    } else {
      history.read(i > 0 ? i - 1 : 0, pointA)
      history.read(i + 1, pointC)
      tanX = pointC.x - pointA.x
      tanZ = pointC.z - pointA.z
    }

    const tanLength = Math.hypot(tanX, tanZ)
    if (tanLength < 1e-4) {
      // Bij een keerpunt vallen twee punten samen; hergebruik de vorige richting.
      tanX = hasPrevTangent ? prevTanX : forwardX
      tanZ = hasPrevTangent ? prevTanZ : forwardZ
    } else {
      tanX /= tanLength
      tanZ /= tanLength
    }

    // Laat de strook nooit door een omklap heen draaien.
    if (hasPrevTangent && tanX * prevTanX + tanZ * prevTanZ < 0) {
      tanX = prevTanX
      tanZ = prevTanZ
    }
    prevTanX = tanX
    prevTanZ = tanZ
    hasPrevTangent = true

    const segSideX = tanZ
    const segSideZ = -tanX

    // Laat de staart smal toelopen, zodat hergebruik van de buffer niet opvalt.
    let width = halfWidth
    const fromTail = pointB.s - tailDistance
    if (fromTail < 3.0) width *= fromTail / 3.0

    // Nieuwer papier ligt bovenop; de kop krijgt extra lucht zodat vers papier
    // over een net gepasseerde plek geen z-fighting geeft.
    let y = 0.012 + (pointB.s - tailDistance) * 0.0008
    const headBlend = 1 - (state.distance - pointB.s) / 1.5
    if (headBlend > 0) y += 0.0035 * headBlend

    const u = (pointB.s - uvBase) / cardSpan
    const s = pointB.s - uvBase

    writeVertex(buffers, vertex++, pointB.x + segSideX * width, y, pointB.z + segSideZ * width, 0, 1, 0, u, 0, s)
    writeVertex(buffers, vertex++, pointB.x - segSideX * width, y, pointB.z - segSideZ * width, 0, 1, 0, u, 1, s)
  }

  // ---- 2. Brug naar het actuele contactpunt ----
  const contactY = 0.012 + (state.distance - tailDistance) * 0.0008 + 0.0035
  const contactU = (state.distance - uvBase) / cardSpan
  const contactS = state.distance - uvBase

  writeVertex(buffers, vertex++, state.posX + sideX * halfWidth, contactY, state.posZ + sideZ * halfWidth, 0, 1, 0, contactU, 0, contactS)
  writeVertex(buffers, vertex++, state.posX - sideX * halfWidth, contactY, state.posZ - sideZ * halfWidth, 0, 1, 0, contactU, 1, contactS)

  // ---- 3. De krul om de rol ----
  // Dit is de voorkant van de rol: de kaart die daar naar beneden rolt is
  // precies de kaart die de atlas daar toont, dus de overgang is naadloos.
  for (let j = 1; j <= CURL_SEGMENTS; j++) {
    const theta = (j / CURL_SEGMENTS) * CURL_MAX
    const radius = ROLL_RADIUS + 0.012
    const px = state.posX + forwardX * Math.sin(theta) * radius
    const pz = state.posZ + forwardZ * Math.sin(theta) * radius
    const py = contactY + radius * (1 - Math.cos(theta))

    // Normaal van het papiervlak, continu met het platte spoor bij theta = 0.
    const nx = -forwardX * Math.sin(theta)
    const ny = Math.cos(theta)
    const nz = -forwardZ * Math.sin(theta)

    const sHere = state.distance + theta * ROLL_RADIUS
    const u = (sHere - uvBase) / cardSpan
    const s = sHere - uvBase

    writeVertex(buffers, vertex++, px + sideX * halfWidth, py, pz + sideZ * halfWidth, nx, ny, nz, u, 0, s)
    writeVertex(buffers, vertex++, px - sideX * halfWidth, py, pz - sideZ * halfWidth, nx, ny, nz, u, 1, s)
  }

  const segments = vertex / 2 - 1
  geometry.setDrawRange(0, segments * 6)
  geometry.attributes.position.needsUpdate = true
  geometry.attributes.normal.needsUpdate = true
  geometry.attributes.uv.needsUpdate = true
  geometry.attributes.aS.needsUpdate = true

  handle.tailUniform.value = tailDistance - uvBase
}
