# Portfolio Hover Kleuren - Bevindingen

## Probleem
Bij het hoveren over items met donkere achtergrondkleuren was de zwarte tekst slecht leesbaar.

## Analyse

### Kleuren per item (speels gemixed)
| Index | Item | Kleur | Lightness | Type |
|-------|------|-------|-----------|------|
| 0 | ABOUT ME | `hsl(141.9 69.2% 58%)` | 58% | medium |
| 1 | AI & AGENTS | `hsl(138.5 76.5% 96.7%)` | 96.7% | lichtste |
| 2 | MCP-SERVER | `hsl(142.4 71.8% 29.2%)` | 29.2% | **donker** |
| 3 | WEBSITE | `hsl(141.7 76.6% 73.1%)` | 73.1% | licht |
| 4 | CONTACT | `hsl(144.9 80.4% 10%)` | 10% | **donkerste** |
| 5 | LYFT | `hsl(141 78.9% 85.1%)` | 85.1% | zeer licht |
| 6 | ITEM 7 | `hsl(142.8 64.2% 24.1%)` | 24.1% | **donker** |
| 7 | ITEM 8 | `hsl(140.6 84.2% 92.5%)` | 92.5% | bijna lichtste |
| 8 | ITEM 9 | `hsl(142.1 76.2% 36.3%)` | 36.3% | medium donker |
| 9 | ITEM 10 | `hsl(143.8 61.2% 20.2%)` | 20.2% | **zeer donker** |
| 10 | ITEM 11 | `hsl(142.1 70.6% 45.3%)` | 45.3% | medium |
| 11 | ITEM 12 | `hsl(141.7 76.6% 73.1%)` | 73.1% | licht |

### Probleemkleuren (lightness < 30%)
- **Index 2** (MCP-SERVER): 29.2% lightness
- **Index 4** (CONTACT): 10% lightness - donkerste kleur
- **Index 6** (ITEM 7): 24.1% lightness
- **Index 9** (ITEM 10): 20.2% lightness

## Oplossing
Bij hover op items met donkere achtergrond verandert de tekstkleur van:
- **Standaard**: `hsl(144.9 80.4% 10%)` (donkerste groen)
- **Bij donkere achtergrond**: `hsl(138.5 76.5% 96.7%)` (lichtste groen)

Dit zorgt voor voldoende contrast en leesbaarheid.

## Implementatie
```typescript
const darkIndices = [2, 4, 6, 9] // indices met donkere achtergrond

const getTextColor = (index: number, isHovered: boolean) => {
  if (isHovered && darkIndices.includes(index)) {
    return "hsl(138.5 76.5% 96.7%)" // lichtste groen voor contrast
  }
  return "hsl(144.9 80.4% 10%)" // donkerste groen (standaard)
}
```

## Bron
Alle kleuren komen uit `kleuren.txt` - het groene kleurenpalet van de website.
