# Pimplify - Persoonlijke Webpagina

Een moderne, interactieve persoonlijke webpagina gebouwd met Next.js en Three.js, met smooth page transitions en dynamische typography effecten.

## Features

- **3D Geanimeerde Achtergrond** - Interactieve blob met Perlin noise displacement
- **Multi-font Typing Animatie** - Cyclische typing animatie met verschillende lettertypes en kleuren
- **Randomized Text Effect** - Dynamische intro animatie met character scrambling
- **Smooth Page Transitions** - 3-blokken slide transitie tussen pagina's met GSAP
- **Responsive Design** - Volledig responsive met Tailwind CSS
- **Portfolio Sectie** - Dedicated portfolio pagina voor projecten

## Tech Stack

- **Next.js 16.0.0** - React framework met App Router
- **React 19.2.0** - UI library
- **Three.js 0.180.0** - 3D graphics library
- **React Three Fiber** - React renderer voor Three.js
- **React Three Drei** - Helpers voor React Three Fiber
- **React Three Postprocessing** - Post-processing effecten (Bloom, N8AO, Noise)
- **GSAP 3.13.0** - Professional-grade animatie library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript 5** - Type safety

## Getting Started

### Prerequisites

- Node.js (versie 20 of hoger aanbevolen)
- npm of yarn

### Installatie

1. Clone de repository:
```bash
git clone https://github.com/Pimmetjeoss/persoonlijke_webpage.git
cd persoonlijke_webpage
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in je browser.

## Scripts

- `npm run dev` - Start de development server
- `npm run build` - Build de applicatie voor productie
- `npm start` - Start de productie server
- `npm run lint` - Run ESLint

## Project Structuur

```
pimplify/
├── app/
│   ├── components/
│   │   ├── achtergrondfrontpage.tsx      # Hoofdcomponent met 3D blob en animaties
│   │   ├── random_tekst.tsx              # Randomized text effect component
│   │   ├── typing_text.tsx               # Multi-font typing animatie component
│   │   ├── slider_transition.tsx         # Herbruikbare 3-blokken transitie component
│   │   └── transition_provider.tsx       # Context provider voor page transitions
│   ├── portfolio/
│   │   └── page.tsx                      # Portfolio pagina
│   ├── globals.css                       # Globale styles
│   ├── layout.tsx                        # Root layout met TransitionProvider
│   └── page.tsx                          # Homepage
├── public/                               # Statische assets
└── package.json                          # Project dependencies
```

## Key Components

### SliderTransition
Herbruikbare component voor smooth page transitions met 3 sliding blokken:
- Configureerbare kleuren (HSL, hex, rgb)
- Aanpasbare durations, stagger en easing
- Meerdere richtingen (up, down, left, right)
- `onCover` callback voor perfecte transitie timing

### TransitionProvider
Context provider die transitions beheert op layout niveau:
- Persists across page changes
- Centralized state management
- `useTransition()` hook voor eenvoudige integratie

### TypingText
Geavanceerde typing animatie met:
- Multiple fonts per woord
- Custom kleuren per woord
- Configureerbare snelheden
- Optionele cursor animatie
- Loop functionaliteit

### RandomizedTextEffect
Character-by-character scrambling effect voor intro animaties

## Licentie

Dit is een persoonlijk project.

## Contact

Pim - [@Pimmetjeoss](https://github.com/Pimmetjeoss)
