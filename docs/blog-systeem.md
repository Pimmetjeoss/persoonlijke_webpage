# Blog Systeem - Gebruikershandleiding

Deze handleiding legt uit hoe het markdown-based blog systeem werkt en hoe je nieuwe posts toevoegt.

## Overzicht

Het blog systeem gebruikt **markdown bestanden** (`.md`) voor content, waardoor je gemakkelijk blog posts kunt schrijven en beheren zonder code aan te passen.

## Architectuur

```
persoonlijke_webpage/
├── content/posts/              # Markdown blog posts (12 bestanden)
│   ├── ai-in-healthcare.md
│   ├── sustainable-web-design.md
│   └── ...
│
├── public/blog/images/         # Blog afbeeldingen (optioneel)
│   └── featured-*.jpg
│
├── app/blog/
│   ├── lib/                    # Blog utility functies
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── blog.ts            # getAllPosts(), getPostBySlug()
│   │
│   ├── [slug]/                 # Dynamic route voor individuele posts
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── blog-post-card.tsx # Card component voor listing
│   │   ├── masonry-grid.tsx   # Grid layout
│   │   └── markdown-content.tsx # Styled markdown renderer
│   │
│   └── page.tsx               # Blog listing pagina
```

## Dependencies

Het systeem gebruikt de volgende packages:

- **gray-matter** - Parse frontmatter uit markdown
- **react-markdown** - Render markdown als React components
- **remark-gfm** - GitHub Flavored Markdown support (tabellen, task lists)

## Nieuwe blog post toevoegen

### Stap 1: Maak een markdown bestand

Maak een nieuw `.md` bestand in de `content/posts/` folder:

```bash
# Bestandsnaam = URL slug
content/posts/mijn-nieuwe-post.md
```

### Stap 2: Voeg frontmatter en content toe

```markdown
---
title: "De titel van je blog post"
date: "2025-03-20"
category: "Development"
excerpt: "Een korte beschrijving (1-2 zinnen) die verschijnt op de listing pagina."
featuredImage: "https://images.unsplash.com/photo-xxx" # Optioneel
---

# Hoofdkop van je artikel

Dit is de eerste paragraaf van je blog post. Schrijf gewoon in markdown!

## Subkop

Je kunt alle standaard markdown features gebruiken:

### Lists

- Ongeordende lijst item 1
- Ongeordende lijst item 2

1. Geordende lijst item 1
2. Geordende lijst item 2

### Text formatting

**Bold text** voor nadruk.
*Italic text* voor accent.

### Links

[Link naar externe site](https://example.com)

### Blockquotes

> "Dit is een quote of belangrijke opmerking."

### Code

Inline code: `const variable = 'waarde';`

Code blocks met syntax highlighting:

\`\`\`javascript
function helloWorld() {
  console.log('Hello World!');
}
\`\`\`

\`\`\`python
def hello_world():
    print("Hello World!")
\`\`\`

### Images

![Alt text](https://images.unsplash.com/photo-xxx)

## Conclusie

Sluit af met belangrijkste punten en call-to-action.
```

### Stap 3: Frontmatter velden

| Veld | Type | Verplicht | Beschrijving |
|------|------|-----------|--------------|
| `title` | string | ✅ | Titel van de post (wordt H1 op detail pagina) |
| `date` | string | ✅ | Publicatiedatum (format: `YYYY-MM-DD`) |
| `category` | string | ✅ | Categorie tag (bijv. "Development", "Design") |
| `excerpt` | string | ✅ | Korte beschrijving voor listing page |
| `featuredImage` | string | ❌ | URL naar featured image (Unsplash of lokaal) |

### Stap 4: Build de site

```bash
npm run build
```

De post wordt automatisch:
- Getoond op `/blog` in de masonry grid
- Toegankelijk via `/blog/mijn-nieuwe-post`
- Gegenereerd als statische HTML (SSG)

## Afbeeldingen gebruiken

### Optie 1: Unsplash (zoals nu)

```markdown
---
featuredImage: "https://images.unsplash.com/photo-1234567890?w=800&h=600&fit=crop"
---
```

**Voordelen:**
- Geen upload nodig
- Automatisch geoptimaliseerd
- Gratis high-quality images

### Optie 2: Lokale afbeeldingen

1. **Plaats image in `public/blog/images/`:**
   ```
   public/blog/images/featured-mijn-post.jpg
   ```

2. **Reference in frontmatter:**
   ```markdown
   ---
   featuredImage: "/blog/images/featured-mijn-post.jpg"
   ---
   ```

3. **In markdown content:**
   ```markdown
   ![Beschrijving](/blog/images/diagram.png)
   ```

## Markdown styling

Het systeem heeft custom styling voor alle markdown elementen:

### Headings

```markdown
# H1 - Grote titel met underline (dark green)
## H2 - Section heading (dark green)
### H3 - Subsection heading (medium green)
#### H4 - Kleinere heading (medium green)
```

### Links

Automatisch gestyled met:
- Medium green color
- Underline
- Hover effect naar dark green
- Externe links openen in nieuwe tab

### Code

**Inline code:** Licht groene achtergrond
**Code blocks:** Dark green achtergrond met light green text

### Blockquotes

Groene border aan linkerkant met licht groene achtergrond.

### Lists

