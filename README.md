# Pimplify - Advanced Interactive Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-Animation-green?style=for-the-badge&logo=greensock&logoColor=white)

**Pimplify** is een state-of-the-art persoonlijke website en portfolio applicatie die de grenzen van moderne webontwikkeling verlegt. Het project combineert high-performance React Server Components met complexe WebGL visualisaties en "native-app-like" pagina transities.

Dit project fungeert als een showcase voor geavanceerde frontend technieken, waaronder custom shaders, procedurele animaties en complexe state-management patronen voor naadloze gebruikerservaringen.

## 🌟 Core Features & capabilities

### 🎨 Immersive 3D Visuals
De applicatie maakt gebruik van een custom WebGL rendering engine (via **Three.js** en **React Three Fiber**) voor het genereren van:
*   **Dithering Shaders**: Een geavanceerde post-processing shader (`DitheringShader.tsx`) die real-time effecten genereert zoals **Wave**, **Warp**, **Simplex Noise**, en **Ripple**, gecombineerd met pixel-perfecte dithering algoritmes (Bayer 2x2, 4x4, 8x8).
*   **Procedural Noise**: Interactive achtergronden die reageren op gebruikersinput en tijd.

### 🔄 Cinematic Transitions (`SliderTransition`)
Navigatie tussen pagina's wordt beheerd door een custom transition systeem:
*   **Multi-Layer Sliding**: Een 3-laags sliding effect dat configureerbaar is qua richting (up/down/left/right), kleur, en timing.
*   **Context-Aware**: Dankzij de `TransitionProvider` blijft de transitie-status behouden over de gehele applicatie lifecycle, wat "harde" pagina verversingen elimineert.
*   **GSAP Integration**: Aangedreven door GreenSock (GSAP) timelines voor frame-perfecte animatie controle en staggering.

### ✍️ Dynamische Typografie Engine (`TypingText`)
Een zelfgeschreven tekst-engine die meer doet dan alleen typen:
*   **Multi-Font Cycling**: Schakelt dynamisch tussen fonts (Geist, Fjalla One, Bebas Neue, e.a.) *tijdens* het typen.
*   **Variable Speeds**: Ondersteuning voor menselijke imperfecties in typesnelheid.
*   **Scramble Effects**: 'Matrix-style' karakter decryptie animaties voor headers.

### 📊 Interactive Data Visualization
*   **Interactive UI Componenten**:
    *   **Bento Grids**: Modern grid-systeem voor content visualisatie.
    *   **Tijdlijnen**: Geanimeerde scroll-based tijdlijn componenten.
    *   **Pacman Popup**: Een speelse 'easter egg' overlay met game-elementen.
*   **Markdown Blog Engine**: Volledig functioneel blogsysteem:
    *   Content beheer via Markdown files (`content/posts/*.md`).
    *   Frontmatter support voor metadata logic via `gray-matter`.
    *   Custom rendering components voor rich-text styling.
*   **AI Showcase**: Speciale sectie voor AI-gerelateerde experimenten en demo's (zie `/ai-agents`).

## 🏗️ Technical Architecture

### Directory Structure
Een gedetailleerd overzicht van de codebase structuur:

```text
pimplify/
├── app/                              # Next.js 16 App Router
│   ├── ai-agents/                    # [Showcase] AI & Shaders demo
│   │   ├── components/               #   - DitheringShader & visualisaties
│   │   └── page.tsx                  #   - Entry point voor shader demo
│   ├── components/                   # [Core] Applicatie-brede logica
│   │   ├── achtergrondfrontpage.tsx  #   - 3D Video/Scene controller
│   │   ├── random_tekst.tsx          #   - Text scramble logic
│   │   ├── slider_transition.tsx     #   - GSAP Page transition engine
│   │   ├── transition_provider.tsx   #   - React Context voor navigatie
│   │   └── typing_text.tsx           #   - Advanced typewriter engine
│   ├── portfolio/                    # [Feature] Portfolio Tijdlijn
│   │   ├── components/               #   - WorkExperience, TimelineAnimation
│   │   └── page.tsx                  #   - Portfolio hoofdpagina
│   ├── test/                         # [Dev] Component Playground
│   │   ├── components/               #   - BentoGrid, Accordions, UI tests
│   │   └── page.tsx                  #   - Test workbench
│   ├── globals.css                   # Tailwind v4 directives & CSS variabelen
│   ├── layout.tsx                    # Root layout + Font injectie
│   └── page.tsx                      # Homepage routing
├── components/                   # Globale herbruikbare componenten
│   └── ui/                       # UI Primitives (Accordion, TextScramble)
├── content/                      # Content Management System
│   └── posts/                    # Markdown blog posts (.md)
├── lib/                          # Helper functies en utilities
│   └── utils.ts                      #   - cn() utility voor Tailwind merging
├── public/                           # Static Assets
│   ├── animations/                   #   - Lottie & media files
│   └── static/                       #   - Afbeeldingen & iconen
└── tests/                            # E2E & Unit Tests
```

