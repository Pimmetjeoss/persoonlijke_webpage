---
title: "Animaties die je UX verbeteren"
date: "2025-02-15"
category: "Design"
excerpt: "Leer de principes van goede UI animaties en wanneer je ze wel (en niet) moet gebruiken."
---

# Animaties die je UX verbeteren

Animaties kunnen je interface tot leven brengen - of compleet ruïneren. Hier leer je het verschil.

## De 12 principes van animatie (Disney)

Oorspronkelijk voor traditionele animatie, maar perfect toepasbaar op UI:

### 1. Squash & Stretch

Geef objecten gewicht en flexibiliteit:

```css
@keyframes bounce {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.8) scaleX(1.1); }
}

.button:active {
  animation: bounce 300ms ease-out;
}
```

### 2. Anticipation

Bereid gebruikers voor op wat komt:

- **Button press**: Klein beetje naar binnen voor groot effect
- **Modal open**: Fade + slight scale up
- **Slide in**: Start net buiten viewport

### 3. Easing

**Nooit** gebruik `linear`! Natuurlijke beweging volgt curves:

```css
/* ❌ Robotisch */
transition: all 300ms linear;

/* ✅ Natuurlijk */
transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);

/* Presets */
ease-in: cubic-bezier(0.4, 0, 1, 1);      /* Accelerating */
ease-out: cubic-bezier(0, 0, 0.2, 1);     /* Decelerating */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* S-curve */
```

## Timing: De 300ms sweet spot

Animatie durations per use case:

| Actie | Timing | Reden |
|-------|--------|-------|
| Hover effect | **100-200ms** | Direct feedback |
| Button click | **200-300ms** | Tactiel gevoel |
| Modal/Dialog | **300-400ms** | Smooth maar snel |
| Page transition | **400-600ms** | Context behoud |
| Large animation | **600-800ms** | Storytelling |

> Te snel = jarring, te langzaam = frustreren

## Motion with purpose

### ✅ Goede redenen voor animaties:

1. **Feedback**: Bevestig dat een actie is gelukt
2. **Context**: Laat zien waar iets vandaan/naartoe gaat
3. **Hiërarchie**: Toon relaties tussen elementen
4. **Attention**: Focus op belangrijke updates

### ❌ Slechte redenen:

1. "Het ziet er cool uit"
2. Omdat je net CSS animations hebt geleerd
3. Om development tijd te vullen
4. Omdat een ander het ook heeft

## Praktische voorbeelden

### Loading states

```jsx
// Skeleton loading (beter dan spinner)
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded mt-4 w-3/4" />
      <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
    </div>
  );
}
```

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Smooth height transitions

```javascript
// Auto-height accordion
function Accordion({ isOpen, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{
        height,
        transition: 'height 300ms ease-out',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
```

### Staggered list animations

```jsx
import { motion } from 'framer-motion';

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function List({ items }) {
  return (
    <motion.ul variants={list} initial="hidden" animate="show">
      {items.map((item) => (
        <motion.li key={item.id} variants={item}>
          {item.text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

## Performance tips

### 1. Gebruik transform & opacity

Deze properties triggeren geen reflow/repaint:

```css
/* ✅ Hardware accelerated */
.fast {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ Triggers layout + paint */
.slow {
  left: 100px;
  background: rgba(0,0,0,0.5);
}
```

### 2. will-change voor complexe animaties

```css
.animated-element {
  will-change: transform, opacity;
}

/* Remove na animatie! */
.animated-element:not(.animating) {
  will-change: auto;
}
```

### 3. Prefer requestAnimationFrame

```javascript
function smoothScroll(element, target, duration) {
  const start = element.scrollTop;
  const change = target - start;
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const easing = 1 - Math.pow(1 - progress, 3);

    element.scrollTop = start + (change * easing);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
```

## Accessibility: Respect prefers-reduced-motion

```css
/* Default: volledige animatie */
.card {
  transition: transform 300ms ease-out;
}

.card:hover {
  transform: scale(1.05);
}

/* Gebruiker prefereert minder beweging */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }

  .card:hover {
    /* Gebruik opacity in plaats van transform */
    opacity: 0.8;
  }
}
```

## Tools & Libraries

### Animation libraries:

1. **Framer Motion** - React animations made easy
2. **GSAP** - Industry standard, zeer krachtig
3. **Anime.js** - Lightweight, flexible
4. **Lottie** - Vector animations (from After Effects)

### Bezier curve editors:

- [cubic-bezier.com](https://cubic-bezier.com)
- [easings.net](https://easings.net)

## Checklist voor goede animaties

- [ ] Heeft de animatie een **duidelijk doel**?
- [ ] Is de **timing** passend (niet te snel/langzaam)?
- [ ] Gebruik je **hardware-accelerated** properties?
- [ ] Respecteer je **prefers-reduced-motion**?
- [ ] Is de animatie **subtle** genoeg?
- [ ] Test je op **low-end devices**?
- [ ] Blokkeer je **geen belangrijke acties**?

## Conclusie

Goede animaties zijn:
- **Snel**: 100-400ms voor meeste gevallen
- **Subtle**: Opvallend, niet afleidend
- **Purposeful**: Elke animatie heeft een reden
- **Performant**: Transform + opacity waar mogelijk
- **Accessible**: Respecteer gebruikersvoorkeuren

> "Animation is not about making things move, it's about making meaning move." - Val Head
