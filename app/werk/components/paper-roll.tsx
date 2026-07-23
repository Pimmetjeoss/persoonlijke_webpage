"use client"

/**
 * De papierrol: een zware rol die over de vloer rijdt en in zijn spoor een
 * oneindige strook met projectkaarten print.
 *
 * De rol volgt de muis. Klikken op een geprinte kaart opent het bijbehorende
 * project; klikken op de lege vloer pauzeert de rol.
 */

import { useEffect, useRef, useSyncExternalStore } from "react"
import * as THREE from "three"

import { useTransition } from "@/app/components/transition_provider"
import type { Project } from "../data/projects"
import { buildAtlasCanvas } from "../lib/atlas"
import { buildBlobCanvas, buildCapCanvas } from "../lib/textures"
import {
  createRollState,
  PathHistory,
  stepMotion,
  type RollState,
} from "../lib/motion"
import { createRibbon, rebuildRibbon, type RibbonHandle } from "../lib/ribbon"
import {
  cardLength,
  FLOOR_COLOR,
  FLOOR_RGB_GLSL,
  INNER_RADIUS,
  RIBBON_WIDTH,
  ROLL_RADIUS,
  SCENE_BACKGROUND,
} from "../lib/roll-config"

interface PaperRollProps {
  projects: Project[]
  /** Meldt welke kaart onder de muis ligt, zodat de UI dat kan tonen. */
  onHoverChange?: (project: Project | null) => void
  /** Meldt hoeveel kaarten er inmiddels geprint zijn. */
  onPrintedChange?: (printed: number) => void
  /** Meldt of de rol gepauzeerd is. */
  onPausedChange?: (paused: boolean) => void
}

/** Uitkomst van de WebGL-check; één keer bepaald en daarna hergebruikt. */
let webglProbeResult: boolean | null = null

/**
 * Controleert of de browser WebGL aankan.
 *
 * Het antwoord wordt gecached omdat dit als snapshot voor
 * `useSyncExternalStore` dient: die moet bij elke aanroep dezelfde waarde
 * teruggeven zolang er niets verandert.
 */
function supportsWebGL(): boolean {
  if (webglProbeResult !== null) return webglProbeResult

  try {
    const probe = document.createElement("canvas")
    webglProbeResult = Boolean(
      probe.getContext("webgl2") ?? probe.getContext("webgl"),
    )
  } catch {
    webglProbeResult = false
  }
  return webglProbeResult
}

/** De WebGL-ondersteuning verandert nooit, dus er valt niets te abonneren. */
function subscribeToNothing(): () => void {
  return () => {}
}

/** Zet een canvas om in een sRGB-textuur met maximale anisotropie. */
function toTexture(
  canvas: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return texture
}

