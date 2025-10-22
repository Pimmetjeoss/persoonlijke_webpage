# Pimplify - Persoonlijke Webpagina

Een moderne, interactieve persoonlijke webpagina gebouwd met Next.js en Three.js.

## Features

- Geanimeerde 3D blob achtergrond met Three.js
- Randomized text effect voor een dynamische welkomstboodschap
- Responsive design met Tailwind CSS
- Smooth animaties en interactieve elementen

## Tech Stack

- **Next.js 16.0.0** - React framework
- **React 19.2.0** - UI library
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer voor Three.js
- **React Three Drei** - Helpers voor React Three Fiber
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type safety

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
│   │   ├── achtergrondfrontpage.tsx  # Hoofdcomponent met 3D blob
│   │   └── random_tekst.tsx          # Randomized text effect component
│   ├── globals.css                   # Globale styles
│   └── page.tsx                      # Homepage
├── public/                           # Statische assets
└── package.json                      # Project dependencies
```

## Licentie

Dit is een persoonlijk project.

## Contact

Pim - [@Pimmetjeoss](https://github.com/Pimmetjeoss)
