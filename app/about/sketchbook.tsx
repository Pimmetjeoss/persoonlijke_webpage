'use client'

/**
 * Sketchbook — een pagina-omslaan schetsboek voor de over-mij pagina.
 * Gebaseerd op het paginageometrie-concept van MengTo's open-source
 * sketchbook (github.com/MengTo/sketchbook), opnieuw opgebouwd als React-
 * component en volledig omgebouwd naar de Code Lieshout-identiteit:
 * eigen gegenereerde aquarel-spreads met de cactus-mascotte, groene
 * accentkleuren uit het merk, en Nederlandse teksten.
 *
 * Het omslaande "blad" is een keten van geneste strips waarvan de raaklijn
 * door een boog zwaait, zodat het papier buigt zoals papier buigt.
 */

import { useEffect, useRef, useState } from 'react'

const DIR = '/sketchbook/'

export const SPREADS = [
  { file: 'lieshout.png', title: 'Hola, ik ben Pim', place: 'Lieshout' },
  { file: 'proces.png', title: 'Procesoptimalisatie', place: 'Van chaos naar richting' },
  { file: 'creatief.png', title: 'Creatief bezig zijn', place: 'Van niets iets maken' },
  { file: 'ai.png', title: 'Het AI-virus', place: 'Buiten de gebaande paden' },
  { file: 'codelieshout.png', title: 'Code Lieshout', place: 'Persoonlijk & pragmatisch' },
  { file: 'contact.png', title: 'Neem contact op', place: 'Ik denk met je mee' },
] as const

/**
 * Tekstpagina's: een open spread met links een illustratie en rechts het
 * verhaal in boektypografie. Ze verschijnen als extra pagina's tussen de
 * aquarel-spreads en faden zacht in en uit (het omslaande blad is alleen
 * tussen volledige afbeeldingspagina's te zien).
 */
export const STORY_PAGES: Record<
  string,
  { image: string; heading: string; body: string[] }
> = {
  proces: {
    image: 's-proces.png',
    heading: 'Procesoptimalisatie',
    body: [
      'In mijn werk ben ik altijd gefascineerd geweest door processen: waarom gaat iets zoals het gaat, en kan het slimmer, sneller of prettiger?',
      'Van chaos naar richting — eerst begrijpen, dan vereenvoudigen, dan pas automatiseren.',
    ],
  },
  creatief: {
    image: 's-creatief.png',
    heading: 'Creatief bezig zijn',
    body: [
      'Buiten het werk om ben ik het liefst creatief bezig in de breedste zin van het woord — van niets iets maken!',
      'Tekenen, knutselen, bouwen: het maakt niet uit wat, zolang er maar iets staat waar eerst niets was.',
    ],
  },
  ai: {
    image: 's-ai.png',
    heading: 'Het AI-virus',
    body: [
      'Sinds een jaar ben ik volledig gegrepen door het AI-virus — en ik heb geen tegengif gezocht.',
      'Voor mij is dit de perfecte combinatie waarin mijn passie voor procesverbetering en mijn creativiteit eindelijk volledig samenkomen.',
    ],
  },
  codelieshout: {
    image: 's-code.png',
    heading: 'Code Lieshout',
    body: [
      'Daarom ben ik oprichter van Code Lieshout: bedrijven helpen op een persoonlijke en pragmatische manier.',
      'Innovatief en flexibel genoeg voor de modernste technieken op het gebied van AI en agents — tegen een fractie van de prijs die traditionele consultants vragen.',
    ],
  },
  contact: {
    image: 's-contact.png',
    heading: 'Neem contact op',
    body: [
      'Functioneel ontwerp dat jij en ik allebei begrijpen. Een persoonlijke aanpak, vanuit jouw wens!',
      'Koffie of een online gesprek? Ik denk graag met je mee — mail pim@code-lieshout.nl of bel 06-12419980.',
    ],
  },
}

type Page = (typeof SPREADS)[number]

const N = 18 // aantal strips in het blad
const SPAN = 0.449 // binnenrug tot buitenrand, als fractie
const BETA = 0.6 // maximale kromming van de boog (radialen)
const TILT_X = 4.5
const TILT_Y = 7
const ZOOM_MIN = 0.9
const ZOOM_MAX = 1.5

function pageUrl(p: Page) {
  return DIR + p.file
}