export default function PaperRoll({
  projects,
  onHoverChange,
  onPrintedChange,
  onPausedChange,
}: PaperRollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { startTransition, isTransitioning } = useTransition()

  // Tijdens een paginaovergang legt de renderloop het werk stil: de 3D-scène
  // verbruikt anders zoveel frametijd dat de GSAP-animatie van de overgang
  // nauwelijks vooruitkomt.
  const isTransitioningRef = useRef(isTransitioning)

  useEffect(() => {
    isTransitioningRef.current = isTransitioning
  }, [isTransitioning])

  // Callbacks via refs, zodat de renderloop niet opnieuw opgebouwd wordt als
  // de ouder een nieuwe functie-instantie doorgeeft.
  const hoverRef = useRef(onHoverChange)
  const printedRef = useRef(onPrintedChange)
  const pausedRef = useRef(onPausedChange)
  const navigateRef = useRef<(href: string) => void>(() => {})

  useEffect(() => {
    hoverRef.current = onHoverChange
    printedRef.current = onPrintedChange
    pausedRef.current = onPausedChange
  }, [onHoverChange, onPrintedChange, onPausedChange])

  useEffect(() => {
    navigateRef.current = (href: string) => {
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer")
      } else {
        startTransition(href)
      }
    }
  }, [startTransition])

  /**
   * Of WebGL bruikbaar is. De serversnapshot is `true`, zodat server en client
   * dezelfde markup opleveren; na hydratie geldt de echte browsercheck.
   */
  const webglSupported = useSyncExternalStore(
    subscribeToNothing,
    supportsWebGL,
    () => true,
  )

  useEffect(() => {
    if (!webglSupported) return

    const canvas: HTMLCanvasElement | null = canvasRef.current
    if (!canvas || projects.length === 0) return
    // Vaste referentie voor de renderloop; `canvasRef.current` kan later null worden.
    const stage: HTMLCanvasElement = canvas

    // Respecteer de voorkeur voor minder beweging.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const renderer = new THREE.WebGLRenderer({ canvas: stage, antialias: true })

    const CARD_LENGTH = cardLength(projects.length)
    const ATLAS_SPAN = CARD_LENGTH * projects.length
    const REVOLUTION = 2 * Math.PI * ROLL_RADIUS

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(SCENE_BACKGROUND)
    scene.fog = new THREE.Fog(SCENE_BACKGROUND, 24, 58)

    const camera = new THREE.PerspectiveCamera(
      32,
      window.innerWidth / window.innerHeight,
      0.5,
      200,
    )

    // ---------- Licht ----------
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc3e9d0, 0.95))

    const sun = new THREE.DirectionalLight(0xffffff, 0.85)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -9
    sun.shadow.camera.right = 9
    sun.shadow.camera.top = 9
    sun.shadow.camera.bottom = -9
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 40
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.02
    scene.add(sun)
    scene.add(sun.target)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.22)
    fillLight.position.set(-6, 4, -8)
    scene.add(fillLight)

    // ---------- Vloer ----------
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: FLOOR_COLOR,
      roughness: 1.0,
      metalness: 0,
    })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // ---------- Texturen ----------
    // Het atlas-canvas wordt één keer getekend en door twee texturen gedeeld:
    // één voor de strook, één voor de romp (met een eigen offset).
    const atlasCanvas = buildAtlasCanvas(projects)
    const atlasTexture = toTexture(atlasCanvas, renderer)
    atlasTexture.wrapS = THREE.RepeatWrapping
    atlasTexture.wrapT = THREE.ClampToEdgeWrapping

    const capTexture = toTexture(
      buildCapCanvas(ROLL_RADIUS, INNER_RADIUS),
      renderer,
    )
    const blobTexture = new THREE.CanvasTexture(buildBlobCanvas())

    // ---------- De rol ----------
    const rollGroup = new THREE.Group() // positie en koers
    const spinner = new THREE.Group() // draait om zijn lokale X-as
    rollGroup.add(spinner)
    scene.add(rollGroup)

    // De romp draagt dezelfde atlas. Omdat de omtrek gelijk is aan de
    // atlaslengte zit de print vast op het mesh, en is de kaart die de vloer
    // raakt altijd exact de kaart die daar geprint wordt.
    const barrelTexture = toTexture(atlasCanvas, renderer)
    barrelTexture.wrapS = THREE.RepeatWrapping
    barrelTexture.wrapT = THREE.ClampToEdgeWrapping
    barrelTexture.repeat.set(1, 1)
    barrelTexture.offset.x = 0.25

    const barrelMaterial = new THREE.MeshStandardMaterial({
      map: barrelTexture,
      roughness: 0.92,
      metalness: 0,
    })
    const barrelGeometry = new THREE.CylinderGeometry(
      ROLL_RADIUS,
      ROLL_RADIUS,
      RIBBON_WIDTH,
      96,
      1,
      true,
    )
    barrelGeometry.rotateZ(Math.PI / 2)
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial)
    barrel.castShadow = true
    spinner.add(barrel)

    // Zijkanten met de spiraal van gewonden lagen.
    const capMaterial = new THREE.MeshStandardMaterial({
      map: capTexture,
      roughness: 0.95,
      metalness: 0,
    })
    const capGeometry = new THREE.RingGeometry(INNER_RADIUS, ROLL_RADIUS, 96, 1)

    const capRight = new THREE.Mesh(capGeometry, capMaterial)
    capRight.rotation.y = Math.PI / 2
    capRight.position.x = RIBBON_WIDTH / 2 + 0.001
    capRight.castShadow = true
    spinner.add(capRight)

    const capLeft = new THREE.Mesh(capGeometry, capMaterial)
    capLeft.rotation.y = -Math.PI / 2
    capLeft.position.x = -RIBBON_WIDTH / 2 - 0.001
    capLeft.castShadow = true
    spinner.add(capLeft)

    // De kartonnen kern.
    const coreGeometry = new THREE.CylinderGeometry(
      INNER_RADIUS,
      INNER_RADIUS,
      RIBBON_WIDTH * 1.002,
      48,
      1,
      true,
    )
    coreGeometry.rotateZ(Math.PI / 2)
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xbfe3cb,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    })
    spinner.add(new THREE.Mesh(coreGeometry, coreMaterial))

    // Zachte schaduw die met de rol meeloopt.
    const blobGeometry = new THREE.PlaneGeometry(
      ROLL_RADIUS * 3.4,
      RIBBON_WIDTH * 2.2,
    )
    const blobMaterial = new THREE.MeshBasicMaterial({
      map: blobTexture,
      transparent: true,
      depthWrite: false,
    })
    const blob = new THREE.Mesh(blobGeometry, blobMaterial)
    blob.rotation.x = -Math.PI / 2
    blob.renderOrder = 1
    scene.add(blob)

    // ---------- De strook ----------
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      map: atlasTexture,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    })

    const ribbon: RibbonHandle = createRibbon(ribbonMaterial)

    // De staart lost op in de vloerkleur vlak voordat hij hergebruikt wordt.
    ribbonMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTailS = ribbon.tailUniform
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nattribute float aS;\nvarying float vS;",
        )
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvS = aS;")
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying float vS;\nuniform float uTailS;",
        )
        .replace(
          "#include <map_fragment>",
          "#include <map_fragment>\n" +
            "float tail = smoothstep(uTailS, uTailS + 3.0, vS);\n" +
            `diffuseColor.rgb = mix(${FLOOR_RGB_GLSL}, diffuseColor.rgb, tail);`,
        )
    }
    scene.add(ribbon.mesh)

    // ---------- Toestand ----------
    const state: RollState = createRollState()
    const history = new PathHistory()
    history.push(0, 0, 0)

    // ---------- Invoer ----------
    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2(0, 0)
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const hitPoint = new THREE.Vector3()

    let pointerActive = false
    let lastPointerTime = -1e9
    let autoAngle = Math.PI * 0.25
    let paused = false

    function handlePointer(event: PointerEvent | TouchEvent) {
      let clientX: number | undefined
      let clientY: number | undefined

      if ("touches" in event && event.touches.length) {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else if ("clientX" in event) {
        clientX = event.clientX
        clientY = event.clientY
      }
      if (clientX === undefined || clientY === undefined) return

      pointerNdc.x = (clientX / window.innerWidth) * 2 - 1
      pointerNdc.y = -(clientY / window.innerHeight) * 2 + 1
      pointerActive = true
      lastPointerTime = performance.now()
    }

    /**
     * Bepaalt welk project onder de muis ligt door de strook te raycasten en
     * de U-coördinaat terug te rekenen naar een kaartindex.
     */
    function projectUnderPointer(): Project | null {
      if (!pointerActive) return null
      raycaster.setFromCamera(pointerNdc, camera)
      const hits = raycaster.intersectObject(ribbon.mesh, false)
      if (!hits.length || !hits[0].uv) return null

      // De atlas loopt van 0..1 over alle kaarten; U kan buiten dat bereik
      // vallen omdat de strook doorloopt, dus terugvouwen naar één atlas.
      const u = hits[0].uv.x
      const wrapped = ((u % 1) + 1) % 1
      // De atlas is horizontaal gespiegeld, dus U loopt tegengesteld aan de
      // volgorde in `projects`.
      const index = Math.floor((1 - wrapped) * projects.length)
      return projects[Math.min(index, projects.length - 1)] ?? null
    }

    let hovered: Project | null = null

    function setPaused(next: boolean) {
      paused = next
      pausedRef.current?.(next)
    }

    // Klik = kaart openen of pauzeren; slepen telt niet als klik.
    let downX = 0
    let downY = 0
    let downTime = 0

    function handlePointerDown(event: PointerEvent) {
      downX = event.clientX
      downY = event.clientY
      downTime = performance.now()
      handlePointer(event)
    }

    function handlePointerUp(event: PointerEvent) {
      // Klikken op bedienelementen (zoals de terugknop) mag de rol niet
      // pauzeren; die liggen boven het canvas.
      if (event.target !== stage) return

      const dx = event.clientX - downX
      const dy = event.clientY - downY
      const wasDrag = dx * dx + dy * dy >= 64
      const wasSlow = performance.now() - downTime >= 450
      if (wasDrag || wasSlow) return

      const target = projectUnderPointer()
      if (target?.href) {
        navigateRef.current(target.href)
        return
      }
      setPaused(!paused)
    }

    window.addEventListener("pointermove", handlePointer, { passive: true })
    window.addEventListener("pointerdown", handlePointerDown, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    window.addEventListener("touchmove", handlePointer, { passive: true })
    window.addEventListener("touchstart", handlePointer, { passive: true })

    /** Stuurt de rol: naar de muis, of anders zwervend op de automaat. */
    function updateTarget(elapsed: number, dt: number) {
      const idle = performance.now() - lastPointerTime > 3200
      if (pointerActive && !idle) {
        raycaster.setFromCamera(pointerNdc, camera)
        if (raycaster.ray.intersectPlane(floorPlane, hitPoint)) {
          state.targetX = hitPoint.x
          state.targetZ = hitPoint.z
        }
        return
      }

      // Zwervende automaat — altijd in beweging, nooit in een rechte lijn.
      autoAngle +=
        dt *
        (0.34 +
          0.5 * Math.sin(elapsed * 0.31) +
          0.3 * Math.sin(elapsed * 0.113 + 2.1))
      state.targetX = state.posX + Math.sin(autoAngle) * 5.2
      state.targetZ = state.posZ + Math.cos(autoAngle) * 5.2
    }

    // ---------- Camera ----------
    const camOffset = new THREE.Vector3(7.6, 8.8, 10.8)
    const camPos = new THREE.Vector3()
    const lookAt = new THREE.Vector3(0, 0.6, 0)
    const desired = new THREE.Vector3()
    // Start uitgezoomd en zoom rustig in als intro.
    const intro = { zoom: reducedMotion ? 1 : 1.5 }

    function updateCamera(dt: number) {
      desired.set(state.posX, 0, state.posZ).addScaledVector(camOffset, intro.zoom)
      const k = 1 - Math.exp(-2.6 * dt)
      camPos.lerp(desired, k)
      desired.set(state.posX, 0.55, state.posZ)
      lookAt.lerp(desired, k)
      camera.position.copy(camPos)
      camera.lookAt(lookAt)
    }

    // ---------- Voorloop: leg alvast een spoor neer ----------
    let prerollTime = 0
    for (let i = 0; i < 560; i++) {
      prerollTime += 1 / 60
      autoAngle +=
        (1 / 60) *
        (0.34 +
          0.5 * Math.sin(prerollTime * 0.31) +
          0.3 * Math.sin(prerollTime * 0.113 + 2.1))
      state.targetX = state.posX + Math.sin(autoAngle) * 5.2
      state.targetZ = state.posZ + Math.cos(autoAngle) * 5.2
      stepMotion(state, history, 1 / 60)
    }
    camPos.set(state.posX, 0, state.posZ).addScaledVector(camOffset, intro.zoom)
    lookAt.set(state.posX, 0.55, state.posZ)

    // ---------- Renderloop ----------
    const clock = new THREE.Clock()
    let elapsed = 0
    let animationId = 0
    let lastPrinted = -1
    let introProgress = reducedMotion ? 1 : 0

    function frame() {
      animationId = requestAnimationFrame(frame)
      const dt = Math.min(clock.getDelta(), 1 / 30)
      elapsed += dt

      // Tijdens een paginaovergang niets tekenen: de overgangsanimatie dekt
      // het scherm toch af, en zo houdt die alle frametijd voor zichzelf.
      if (isTransitioningRef.current) return

      // Introzoom uitvloeien (vervangt de GSAP-tween uit het origineel).
      if (introProgress < 1) {
        introProgress = Math.min(1, introProgress + dt / 2.2)
        const eased = 1 - Math.pow(1 - introProgress, 3)
        intro.zoom = 1.5 + (1 - 1.5) * eased
      }

      if (!paused) {
        updateTarget(elapsed, dt)
        stepMotion(state, history, dt)

        rollGroup.position.set(state.posX, ROLL_RADIUS, state.posZ)
        rollGroup.rotation.y = state.yaw
        spinner.rotation.x = (state.distance % REVOLUTION) / ROLL_RADIUS

        rebuildRibbon(ribbon, history, state, ATLAS_SPAN)

        blob.position.set(state.posX, 0.006, state.posZ)
        blob.rotation.z = state.yaw - Math.PI / 2

        // Vloer, licht en schaduw reizen mee, zodat de scène eindeloos lijkt.
        floor.position.set(state.posX, 0, state.posZ)
        sun.position.set(state.posX + 5, 10, state.posZ + 4)
        sun.target.position.set(state.posX, 0, state.posZ)
      }

      updateCamera(dt)

      const printed = Math.floor(state.distance / CARD_LENGTH)
      if (printed !== lastPrinted) {
        lastPrinted = printed
        printedRef.current?.(printed)
      }

      const nowHovered = projectUnderPointer()
      if (nowHovered?.id !== hovered?.id) {
        hovered = nowHovered
        hoverRef.current?.(nowHovered)
        stage.style.cursor = nowHovered?.href ? "pointer" : "grab"
      }

      renderer.render(scene, camera)
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    frame()

    // ---------- Opruimen ----------
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("pointermove", handlePointer)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("touchmove", handlePointer)
      window.removeEventListener("touchstart", handlePointer)
      window.removeEventListener("resize", handleResize)

      ribbon.dispose()
      barrelGeometry.dispose()
      capGeometry.dispose()
      coreGeometry.dispose()
      blobGeometry.dispose()
      floor.geometry.dispose()

      ribbonMaterial.dispose()
      barrelMaterial.dispose()
      capMaterial.dispose()
      coreMaterial.dispose()
      blobMaterial.dispose()
      floorMaterial.dispose()

      atlasTexture.dispose()
      barrelTexture.dispose()
      capTexture.dispose()
      blobTexture.dispose()

      renderer.dispose()
    }
  }, [projects, webglSupported])

  // Zonder WebGL — en tijdens server-rendering — tonen we dezelfde projecten
  // als gewone lijst, zodat de pagina bruikbaar en vindbaar blijft.
  if (!webglSupported) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <p className="mb-8 text-sm text-[hsl(142.8_64.2%_24.1%)]">
          De interactieve versie van deze pagina heeft WebGL nodig. Hieronder
          staat hetzelfde werk als lijst.
        </p>
        <ul className="divide-y-2 divide-[hsl(144.9_80.4%_10%)] border-t-2 border-[hsl(144.9_80.4%_10%)]">
          {projects.map((project) => (
            <li key={project.id} className="py-5">
              <a
                className="group block"
                href={project.href ?? "#"}
                aria-disabled={project.href ? undefined : true}
              >
                <span className="font-[family-name:var(--font-fjalla-one)] text-2xl uppercase text-[hsl(144.9_80.4%_10%)] group-hover:underline">
                  {project.client}
                </span>
                <span className="mt-1 block text-[hsl(142.8_64.2%_24.1%)]">
                  {project.title} — {project.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block h-full w-full cursor-grab active:cursor-grabbing"
      aria-label="Interactieve weergave van projecten"
    />
  )
}
