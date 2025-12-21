---
title: "Motion design met Framer Motion"
date: "2025-01-25"
category: "Development"
excerpt: "Een complete gids voor het bouwen van soepele, professionele animaties in React applicaties."
featuredImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop"
---

# Motion design met Framer Motion

Framer Motion is dé library voor production-ready animaties in React. Leer hoe je het maximale eruit haalt.

## Installatie

```bash
npm install framer-motion
```

## Basis: motion components

Vervang HTML elements met `motion.*`:

```jsx
import { motion } from 'framer-motion';

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Hello World
    </motion.div>
  );
}
```

## Variants: Reusable animations

```jsx
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

function Card() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      Card content
    </motion.div>
  );
}
```

## Stagger children

Animeer children één voor één:

```jsx
const container = {
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
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={item}>
          {item.text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

## Gestures: Hover, tap, drag

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### Drag functionaliteit

```jsx
<motion.div
  drag
  dragConstraints={{
    top: -50,
    left: -50,
    right: 50,
    bottom: 50,
  }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1 }}
>
  Drag me!
</motion.div>
```

## AnimatePresence: Exit animations

```jsx
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="backdrop"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ type: 'spring', damping: 25 }}
            className="modal"
          >
            Modal content
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Layout animations

Auto-animate layout changes:

```jsx
function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        borderRadius: 20,
        background: 'white',
        padding: 20,
      }}
    >
      <motion.h2 layout>Title</motion.h2>
      {isExpanded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Extra content
        </motion.p>
      )}
    </motion.div>
  );
}
```

## Scroll-triggered animations

```jsx
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function Section() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Fades in when scrolled into view
      </motion.div>
    </section>
  );
}
```

## Scroll progress

```jsx
import { useScroll, useTransform, motion } from 'framer-motion';

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <motion.div style={{ y }}>
      Parallax effect
    </motion.div>
  );
}
```

## useAnimation hook

Programmatische controle:

```jsx
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';

function AnimatedComponent({ isActive }) {
  const controls = useAnimation();

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: 1.2,
        rotate: 180,
        transition: { duration: 0.5 },
      });
    } else {
      controls.start({
        scale: 1,
        rotate: 0,
      });
    }
  }, [isActive, controls]);

  return (
    <motion.div animate={controls}>
      Controlled animation
    </motion.div>
  );
}
```

## Path animations (SVG)

```jsx
const icon = {
  hidden: {
    pathLength: 0,
    fill: 'rgba(255, 255, 255, 0)',
  },
  visible: {
    pathLength: 1,
    fill: 'rgba(255, 255, 255, 1)',
    transition: {
      pathLength: { duration: 2, ease: 'easeInOut' },
      fill: { duration: 2, delay: 1 },
    },
  },
};

function AnimatedIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <motion.path
        d="M10 10 L90 90"
        variants={icon}
        initial="hidden"
        animate="visible"
      />
    </motion.svg>
  );
}
```

## Spring physics

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: 'spring',
    stiffness: 100, // Hogere waarde = sneller
    damping: 10,     // Hogere waarde = minder bounce
    mass: 1,         // Hogere waarde = trager
  }}
/>
```

## Custom ease curves

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96], // cubic-bezier
  }}
/>
```

## Performance tips

### 1. Use transform & opacity

```jsx
// ✅ Goed - Hardware accelerated
<motion.div
  animate={{ x: 100, opacity: 0.5 }}
/>

// ❌ Slecht - Triggers layout
<motion.div
  animate={{ left: 100, width: 200 }}
/>
```

### 2. Lazy load heavy animations

```jsx
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';

const HeavyAnimation = lazy(() => import('./HeavyAnimation'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyAnimation />
    </Suspense>
  );
}
```

### 3. Reduce motion voor accessibility

```jsx
import { useReducedMotion } from 'framer-motion';

function Component() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        x: 100,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.5,
        },
      }}
    />
  );
}
```

## Praktisch voorbeeld: Card hover

```jsx
function ProductCard({ product }) {
  return (
    <motion.div
      className="card"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.img
        src={product.image}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="overlay"
        variants={{
          rest: { opacity: 0, y: 20 },
          hover: { opacity: 1, y: 0 },
        }}
      >
        <h3>{product.name}</h3>
        <button>View Details</button>
      </motion.div>
    </motion.div>
  );
}
```

## Page transitions

```jsx
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

const pageVariants = {
  initial: { opacity: 0, x: -200 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 200 },
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
      >
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );
}
```

## Conclusie

Framer Motion maakt complexe animaties **simpel** zonder in te leveren op **performance** of **flexibiliteit**.

**Key takeaways:**
- Gebruik variants voor reusable animations
- AnimatePresence voor exit animations
- Layout prop voor auto-layout animations
- Spring physics voor natuurlijke beweging
- Respecteer prefers-reduced-motion

**Resources:**
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Motion One](https://motion.dev/) (lightweight alternative)
- [Animation examples](https://www.framer.com/motion/examples/)