export default function Sketchbook() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sb3dRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const capBoxRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const zoomWrapRef = useRef<HTMLDivElement>(null)
  const zoomInnerRef = useRef<HTMLDivElement>(null)
  const loupeRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)

  const [zoomRead, setZoomRead] = useState('100%')
  const [loupePressed, setLoupePressed] = useState(true)

  // Alle imperatieve logica (bladgeometrie, spring physics, loep) is een
  // directe port van de originele implementatie en leeft buiten React-state.
  useEffect(() => {
    const wrap = wrapRef.current!
    const stage = stageRef.current!
    const sb3d = sb3dRef.current!
    const book = bookRef.current!
    const capBox = capBoxRef.current!
    const hint = hintRef.current!
    const zoomWrap = zoomWrapRef.current!
    const zoomInner = zoomInnerRef.current!
    const loupe = loupeRef.current!

    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
    const M = SPREADS.length

    let idx = 0
    let turn: { dir: 'next' | 'prev'; from: number; to: number; t: number } | null = null
    let strips: HTMLElement[] = []
    let capOut: HTMLElement | null = null
    let capIn: HTMLElement | null = null

    const el = (t: string, c?: string) => {
      const e = document.createElement(t)
      if (c) e.className = c
      return e
    }

    function halfEl(pos: string, i: number) {
      const d = el('div', 'sb-half ' + pos)
      const im = new Image()
      im.className = 'sb-half-img ' + pos
      im.draggable = false
      im.alt = ''
      im.src = pageUrl(SPREADS[viewSpread(i)])
      d.appendChild(im)
      d.appendChild(el('div', 'gutter-shade ' + pos))
      return d
    }

    function buildCurl(dir: 'next' | 'prev', from: number, to: number) {
      strips = []
      const c = el('div', 'curl ' + dir)
      c.style.setProperty('--n', String(N))
      c.style.setProperty('--span', String(SPAN))
      let host: HTMLElement = c
      for (let i = 0; i < N; i++) {
        const s = el('div', 'strip')
        const gut = 'calc(var(--bw) * 0.5)'
        const sw = `calc(var(--bw) * ${SPAN} / ${N})`
        const A = `calc(-1 * (${gut} + ${i} * ${sw}))`
        const B = `calc(${i + 1} * ${sw} - ${gut})`
        const f = el('div', 'face front')
        const b = el('div', 'face back')
        const dress = (e: HTMLElement, url: string, px: string) => {
          e.style.backgroundImage = `url(${url})`
          e.style.backgroundPositionX = px
        }
        dress(f, pageUrl(SPREADS[from]), dir === 'next' ? A : B)
        dress(b, pageUrl(SPREADS[to]), dir === 'next' ? B : A)
        f.appendChild(el('div', 'sh'))
        f.appendChild(el('div', 'gl'))
        b.appendChild(el('div', 'sh'))
        b.appendChild(el('div', 'gl'))
        s.appendChild(f)
        s.appendChild(b)
        if (i === N - 1) s.classList.add('edge')
        host.appendChild(s)
        host = s
        strips.push(s)
      }
      return c
    }

    function applyTurn(t: number) {
      if (!turn || !sb3d) return
      const th = Math.PI * t
      const beta = BETA * Math.sin(Math.PI * t)
      const D = 180 / Math.PI
      const tt = th + beta
      const td = (2 * beta) / N
      sb3d.style.setProperty('--tt', `${(tt * D).toFixed(2)}deg`)
      sb3d.style.setProperty('--td', `${(td * D).toFixed(3)}deg`)
      sb3d.style.setProperty('--shade', Math.sin(Math.PI * t).toFixed(3))
      fadeCaption(t)
      for (let i = 0; i < strips.length; i++) {
        const l1 = Math.abs(Math.cos(tt - i * td))
        const l2 = Math.abs(Math.cos(tt - (i + 1) * td))
        const st = strips[i].style
        st.setProperty('--lit', l1.toFixed(3))
        st.setProperty('--a1', ((1 - l1) * 0.62).toFixed(3))
        st.setProperty('--a2', ((1 - l2) * 0.62).toFixed(3))
      }
    }

    function fadeCaption(t: number) {
      if (!capOut || !capIn) return
      const out = 1 - Math.max(0, Math.min(1, (t - 0.1) / 0.28))
      const inn = Math.max(0, Math.min(1, (t - 0.56) / 0.3))
      capOut.style.opacity = out.toFixed(3)
      capIn.style.opacity = inn.toFixed(3)
    }

    // caption: gedelegeerd naar captionImpl zodat de index-sync (marks)
    // later in het bestand kan worden toegevoegd.
    let captionImpl: () => void = () => {}
    function caption() {
      captionImpl()
    }

    function layout() {
      sb3d?.style.setProperty('--bw', book.clientWidth + 'px')
    }

    /* ---------------------------- spring loop --------------------------- */
    type Spring =
      | { kind: 'spring'; v: number; target: number; done?: () => void; k: number; c: number }
      | { kind: 'tween'; from: number; target: number; dur: number; e: number; done?: () => void }
    let spring: Spring | null = null
    let raf: number | null = null
    let last = 0
    let viewActive = false

    function animateTo(target: number, onDone?: () => void, stiff = 150, damp = 22) {
      spring = { kind: 'spring', v: 0, target, done: onDone, k: stiff, c: damp }
      kick()
    }
    function tweenTo(target: number, dur: number, onDone?: () => void) {
      spring = { kind: 'tween', from: turn ? turn.t : 0, target, dur, e: 0, done: onDone }
      kick()
    }

    function tick(now: number) {
      raf = null
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016)
      last = now
      if (spring && turn) {
        const s = spring
        if (s.kind === 'tween') {
          s.e += dt
          const k = Math.min(1, s.e / s.dur)
          turn.t = s.from + (s.target - s.from) * k
          applyTurn(turn.t)
          if (k >= 1) {
            spring = null
            s.done?.()
          }
        } else {
          const x = turn.t - s.target
          s.v += (-s.k * x - s.c * s.v) * dt
          turn.t += s.v * dt
          if (Math.abs(turn.t - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
            turn.t = s.target
            spring = null
            applyTurn(turn.t)
            s.done?.()
          } else applyTurn(turn.t)
        }
      }
      viewSpring()
      const lmoved = loupeEase()
      if ((spring || viewActive || lmoved) && raf === null) raf = requestAnimationFrame(tick)
    }
    function kick() {
      if (raf === null) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    /* ------------------------------ tilt/zoom --------------------------- */
    const view = { rx: 0, ry: 0, z: 1, trx: 0, try_: 0, tz: 1 }
    let lastZ = 1

    function applyView() {
      sb3d.style.setProperty('--rx', view.rx.toFixed(2) + 'deg')
      sb3d.style.setProperty('--ry', view.ry.toFixed(2) + 'deg')
      sb3d.style.setProperty('--zoom', view.z.toFixed(3))
      if (view.z !== lastZ) {
        lastZ = view.z
        placeLoupe()
      }
    }
    function viewSpring(): boolean {
      const e = 0.14
      let moved = false
      const pairs: [keyof typeof view, keyof typeof view][] = [
        ['rx', 'trx'],
        ['ry', 'try_'],
        ['z', 'tz'],
      ]
      for (const [k, t] of pairs) {
        const d = (view[t] as number) - (view[k] as number)
        if (Math.abs(d) > 0.0006) {
          ;(view[k] as number) += d * e
          moved = true
        } else {
          ;(view[k] as number) = view[t] as number
        }
      }
      if (moved) applyView()
      viewActive = moved
      return moved
    }
    function setView(rx: number, ry: number, z: number) {
      view.trx = Math.max(-TILT_X, Math.min(TILT_X, rx))
      view.try_ = Math.max(-TILT_Y, Math.min(TILT_Y, ry))
      view.tz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z))
      viewActive = true
      kick()
      syncZoom()
    }
    function tiltTo(cx: number, cy: number) {
      if (drag) return
      const r = book.getBoundingClientRect()
      if (!r.width) return
      const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)))
      const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)))
      setView((-ny * TILT_X), nx * TILT_Y, view.tz)
    }

    /* ------------------------------- paint ------------------------------ */
    // Paginavolgorde: spread 0, dan afwisselend [tekstpagina, volgende spread].
    // Een "view index" wijst ofwel naar een afbeeldingsspread (even) of een
    // tekstpagina (oneven, gekoppeld aan SPREADS[(i+1)/2]).
    const totalViews = SPREADS.length * 2 - 1
    function isStoryView(v: number) {
      return v % 2 === 1
    }
    function viewIsImage(v: number) {
      return !isStoryView(v)
    }

    let storyEl: HTMLDivElement | null = null

    function buildStoryPage(viewIdx: number): HTMLDivElement {
      const key = SPREADS[(viewIdx + 1) / 2].file.replace('.png', '')
      const story = STORY_PAGES[key]
      const d = el('div', 'sb-story') as HTMLDivElement
      if (!story) return d
      const img = new Image()
      img.className = 'sb-story-img'
      img.src = DIR + story.image
      img.alt = ''
      img.draggable = false
      const text = el('div', 'sb-story-text')
      const h = el('h3', 'sb-story-heading')
      h.textContent = story.heading
      text.appendChild(h)
      story.body.forEach((par) => {
        const p = el('p')
        p.textContent = par
        text.appendChild(p)
      })
      d.appendChild(img)
      d.appendChild(text)
      return d
    }

    function paint() {
      book.textContent = ''
      if (!turn) {
        if (viewIsImage(idx)) {
          const f = el('div', 'sb-full')
          const im = new Image()
          im.src = pageUrl(SPREADS[idx / 2])
          im.alt = SPREADS[idx / 2].title
          im.draggable = false
          f.appendChild(im)
          book.appendChild(f)
        } else {
          storyEl = buildStoryPage(idx)
          book.appendChild(storyEl)
        }
        sb3d.style.setProperty('--shade', '0')
      } else {
        // Het omslaande blad bestaat alleen tussen twee afbeeldingspaginas.
        const next = turn.dir === 'next'
        book.appendChild(halfEl('left', next ? turn.from : turn.to))
        book.appendChild(halfEl('right', next ? turn.to : turn.from))
        book.appendChild(buildCurl(turn.dir, turn.from, turn.to))
        applyTurn(turn.t)
      }
      const a = el('button', 'sb-zone sb-prev')
      a.setAttribute('aria-label', 'vorige pagina')
      const b = el('button', 'sb-zone sb-next')
      b.setAttribute('aria-label', 'volgende pagina')
      book.appendChild(a)
      book.appendChild(b)
      layout()
      caption()
      syncZoomLayer()
      placeLoupe()
    }

    /* ----------------------------- pointerwerk -------------------------- */
    let drag: { dir: 'next' | 'prev'; x0: number; w: number; moved: number; vel: number; tPrev: number } | null = null

    function hideHint() {
      hint.classList.add('gone')
    }

    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement
      const onBook = !!target.closest('.sb-zone')
      if (!onBook || introOn) return
      e.preventDefault()
      stage.setPointerCapture(e.pointerId)
      hideHint()
      const r = book.getBoundingClientRect()
      const dir: 'next' | 'prev' = (e.clientX - r.left) / r.width > 0.5 ? 'next' : 'prev'
      startTurn(dir, 0)
      drag = { dir, x0: e.clientX, w: r.width, moved: 0, vel: 0, tPrev: performance.now() }
    })
    stage.addEventListener('pointermove', (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x0
      drag.moved = Math.max(drag.moved, Math.abs(dx))
      const raw = (drag.dir === 'next' ? -dx : dx) / (drag.w * 0.62)
      const t = Math.max(0, Math.min(1, raw))
      const now = performance.now()
      drag.vel = (t - (turn ? turn.t : 0)) / Math.max(0.001, (now - drag.tPrev) / 1000)
      drag.tPrev = now
      if (turn) {
        turn.t = t
        applyTurn(t)
      }
    })
    function endDrag() {
      if (!drag) return
      const d = drag
      drag = null
      if (!turn) return
      if (d.moved < 6) {
        commit()
        return
      }
      const go = turn.t > 0.42 || d.vel > 1.1
      if (go) commit()
      else cancel()
    }
    stage.addEventListener('dragstart', (e) => e.preventDefault())
    stage.addEventListener('selectstart', (e) => e.preventDefault())
    stage.addEventListener('pointerup', endDrag)
    stage.addEventListener('pointercancel', endDrag)

    /* ---------------------------- turn control -------------------------- */
    // Bladen (curl) bestaat alleen tussen afbeeldingspaginas. Vanaf een
    // tekstpagina of naar een tekstpagina: directe fade via storyFade().
    function startTurn(dir: 'next' | 'prev', t: number) {
      spring = null
      if (turn) {
        idx = turn.to
        turn = null
      }
      const target = dir === 'next' ? (idx + 1) % totalViews : (idx - 1 + totalViews) % totalViews
      if (isStoryView(idx) || isStoryView(target)) {
        storyFade(dir, target)
        return
      }
      shoveLoupe(dir)
      turn = { dir, from: idx, to: target, t: t || 0 }
      paint()
    }
    function storyFade(dir: 'next' | 'prev', target: number) {
      if (REDUCED) {
        idx = target
        paint()
        return
      }
      const leaving = book.querySelector('.sb-story')
      const incoming = buildStoryPage(target)
      incoming.classList.add('sb-story-enter-next')
      if (dir === 'prev') incoming.classList.remove('sb-story-enter-next'), incoming.classList.add('sb-story-enter-prev')
      book.appendChild(incoming)
      if (leaving) leaving.classList.add('sb-story-leave-' + (dir === 'next' ? 'next' : 'prev'))
      setTimeout(
        () => {
          idx = target
          turn = null
          paint()
        },
        420,
      )
    }
    function commit() {
      if (!turn) return
      if (REDUCED) {
        idx = turn.to
        turn = null
        paint()
        return
      }
      animateTo(
        1,
        () => {
          idx = turn!.to
          turn = null
          paint()
        },
        170,
        26,
      )
      kick()
    }
    function cancel() {
      if (!turn) return
      animateTo(0, () => {
        turn = null
        paint()
      }, 150, 24)
      kick()
    }
    function step(dir: 'next' | 'prev') {
      if (introOn) endIntro()
      if (turn) {
        idx = turn.to
        turn = null
      }
      startTurn(dir, 0)
      commit()
    }
    function goTo(i: number) {
      if (introOn) endIntro()
      const target = i * 2 // index-lijst wijst naar afbeeldingspaginas
      if (target === idx) return
      if (turn) {
        idx = turn.to
        turn = null
      }
      const fwd = (target - idx + totalViews) % totalViews
      const back = (idx - target + totalViews) % totalViews
      if (Math.min(fwd, back) === 1) {
        step(fwd === 1 ? 'next' : 'prev')
        return
      }
      storyFade(fwd <= back ? 'next' : 'prev', target)
    }

    const btnLeft = wrap.querySelector<HTMLButtonElement>('#sbLeft')
    const btnRight = wrap.querySelector<HTMLButtonElement>('#sbRight')
    if (btnLeft) btnLeft.onclick = () => step('prev')
    if (btnRight) btnRight.onclick = () => step('next')

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      e.preventDefault()
      hideHint()
      step(e.key === 'ArrowRight' ? 'next' : 'prev')
    }
    addEventListener('keydown', onKey)

    /* ------------------------------- loep ------------------------------- */
    const MAG = 2.3
    let loupeOn = true
    let lx: number | null = null
    let ly: number | null = null
    let lgrab: { cx: number; cy: number; lx0: number; ly0: number } | null = null
    let lTarget: { x: number; y: number } | null = null

    function loupeSize() {
      return Math.round(Math.max(165, Math.min(262, book.clientWidth * 0.235)))
    }
    function bookBox() {
      return { x: 0, y: 0, w: book.clientWidth, h: book.clientHeight }
    }
    function restLoupe() {
      const b = bookBox()
      lx = b.x + b.w * 0.88
      ly = b.y + b.h * 0.855
      placeLoupe()
    }
    function syncZoomLayer() {
      zoomInner.textContent = ''
      for (const c of Array.from(book.children)) {
        if ((c as HTMLElement).classList.contains('sb-zone')) continue
        zoomInner.appendChild(c.cloneNode(true))
      }
    }
    function placeLoupe() {
      if (lx === null) return
      const B = bookBox()
      if (!B.w) return
      const R = loupeSize() / 2
      const bez = R * 2 * 0.058
      loupe.style.setProperty('--lr', R * 2 + 'px')
      loupe.style.transform = `translate3d(${(lx - R).toFixed(1)}px, ${(ly! - R).toFixed(1)}px, 0)`
      if (loupeOn) loupe.classList.add('on')

      const z = view.z
      const cx = B.w / 2
      const cy = B.h / 2
      const x0 = cx + (B.w * 0.051 - cx) * z
      const x1 = cx + (B.w * 0.949 - cx) * z
      const y0 = cy + (B.h * 0.218 - cy) * z
      const y1 = cy + (B.h * 0.782 - cy) * z
      const nx = Math.max(x0, Math.min(lx, x1))
      const ny = Math.max(y0, Math.min(ly!, y1))
      const inside =
        lx > x0 && lx < x1 && ly! > y0 && ly! < y1
          ? Math.min(lx - x0, x1 - lx, ly! - y0, y1 - ly!)
          : -Math.hypot(lx - nx, ly! - ny)
      const k = Math.max(0, Math.min(1, (inside + R * 0.3) / (R * 0.55)))

      zoomWrap.style.opacity = (loupeOn ? k : 0).toFixed(3)
      if (k <= 0.002) return
      const r = (R - bez).toFixed(1)
      const mask = `radial-gradient(circle ${r}px at ${lx.toFixed(1)}px ${ly!.toFixed(1)}px, #000 calc(100% - 1px), transparent 100%)`
      zoomWrap.style.webkitMaskImage = mask
      zoomWrap.style.maskImage = mask
      const px = cx + (lx - cx) / z
      const py = cy + (ly! - cy) / z
      const s = MAG * z
      zoomInner.style.transform = `translate(${(lx - px * s).toFixed(1)}px, ${(ly! - py * s).toFixed(1)}px) scale(${s.toFixed(4)})`
    }
    function shoveLoupe(dir: 'next' | 'prev') {
      if (!loupeOn || lx === null || lgrab) return
      const b = bookBox()
      const nx = (b.w / 2 + (lx - b.x - b.w / 2) / view.z) / b.w
      const ny = (b.h / 2 + (ly! - b.y - b.h / 2) / view.z) / b.h
      if (nx < 0.02 || nx > 0.98 || ny < 0.17 || ny > 0.83) return
      lTarget = { x: b.x + b.w * (dir === 'next' ? 0.12 : 0.88), y: b.y + b.h * 0.855 }
      kick()
    }
    function loupeEase(): boolean {
      if (!lTarget) return false
      if (lgrab) {
        lTarget = null
        return false
      }
      const dx = lTarget.x - lx!
      const dy = lTarget.y - ly!
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        lx = lTarget.x
        ly = lTarget.y
        lTarget = null
        placeLoupe()
        return false
      }
      lx! += dx * 0.17
      ly! += dy * 0.17
      placeLoupe()
      return true
    }
    function loupeDown(e: PointerEvent) {
      if (!loupeOn || e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      lTarget = null
      lgrab = { cx: e.clientX, cy: e.clientY, lx0: lx!, ly0: ly! }
      loupe.classList.add('held')
      loupe.setPointerCapture(e.pointerId)
      hideHint()
    }
    function loupeMove(e: PointerEvent) {
      if (!lgrab) return
      const b = bookBox()
      const R = loupeSize() / 2
      lx = Math.max(b.x - R * 0.7, Math.min(b.x + b.w + R * 0.7, lgrab.lx0 + (e.clientX - lgrab.cx)))
      ly = Math.max(b.y - R * 0.7, Math.min(b.y + b.h + R * 1.0, lgrab.ly0 + (e.clientY - lgrab.cy)))
      placeLoupe()
    }
    function dropLoupe() {
      lgrab = null
      loupe.classList.remove('held')
    }
    loupe.addEventListener('pointerdown', loupeDown)
    loupe.addEventListener('pointermove', loupeMove)
    loupe.addEventListener('pointerup', dropLoupe)
    loupe.addEventListener('pointercancel', dropLoupe)

    const loupeBtn = wrap.querySelector<HTMLButtonElement>('#loupeBtn')
    if (loupeBtn) {
      loupeBtn.onclick = () => {
        loupeOn = !loupeOn
        setLoupePressed(loupeOn)
        loupeBtn.setAttribute('aria-pressed', String(loupeOn))
        loupe.classList.toggle('on', loupeOn)
        if (loupeOn && lx === null) restLoupe()
      }
    }

    function syncZoom() {
      setZoomRead(Math.round(view.tz * 100) + '%')
    }
    const zInBtn = wrap.querySelector<HTMLButtonElement>('#zIn')
    const zOutBtn = wrap.querySelector<HTMLButtonElement>('#zOut')
    if (zInBtn) zInBtn.onclick = () => { setView(view.trx, view.try_, view.tz * 1.16); hideHint() }
    if (zOutBtn) zOutBtn.onclick = () => { setView(view.trx, view.try_, view.tz / 1.16); hideHint() }

    /* ------------------------------- index ------------------------------ */
    const plateList = wrap.querySelector<HTMLElement>('#plateList')
    const plateButtons: HTMLButtonElement[] = []
    if (plateList) {
      plateList.textContent = ''
      SPREADS.forEach((p, i) => {
        const li = el('li')
        const b = el('button', 'plate') as HTMLButtonElement
        const n = el('span', 'n')
        n.textContent = String(i + 1).padStart(2, '0')
        const t = el('span', 't')
        t.textContent = p.title
        const pl = el('span', 'p')
        pl.textContent = p.place
        b.append(n, t, pl)
        b.onclick = () => {
          goTo(i)
          document.getElementById('sketchbook-top')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        li.appendChild(b)
        plateList.appendChild(li)
        plateButtons.push(b)
      })
    }
    function marks() {
      const cur = turn ? turn.to : idx
      plateButtons.forEach((b, i) => b.setAttribute('aria-current', i === cur ? 'true' : 'false'))
    }
    // caption wordt pas gedefinieerd als `function caption()` hierboven —
    // wrap hem via een variabele zodat paint()/marks() de index kunnen syncen.
    captionImpl = () => {
      paintCaptions()
      marks()
    }
    function paintCaptions() {
      capBox.textContent = ''
      capOut = capIn = null
      if (turn) {
        capOut = el('p', 'sb-caption live')
        capOut.textContent = SPREADS[viewSpread(turn.from)].title
        capBox.appendChild(capOut)
        capIn = el('p', 'sb-caption live')
        capIn.textContent = SPREADS[viewSpread(turn.to)].title
        capBox.appendChild(capIn)
        fadeCaption(turn.t)
      } else {
        const p = el('p', 'sb-caption')
        p.textContent = SPREADS[viewSpread(idx)].title
        capBox.appendChild(p)
      }
    }
    // view-index → spread-index in SPREADS
    function viewSpread(v: number) {
      return isStoryView(v) ? (v + 1) / 2 : v / 2
    }

    /* ------------------------------- intro ------------------------------ */
    let riffle: { bell: number; dur: number }[] = []
    let riffleAt = 0
    let introOn = false
    function endIntro() {
      introOn = false
      wrap.classList.remove('intro', 'b2')
    }
    function riffleStep() {
      const s = riffle[riffleAt]
      wrap.classList.toggle('b2', s.bell > 0.55)
      startTurn('next', 0)
      tweenTo(
        1,
        s.dur,
        () => {
          idx = turn!.to
          turn = null
          riffleAt++
          if (introOn && riffleAt < riffle.length) {
            paint()
            riffleStep()
          } else {
            endIntro()
            paint()
          }
        },
      )
    }
    function startIntro() {
      const coarse = matchMedia('(max-width: 640px), (pointer: coarse)').matches
      if (coarse || REDUCED || sessionStorage.getItem('sketch-intro-done')) {
        idx = 0
        paint()
        return
      }
      const steps = 6 // korte intro: alleen over afbeeldingspaginas riffelen
      riffle = []
      for (let r = 0; r < steps; r++) {
        const bell = Math.sin(Math.PI * (r / (steps - 1)))
        riffle.push({ bell, dur: 0.26 - 0.19 * bell })
      }
      riffleAt = 0
      introOn = true
      wrap.classList.add('intro')
      riffleStep()
      sessionStorage.setItem('sketch-intro-done', '1')
    }

    /* ------------------------- pointer parallax -------------------------- */
    function winPointerMove(e: PointerEvent) {
      if (e.pointerType === 'touch') return
      tiltTo(e.clientX, e.clientY)
    }
    function winPointerOut(e: PointerEvent) {
      if (!e.relatedTarget) setView(0, 0, view.tz)
    }
    function winBlur() {
      setView(0, 0, view.tz)
    }
    addEventListener('pointermove', winPointerMove, { passive: true })
    addEventListener('pointerout', winPointerOut)
    addEventListener('blur', winBlur)
    stage.addEventListener('dblclick', () => setView(view.trx, view.try_, 1))

    function onResize() {
      layout()
      lx = null
      restLoupe()
    }
    addEventListener('resize', onResize)

    /* -------------------------------- boot ------------------------------- */
    paint()
    applyView()

    let cancelled = false
    Promise.all(
      SPREADS.map((p) => {
        const im = new Image()
        im.src = pageUrl(p)
        return im.decode ? im.decode().catch(() => {}) : new Promise((r) => { im.onload = im.onerror = r })
      }),
    ).then(() => {
      if (cancelled) return
      const t = document.fonts?.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve()
      t.then(() => {
        if (cancelled) return
        syncZoom()
        restLoupe()
        setTimeout(startIntro, 220)
      })
    })

    return () => {
      cancelled = true
      if (raf !== null) cancelAnimationFrame(raf)
      removeEventListener('keydown', onKey)
      removeEventListener('pointermove', winPointerMove)
      removeEventListener('pointerout', winPointerOut)
      removeEventListener('blur', winBlur)
      removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <style>{sketchStyles}</style>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="sb-mblur-1">
          <feGaussianBlur stdDeviation="5 0" />
        </filter>
        <filter id="sb-mblur-2">
          <feGaussianBlur stdDeviation="14 0" />
        </filter>
      </svg>

      <section id="sketchbook-top" className="sb-hero">
        <img className="botany l" src={DIR + 'botany-left.png'} alt="" aria-hidden="true" />
        <img className="botany r" src={DIR + 'botany-right.png'} alt="" aria-hidden="true" />

        <p className="hero-kicker">Over mij · Pim van Lieshout · Lieshout, Noord-Brabant</p>

        <div className="sb-wrap" id="sbWrap" ref={wrapRef}>
          <div className="sb-stage" id="sbStage" ref={stageRef}>
            <button className="sb-arrow left" id="sbLeft" aria-label="vorige pagina">
              <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
                <polyline points="11,3 3,22 11,41" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="sb-3d" id="sb3d" ref={sb3dRef}>
              <div className="sb-tilt">
                <div className="sb-cast ambient" aria-hidden="true" />
                <div className="sb-cast contact" aria-hidden="true" />
                <div className="sb-cast hair" aria-hidden="true" />
                <div className="sb-book" id="sbBook" ref={bookRef} />
              </div>
              <div className="zoomwrap" id="zoomWrap" aria-hidden="true" ref={zoomWrapRef}>
                <div className="zoominner" id="zoomInner" ref={zoomInnerRef} />
              </div>
              <div className="loupe" id="loupe" ref={loupeRef}>
                <span className="grip" />
                <span className="ring">
                  <span className="lens" ref={lensRef}>
                    <span className="mag" />
                  </span>
                </span>
              </div>
            </div>
            <button className="sb-arrow right" id="sbRight" aria-label="volgende pagina">
              <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
                <polyline points="3,3 11,22 3,41" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="sb-captions" id="sbCaptions" ref={capBoxRef} />
          <div className="sb-tools" role="group" aria-label="weergave-instellingen">
            <button className="tool" id="zOut" aria-label="uitzoomen">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8.6" cy="8.6" r="5.6" />
                <path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8" />
              </svg>
            </button>
            <span className="zoom-read">{zoomRead}</span>
            <button className="tool" id="zIn" aria-label="inzoomen">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8.6" cy="8.6" r="5.6" />
                <path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8M8.6 6.2v4.8" />
              </svg>
            </button>
            <span className="tool-sep" aria-hidden="true" />
            <button className="tool" id="loupeBtn" aria-label="vergrootglas" aria-pressed={loupePressed}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8.8" cy="8.8" r="5.8" />
                <path d="M13 13l4.4 4.4" />
                <path d="M6.4 7.2a3.2 3.2 0 0 1 2.4-1.4" opacity=".55" />
              </svg>
            </button>
          </div>
          <p className="sb-hint" id="sbHint" ref={hintRef}>
            Sleep de pagina om te bladeren · sleep het vergrootglas eroverheen
          </p>
        </div>

        <ol className="plate-list" id="plateList" style={{ marginTop: 'clamp(40px, 6vh, 72px)' }} />
      </section>
    </>
  )
}

const sketchStyles = `
@font-face{font-family:'SB Instrument Serif';font-style:normal;font-weight:400;font-display:block;
  src:url(/sketchbook/instrument-serif.woff2) format('woff2')}
@font-face{font-family:'Newsreader SB';font-style:normal;font-weight:200 600;font-display:swap;
  src:url(/sketchbook/newsreader.woff2) format('woff2')}

.sb-hero{
  --paper:#f2f0e4;
  --ink:#22301f;
  --ink-soft:rgba(34,48,31,.58);
  --ink-faint:rgba(34,48,31,.36);
  --hairline:rgba(34,48,31,.14);
  --earth:#3c7a46;
  --display:'SB Instrument Serif',"New York",Georgia,'Times New Roman',serif;
  position:relative;display:flex;flex-direction:column;align-items:center;
  min-height:100svh;overflow:hidden;
  padding:clamp(96px,12svh,140px) 0 clamp(56px,8svh,96px);
  background:
    radial-gradient(120% 90% at 50% 0%, #ffffff 0%, var(--paper) 42%, #e4e9da 100%);
}
.sb-hero:before{
  content:"";position:absolute;inset:0;z-index:0;pointer-events:none;
  background:url(/sketchbook/bg-wash.jpg) center top / cover no-repeat;
  opacity:.30;mix-blend-mode:multiply;
}
.sb-hero>*{position:relative;z-index:1}
.botany{position:absolute;bottom:0;width:clamp(120px,15vw,250px);opacity:.55;pointer-events:none;user-select:none;z-index:0}
.botany.l{left:clamp(-40px,-1vw,0px);bottom:2%}
.botany.r{right:clamp(-30px,0vw,10px);bottom:-2%;width:clamp(100px,12vw,200px)}
@media (max-width:900px){.botany{display:none}}

.hero-kicker{
  font-size:12px;font-weight:400;letter-spacing:.24em;text-align:center;
  color:var(--ink-soft);margin:0 0 clamp(22px,3.4vh,40px);text-transform:uppercase;
}
@media (max-width:640px){.hero-kicker{font-size:10.5px;letter-spacing:.16em;padding:0 16px}}

.hero,.hero *{-webkit-user-select:none;-moz-user-select:none;user-select:none}
.hero img{-webkit-user-drag:none;user-drag:none}
.sb-wrap{display:grid;justify-items:center;gap:20px;width:100%;position:relative;z-index:2}
.sb-stage{display:flex;align-items:center;justify-content:center;width:100%;position:relative;touch-action:pan-y}
.sb-arrow{flex:none;display:inline-flex;align-items:center;justify-content:center;padding:6px 2px;border:0;background:transparent;color:var(--ink-faint);cursor:pointer;transition:color .2s;-webkit-tap-highlight-color:transparent;z-index:8}
.sb-arrow:hover{color:var(--ink)}

.sb-3d{position:relative;flex:1 1;min-width:0;max-width:900px;perspective:1750px;perspective-origin:50% 46%}
.sb-tilt{position:relative;transform-style:preserve-3d;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--zoom,1));will-change:transform}
.sb-book{position:relative;width:100%;aspect-ratio:1760/1240;transform-style:preserve-3d;z-index:1}

.sb-cast{position:absolute;pointer-events:none;z-index:0}
.sb-cast.ambient{left:5%;right:5%;top:27%;bottom:2%;
  background:radial-gradient(50% 50% at 50% 58%,rgba(38,52,32,.34) 0%,rgba(38,52,32,.19) 40%,rgba(38,52,32,0) 74%);
  filter:blur(26px);opacity:calc(1 - var(--shade,0)*.42)}
.sb-cast.contact{left:9%;right:9%;top:62%;bottom:10%;
  background:radial-gradient(50% 44% at 50% 42%,rgba(30,42,24,.40) 0%,rgba(30,42,24,.17) 48%,rgba(30,42,24,0) 78%);
  filter:blur(11px);opacity:calc(1 - var(--shade,0)*.5)}
.sb-cast.hair{left:12%;right:12%;top:70%;bottom:17%;
  background:radial-gradient(50% 52% at 50% 40%,rgba(26,36,20,.34) 0%,rgba(26,36,20,0) 76%);
  filter:blur(4px);opacity:calc(1 - var(--shade,0)*.62)}
.sb-full{position:absolute;inset:0}
.sb-full img{width:100%;height:auto;display:block}

/* tekstpagina's: links illustratie, rechts het verhaal in boektypografie */
.sb-story{position:absolute;inset:0;display:flex;align-items:center;gap:clamp(16px,3%,40px);
  padding:4.5% 5%;background:#f6f2e6;border-radius:10px;
  box-shadow:inset 0 0 0 1px rgba(34,48,31,.08), inset 0 0 60px rgba(120,100,60,.12)}
.sb-story:before{content:"";position:absolute;left:50%;top:3.5%;bottom:3.5%;width:1px;
  background:linear-gradient(180deg,transparent,rgba(34,48,31,.22) 18%,rgba(34,48,31,.22) 82%,transparent)}
.sb-story-img{flex:0 0 42%;width:42%;height:auto;max-height:82%;object-fit:contain;user-select:none;-webkit-user-drag:none}
.sb-story-text{flex:1;min-width:0;font-family:'Newsreader SB',Georgia,'Times New Roman',serif;color:#22301f;
  padding-right:clamp(4px,2%,20px)}
.sb-story-heading{font-family:'SB Instrument Serif',Georgia,serif;font-weight:400;
  font-size:clamp(17px,2.6cqw,30px);margin:0 0 .7em;letter-spacing:.01em}
.sb-story-text p{font-size:clamp(11px,1.55cqw,17px);line-height:1.72;margin:0 0 .9em;font-weight:340}
.sb-story-text p:last-child{margin-bottom:0}
.sb-story-enter-next{animation:sb-in-next .42s ease both}
.sb-story-enter-prev{animation:sb-in-prev .42s ease both}
.sb-story-leave-next{animation:sb-out-next .42s ease both forwards}
.sb-story-leave-prev{animation:sb-out-prev .42s ease both forwards}
@keyframes sb-in-next{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:none}}
@keyframes sb-in-prev{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:none}}
@keyframes sb-out-next{to{opacity:0;transform:translateX(-26px)}}
@keyframes sb-out-prev{to{opacity:0;transform:translateX(26px)}}
@media (max-width:640px){
  .sb-story{flex-direction:column;justify-content:center;gap:8px;padding:8% 9%;text-align:left}
  .sb-story:before{left:8%;right:8%;top:50%;bottom:auto;width:auto;height:1px;
    background:linear-gradient(90deg,transparent,rgba(34,48,31,.22) 18%,rgba(34,48,31,.22) 82%,transparent)}
  .sb-story-img{flex:none;width:auto;max-width:70%;max-height:38%}
  .sb-story-heading{font-size:16px;margin:.35em 0}
  .sb-story-text p{font-size:11px;line-height:1.55;margin:0 0 .55em}
}
.sb-half{position:absolute;top:0;bottom:0;width:50%;overflow-x:clip;overflow-y:visible}
.sb-half.left{left:0}
.sb-half.right{left:50%}
.sb-half-img{width:200%;max-width:none;height:auto;display:block}
.sb-half-img.right{margin-left:-100%}
.gutter-shade{position:absolute;top:var(--pg,21.8%);bottom:var(--pg,21.8%);width:46%;pointer-events:none;opacity:calc(var(--shade,0)*.62);
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 5.2%,#000 94.8%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0,#000 5.2%,#000 94.8%,transparent 100%)}
.gutter-shade.left{right:0;background:linear-gradient(270deg,rgba(44,60,34,.30),rgba(44,60,34,0) 82%)}
.gutter-shade.right{left:0;background:linear-gradient(90deg,rgba(44,60,34,.24),rgba(44,60,34,0) 82%)}

.curl{position:absolute;top:0;height:100%;width:calc(var(--bw,0px)*var(--span));transform-style:preserve-3d;z-index:6}
.curl.next{left:50%;transform-origin:left center;transform:rotateY(calc(-1*var(--tt,0deg)))}
.curl.prev{right:50%;transform-origin:right center;transform:rotateY(var(--tt,0deg))}
.strip{position:absolute;top:0;height:100%;width:calc(var(--bw,0px)*var(--span)/var(--n));transform-style:preserve-3d}
.curl.next .strip{transform-origin:left center}
.curl.prev .strip{transform-origin:right center}
.curl.next>.strip{left:0}
.curl.prev>.strip{right:0;left:auto}
.curl.next .strip .strip{left:100%;transform:rotateY(var(--td,0deg))}
.curl.prev .strip .strip{right:100%;transform:rotateY(calc(-1*var(--td,0deg)))}
.face{position:absolute;top:0;bottom:0;left:0;right:-1.1px;backface-visibility:hidden;-webkit-backface-visibility:hidden;
  background-repeat:no-repeat;background-size:var(--bw,0px) auto}
.face.back{transform:rotateY(180deg)}
.face .sh,.face .gl{-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 5.2%,#000 94.8%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0,#000 5.2%,#000 94.8%,transparent 100%)}
.strip.edge .face .sh,.strip.edge .face .gl{
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 9%,#000 91%,transparent 100%),var(--hf);
  mask-image:linear-gradient(180deg,transparent 0,#000 9%,#000 91%,transparent 100%),var(--hf);
  -webkit-mask-composite:source-in;mask-composite:intersect}
.curl.next .strip.edge .face.front,.curl.prev .strip.edge .face.back{--hf:linear-gradient(90deg,#000 0 22%,transparent 96%)}
.curl.next .strip.edge .face.back,.curl.prev .strip.edge .face.front{--hf:linear-gradient(270deg,#000 0 22%,transparent 96%)}
.face .sh{position:absolute;left:0;right:0;top:var(--pg,21.8%);bottom:var(--pg,21.8%);pointer-events:none}
.curl.next .face.front .sh,.curl.prev .face.back .sh{background:linear-gradient(90deg,rgba(40,54,30,var(--a1,0)),rgba(40,54,30,var(--a2,0)))}
.curl.next .face.back .sh,.curl.prev .face.front .sh{background:linear-gradient(90deg,rgba(40,54,30,var(--a2,0)),rgba(40,54,30,var(--a1,0)))}
.face .gl{position:absolute;left:0;right:0;top:var(--pg,21.8%);bottom:var(--pg,21.8%);pointer-events:none;background:#fbfaf0;
  opacity:calc(var(--shade,0)*var(--lit,1)*var(--lit,1)*.20)}

.loupe{position:absolute;left:0;top:0;width:var(--lr,270px);height:var(--lr,270px);pointer-events:none;z-index:80;opacity:0;transition:opacity .25s ease;will-change:transform}
.loupe.on{opacity:1}
.loupe.held .ring{cursor:grabbing}
.loupe .ring{position:absolute;inset:0;border-radius:50%;pointer-events:auto;cursor:grab;padding:calc(var(--lr,270px)*.058);
  box-shadow:0 1px 2px rgba(38,52,32,.30),0 10px 18px rgba(38,52,32,.24),0 26px 40px rgba(38,52,32,.20),0 48px 66px rgba(38,52,32,.13)}
.loupe .ring:before{content:"";position:absolute;inset:0;border-radius:50%;pointer-events:none;
  background:linear-gradient(146deg,#f2f5ea 0%,#cfdbbe 14%,#93a97f 32%,#5c7550 50%,#a8bd92 66%,#e4ecd6 80%,#79905f 100%);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.8),inset 0 -2px 3px rgba(40,56,28,.5);
  -webkit-mask-image:radial-gradient(circle closest-side at 50% 50%,transparent 0 88.2%,#000 89.8% 100%);
  mask-image:radial-gradient(circle closest-side at 50% 50%,transparent 0 88.2%,#000 89.8% 100%)}
.loupe .grip{position:absolute;left:50%;top:50%;width:calc(var(--lr,270px)*.74);height:calc(var(--lr,270px)*.125);
  transform-origin:0 50%;transform:rotate(40deg) translate(calc(var(--lr,270px)*.33),-50%);border-radius:calc(var(--lr,270px)*.06);
  pointer-events:auto;cursor:grab;
  background:linear-gradient(180deg,rgba(255,255,255,.46) 0 13%,rgba(255,255,255,0) 44%,rgba(0,0,0,.26) 100%),
    linear-gradient(90deg,#b9c9a2 0 14%,#87a06c 14% 20%,#4e6640 20% 62%,#3d5230 62% 92%,#5c754880 92% 100%);
  box-shadow:0 8px 15px rgba(38,52,32,.26),0 18px 26px rgba(38,52,32,.14)}
.lens{position:relative;display:block;width:100%;height:100%;border-radius:50%;background-repeat:no-repeat;overflow:hidden;
  box-shadow:inset 0 0 0 1px rgba(40,56,28,.55),inset 0 4px 12px rgba(30,44,20,.28),inset 0 -7px 16px rgba(252,252,240,.14)}
.lens .mag{display:none}
.zoomwrap{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2;opacity:0}
.zoominner{position:absolute;inset:0;transform-origin:0 0}
.lens:before,.lens:after{content:"";position:absolute;inset:0;border-radius:50%;pointer-events:none}
.lens:before{z-index:1}
.lens:after{z-index:2}
.lens:before{background:radial-gradient(circle at 50% 50%,rgba(0,0,0,0) 54%,rgba(38,52,32,.10) 76%,rgba(30,44,20,.34) 100%);
  box-shadow:inset 0 0 0 2px rgba(150,178,130,.26),inset 0 0 0 4px rgba(190,200,160,.15)}
.lens:after{background:
  radial-gradient(36% 26% at 29% 19%,rgba(255,255,255,.30),rgba(255,255,255,0) 76%),
  radial-gradient(24% 16% at 74% 86%,rgba(255,255,255,.12),rgba(255,255,255,0) 80%),
  linear-gradient(150deg,rgba(255,255,255,.06) 0 18%,rgba(255,255,255,0) 42%)}

.sb-tools{display:flex;align-items:center;gap:6px;border:1px solid var(--hairline);border-radius:999px;padding:5px 7px;
  background:rgba(250,250,240,.62);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.tool{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:50%;
  background:transparent;color:var(--ink-soft);cursor:pointer;transition:background-color .18s ease,color .18s ease}
.tool:hover{background:rgba(252,252,246,.9);color:var(--ink)}
.tool[aria-pressed="true"]{background:rgba(60,122,70,.16);color:var(--earth)}
.tool:disabled{opacity:.32;cursor:default;background:transparent}
.tool svg{width:15px;height:15px;display:block}
.tool-sep{width:1px;height:17px;background:var(--hairline);margin:0 2px}
.zoom-read{font-size:11px;letter-spacing:.1em;color:var(--ink-faint);min-width:40px;text-align:center;font-variant-numeric:tabular-nums}
@media (pointer:coarse){.loupe{display:none}}

.sb-zone{position:absolute;top:0;bottom:0;border:0;background:transparent;cursor:grab;z-index:60;-webkit-tap-highlight-color:transparent}
.sb-zone:active{cursor:grabbing}
.sb-prev{left:0;width:50%}
.sb-next{right:0;width:50%}

.sb-captions{display:grid;justify-items:center}
.sb-captions>*{grid-area:1/1;margin:0}
.sb-caption{font-family:var(--display);font-size:clamp(19px,2.2vw,27px);letter-spacing:.01em;color:var(--ink);animation:sb-cap-in .5s ease both}
.sb-caption.live{animation:none}
@keyframes sb-cap-in{0%{opacity:0}}
.sb-hint{margin:0;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint);transition:opacity .4s ease}
.sb-hint.gone{opacity:0}
.sb-wrap.intro .sb-full img,.sb-wrap.intro .sb-half-img{filter:url(#sb-mblur-1)}
.sb-wrap.intro.b2 .sb-full img,.sb-wrap.intro.b2 .sb-half-img{filter:url(#sb-mblur-2)}
.sb-wrap.intro .sb-caption{animation:none}
@media (max-width:640px){
  .sb-wrap{width:100vw;margin-inline:calc(50% - 50vw)}
  .sb-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:70;padding:12px 6px}
  .sb-arrow.left{left:2px}
  .sb-arrow.right{right:2px}
  .sb-3d{max-width:none}
  .sb-hint{font-size:9.5px;letter-spacing:.1em;padding:0 16px;text-align:center}
}

/* index van spreads */
.plate-list{list-style:none;margin:0 auto;padding:0;border-top:1px solid var(--hairline);width:min(1080px,86vw)}
.plate-list li{list-style:none}
.plate{display:grid;grid-template-columns:3.4em minmax(0,1fr) auto;gap:18px;align-items:baseline;width:100%;
  padding:15px 4px;border:0;border-bottom:1px solid var(--hairline);background:transparent;text-align:left;cursor:pointer;
  color:inherit;font:inherit;transition:background-color .22s ease,padding-left .22s ease}
.plate:hover,.plate[aria-current="true"]{background:rgba(252,252,246,.5);padding-left:12px}
.plate .n{font-size:12px;color:var(--ink-faint);letter-spacing:.06em}
.plate .t{font-family:var(--display);font-size:clamp(19px,2.1vw,26px)}
.plate .p{font-size:12.5px;color:var(--ink-faint);letter-spacing:.08em;text-transform:uppercase;text-align:right}
.plate[aria-current="true"] .p{color:var(--earth)}
@media (prefers-reduced-motion:reduce){
  .sb-hero{scroll-behavior:auto}
}
`