Bullets/nummers met voldoende spacing voor leesbaarheid.

## Bestaande blog posts

Er zijn 12 voorbeeld posts aanwezig:

1. **ai-in-healthcare.md** - AI & Technologie
2. **sustainable-web-design.md** - Webdesign
3. **react-19-features.md** - Development
4. **minimalist-portfolio.md** - Design
5. **typescript-tips.md** - Development
6. **ui-animation-principles.md** - Design
7. **nextjs-performance.md** - Development
8. **color-theory-web.md** - Design
9. **accessibility-matters.md** - Webdesign
10. **framer-motion-guide.md** - Development
11. **three-js-beginners.md** - Development
12. **design-systems.md** - Design

**Je kunt deze:**
- Als voorbeeld gebruiken
- Bewerken met je eigen content
- Verwijderen en vervangen door je eigen posts

## Development workflow

### Lokaal testen

```bash
# Start development server
npm run dev

# Open browser
http://localhost:3000/blog
```

### Build voor productie

```bash
# Build static site
npm run build

# Test production build
npm start
```

### Deploy

```bash
# Commit changes
git add .
git commit -m "Add new blog post: [titel]"
git push

# Vercel/Netlify deployen automatisch
```

## Tips & Best Practices

### ✅ Goede praktijken

1. **Gebruik duidelijke slugs:**
   - `mijn-nieuwe-feature.md` ✅
   - `post-123.md` ❌

2. **Schrijf goede excerpts:**
   - Maak mensen nieuwsgierig
   - Geef duidelijk aan waar de post over gaat
   - 1-2 zinnen is ideaal

3. **Featured images:**
   - Gebruik 16:9 aspect ratio (800x600px of 1200x675px)
   - Optimaliseer voor web (< 200KB)
   - Kies relevante, high-quality images

4. **Categorieën:**
   - Blijf consistent (gebruik bestaande categorieën)
   - Gebruik title case: "Development", "Design", "AI & Technologie"

5. **Dates:**
   - Gebruik ISO format: `YYYY-MM-DD`
   - Posts worden gesorteerd van nieuw naar oud

### ❌ Vermijd

1. Speciale karakters in slugs (`&`, `%`, spaties)
2. Te lange excerpts (> 3 zinnen)
3. Hele grote images (> 1MB)
4. Lege frontmatter velden (verplichte velden moeten ingevuld zijn)

## Troubleshooting

### "Geen blog posts gevonden"

**Oorzaak:** `content/posts/` folder is leeg of markdown bestanden hebben fouten.

**Oplossing:**
1. Check of `.md` bestanden in `content/posts/` staan
2. Valideer frontmatter syntax (gebruik `---` voor en na)
3. Check of alle verplichte velden aanwezig zijn

### "Build failed"

**Oorzaak:** Syntax error in markdown of frontmatter.

**Oplossing:**
1. Check of frontmatter valid YAML is
2. Quote strings met speciale karakters: `title: "Post met: dubbele punt"`
3. Check console output voor specifieke errors

### "Image laadt niet"

**Oorzaak:** Verkeerde path of URL.

**Oplossing:**
1. Voor lokale images: gebruik `/blog/images/` (met leading slash)
2. Voor Unsplash: check of URL valide is
3. Check `next.config.ts` voor toegestane image domains

### "Markdown styling klopt niet"

**Oorzaak:** Markdown syntax fout.

**Oplossing:**
1. Check of code blocks correct afgesloten zijn met \`\`\`
2. Gebruik lege regel voor en na lists/blockquotes
3. Test markdown in een preview tool (bijv. [StackEdit](https://stackedit.io/))

## Technische details

### Hoe het werkt

1. **Build time:**
   - `getAllPostSlugs()` leest alle `.md` bestanden
   - `generateStaticParams()` genereert routes voor elke post
   - Posts worden pre-rendered als statische HTML

2. **Runtime:**
   - `/blog` toont alle posts via `getAllPosts()`
   - `/blog/[slug]` laadt specifieke post via `getPostBySlug()`
   - Markdown wordt client-side gerenderd met `react-markdown`

### Performance

- **Static Generation (SSG)**: Alle posts worden pre-built
- **Image Optimization**: Next.js Image component optimaliseert automatisch
- **Code Splitting**: Elke post is een aparte route chunk

### SEO

Elke post heeft automatisch:
- `<title>` tag met post titel
- `<meta description>` met excerpt
- OpenGraph tags voor social sharing
- Semantic HTML voor betere indexering

## Uitbreidingsmogelijkheden

### Toekomstige features

Mogelijke uitbreidingen voor later:

1. **Zoekfunctie** - Filter posts op titel/content
2. **Tags systeem** - Naast categorieën
3. **Related posts** - Suggesties onderaan artikel
4. **Reading time** - Geschatte leestijd
5. **Comments** - Via Giscus of Disqus
6. **RSS feed** - Voor subscribers
7. **Draft mode** - `published: false` in frontmatter
8. **Table of contents** - Auto-genereren uit headings

## Hulp nodig?

- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Markdown Guide**: [https://www.markdownguide.org/](https://www.markdownguide.org/)
- **React Markdown**: [https://remarkjs.github.io/react-markdown/](https://remarkjs.github.io/react-markdown/)

---

**Laatst bijgewerkt:** 2025-12-21
**Versie:** 1.0
