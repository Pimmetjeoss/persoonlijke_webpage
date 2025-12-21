---
title: "Next.js performance optimalisatie"
date: "2025-02-10"
category: "Development"
excerpt: "Concrete stappen om je Next.js applicatie sneller te maken voor betere gebruikerservaring."
featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
---

# Next.js performance optimalisatie

Een snelle website is geen luxe - het is een verwachting. Leer hoe je Next.js optimaal inzet voor maximale snelheid.

## Core Web Vitals: De meetlat

Google meet performance op 3 metrics:

1. **LCP** (Largest Contentful Paint): < 2.5s
2. **FID** (First Input Delay): < 100ms
3. **CLS** (Cumulative Layout Shift): < 0.1

## Image Optimization

Next.js Image component is een game-changer:

```jsx
import Image from 'next/image';

// ❌ Slecht
<img src="/hero.jpg" alt="Hero" />

// ✅ Goed
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Voor above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Lazy loading voor below-the-fold

```jsx
<Image
  src="/feature.jpg"
  width={800}
  height={600}
  loading="lazy" // Default behavior
  alt="Feature"
/>
```

## Font Optimization

Next.js 13+ heeft ingebouwde font optimization:

```javascript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Voordelen:**
- Automatisch self-hosting
- Zero layout shift
- No flash of unstyled text (FOUT)

## Static vs Dynamic Rendering

### Static Generation (SSG)

Best voor content die niet vaak wijzigt:

```javascript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }) {
  const post = await getPost(params.slug);
  return <Article post={post} />;
}
```

### Incremental Static Regeneration (ISR)

Beste van beide werelden:

```javascript
export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

## Code Splitting & Dynamic Imports

Laad alleen wat nodig is:

```javascript
import dynamic from 'next/dynamic';

// Lazy load een zware component
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Disable SSR als niet nodig
});

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />
    </div>
  );
}
```

## API Route Optimization

### Edge Functions voor snelheid

```javascript
// app/api/hello/route.ts
export const runtime = 'edge'; // Deploy to edge network

export async function GET() {
  return Response.json({ message: 'Hello from the edge!' });
}
```

### Caching strategies

```javascript
export async function GET() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  return Response.json(data);
}
```

## React Server Components

Zero bundle size voor server logic:

```javascript
// Server Component (default in app directory)
async function UserProfile({ userId }) {
  const user = await db.users.find(userId);

  return (
    <div>
      <h1>{user.name}</h1>
      <ClientButton /> {/* Only this sends JS to client */}
    </div>
  );
}

// Client Component (minimal JS)
'use client';
function ClientButton() {
  return <button onClick={() => alert('Hi!')}>Say Hi</button>;
}
```

## Bundle Analysis

Vind wat je bundle groot maakt:

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});
```

```bash
ANALYZE=true npm run build
```

## Compression & CDN

### Enable gzip/brotli

```javascript
// next.config.js
module.exports = {
  compress: true, // Enabled by default
};
```

### Vercel deployment (automatic)

- Global CDN
- Automatic cache headers
- Edge network for static assets

## Monitoring Performance

### Web Vitals reporting

```javascript
// app/layout.tsx
export function reportWebVitals(metric) {
  console.log(metric);

  // Send to analytics
  if (metric.label === 'web-vital') {
    // gtag('event', metric.name, { value: metric.value });
  }
}
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install && npm run build
      - run: npx @lhci/cli@0.12.x autorun
```

## Checklist

- [ ] Images gebruik `next/image` component
- [ ] Fonts self-hosted via `next/font`
- [ ] Static generation waar mogelijk
- [ ] ISR voor semi-static content
- [ ] Dynamic imports voor heavy components
- [ ] Bundle analyzer gedraaid
- [ ] Core Web Vitals < thresholds
- [ ] Lighthouse score > 90

## Conclusie

Performance is geen one-time fix - het is een mindset. Met deze optimalisaties haal je het maximale uit Next.js.

**Prioriteer:**
1. Images (grootste impact)
2. Fonts (zero layout shift)
3. Static generation (snelste mogelijk)
4. Code splitting (kleinere bundles)
