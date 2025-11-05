# Sticky Header Troubleshooting Guide

## Probleem: Verkeerde kleur onder de zwarte lijn

Wanneer je een pagina maakt met de `StickyHeader` component, kan het gebeuren dat je onder de zwarte lijn een verkeerde achtergrondkleur ziet. Dit komt doordat de header een wrapper heeft die standaard een groene kleur gebruikt.

### Voorbeeld van het probleem:
- Pagina heeft een **zwarte** achtergrond
- Maar onder de zwarte lijn van de header zie je **groen**

### Oplossing: `wrapperBackgroundColor` prop

De `StickyHeader` component heeft een speciale prop genaamd `wrapperBackgroundColor` die specifiek de kleur van het stukje onder de zwarte lijn bepaalt.

## Hoe te gebruiken

### Basis voorbeeld:
```tsx
<StickyHeader
  title="MCP-SERVER"
  wrapperBackgroundColor="rgb(0, 0, 0)"
/>
```

### Volledige pagina voorbeeld:
```tsx
export default function MyPage() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "rgb(0, 0, 0)" }}>
      <StickyHeader
        title="MCP-SERVER"
        wrapperBackgroundColor="rgb(0, 0, 0)"  // Match met pagina achtergrond!
      />

      <div className="p-4 md:p-8 lg:p-16 pb-32">
        {/* Content */}
      </div>

      <StickyFooter />
    </div>
  )
}
```

### Alle beschikbare props:

```tsx
interface StickyHeaderProps {
  title: string                        // De titel in de header (verplicht)
  backgroundColor?: string             // Kleur van de header zelf (default: licht groen)
  hoverColor?: string                  // Kleur bij hover (default: donkerder groen)
  wrapperBackgroundColor?: string      // Kleur van wrapper onder de lijn (default: gebruikt backgroundColor)
  className?: string                   // Extra CSS classes
}
```

## Veelvoorkomende scenario's

### Zwarte achtergrond (zoals MCP-SERVER):
```tsx
<StickyHeader
  title="MCP-SERVER"
  wrapperBackgroundColor="rgb(0, 0, 0)"
/>
```

### Witte achtergrond (zoals WEBSITE of CONTACT):
```tsx
<StickyHeader
  title="WEBSITE"
  wrapperBackgroundColor="rgb(255, 255, 255)"
/>
```

### Groene achtergrond (standaard):
```tsx
<StickyHeader
  title="AI & AGENTS"
  backgroundColor="rgb(240,253,244)"
  hoverColor="hsl(141 78.9% 85.1%)"
/>
// wrapperBackgroundColor niet nodig - gebruikt automatisch backgroundColor
```

## Prompts voor het oplossen van dit probleem

### Korte prompt:
```
De sticky-header heeft een verkeerde kleur onder de zwarte lijn.
Pas de wrapperBackgroundColor aan zodat deze matcht met de achtergrondkleur van mijn pagina.
```

### Gedetailleerde prompt:
```
Op pagina /MCP-server/example heeft de pagina een zwarte achtergrond (rgb(0,0,0)),
maar onder de zwarte lijn van de header zie ik een groene kleur.
Voeg wrapperBackgroundColor="rgb(0, 0, 0)" toe aan de StickyHeader.
```

### Als je niet zeker weet wat er mis is:
```
De sticky header op [PAGINA NAAM] ziet er anders uit dan op de ai-agents1 pagina.
Kun je met screenshots vergelijken en het verschil oplossen?
```

## Technische uitleg

De StickyHeader component heeft twee lagen:
1. **Wrapper div** (regel 34-40) - Dit is het stukje dat zichtbaar blijft onder de zwarte lijn
2. **Header element** (regel 41-75) - Dit is de header die omhoog/omlaag beweegt bij hover

De `wrapperBackgroundColor` prop bepaalt specifiek de kleur van de wrapper, terwijl `backgroundColor` de kleur van de header zelf bepaalt.

## Bestanden die je mogelijk moet aanpassen:

1. **Je pagina bestand** (bijv. `app/MCP-server/example/page.tsx`)
   - Voeg `wrapperBackgroundColor` prop toe aan `<StickyHeader />`

2. **Component bestand** (`app/components/sticky-header.tsx`)
   - Dit hoef je normaal gesproken NIET aan te passen
   - De prop bestaat al en is klaar voor gebruik

## Referentie implementaties

Kijk naar deze pagina's voor voorbeelden:
- `app/ai-agents1/page.tsx` - Gebruikt backgroundColor voor groene achtergrond
- `app/MCP-server/example/page.tsx` - Gebruikt wrapperBackgroundColor voor zwarte achtergrond