### Tech Stack Details

| Categorie | Technologie | Versie | Doel |
|-----------|-------------|--------|------|
| **Core** | **Next.js** | 16.1.0 | Server-side rendering, App Router, Optimization |
| **Lang** | **TypeScript** | 5.x | Type safety en developer experience |
| **UI** | **React** | 19.2.3 | Component library (met Server Components support) |
| **Styling** | **Tailwind CSS** | 4.0 | Utility-first styling engine |
| **Animatie** | **GSAP** | 3.13 | Complexe tijdsgebonden animaties (timelines) |
| **Animatie** | **Framer Motion** | 12.x | Declaratieve component animaties |
| **Graphics** | **Three.js** | 0.180 | WebGL rendering context |
| **Utils** | **clsx / tw-merge** | - | Dynamische class constructie |

## 🚀 Getting Started

### Prerequisites
*   Node.js v20.0.0 of hoger
*   npm (v10+)

### Installatie & Setup

1.  **Clone de repository**
    ```bash
    git clone https://github.com/Pimmetjeoss/persoonlijke_webpage.git
    cd persoonlijke_webpage
    ```

2.  **Installeer dependencies**
    ```bash
    npm install
    ```
    *Pro-tip: Dit installeert direct de gepatchte versies van React en Next.js voor maximale veiligheid.*

3.  **Start de development server**
    ```bash
    npm run dev
    ```
    De applicatie is nu bereikbaar op `http://localhost:3000`.

### Scripts

*   `npm run dev`: Start lokale ontwikkelomgeving (Hot Reloading actief).
*   `npm run build`: Compileert de applicatie voor productie (Static Generation + Server Functions).
*   `npm start`: Start de geoptimaliseerde productie build.
*   `npm run lint`: Code kwaliteitscontrole.

## 🧩 Component Deep Dive

### `DitheringShader.tsx`
Een custom WebGL implementation die 7 verschillende procedurele vormen (`snoise`, `warp`, `dots`, `wave`, `ripple`, `swirl`, `sphere`) combineert met 4 dithering presets. Dit zorgt voor een unieke retro-moderne esthetiek die GPU-geaccelereerd draait.

### `TransitionProvider.tsx` & `SliderTransition.tsx`
Dit duo beheert de "single-page application" feel. Door navigatie-events te onderscheppen, wordt eerst een introductie-animatie gespeeld (de gekleurde sliders), pas daarna vindt de daadwerkelijke route-wijziging plaats via `router.push`, en ten slotte speelt de exit-animatie. Dit maskeert laadtijden volledig.

### `WorkExperience.tsx`
Een complexe lijst-weergave die gebruik maakt van `framer-motion`'s `useInView` hooks om items in te flyen zodra ze in beeld scrollen. Elk item heeft interactieve hover-states die niet alleen de kaart zelf, maar ook de typografie en accentkleuren dynamisch aanpassen.

### `Blog Engine` (`app/blog`)
Het blog systeem leest statische `.md` bestanden uit de `content/` map.
*   **Parsing**: `gray-matter` scheidt metadata (titel, datum) van de body.
*   **Rendering**: `ReactMarkdown` zet de markdown om in gestylde React componenten, met custom overrides voor headers en code blocks in `markdown-content.tsx`.

---

**Auteur**: Pim ([@Pimmetjeoss](https://github.com/Pimmetjeoss))
*Project Status: Actief in ontwikkeling - Laatste update: December 2025*
