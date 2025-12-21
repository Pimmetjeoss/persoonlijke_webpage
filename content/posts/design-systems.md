---
title: "Design systems die echt werken"
date: "2025-01-15"
category: "Design"
excerpt: "Hoe je een design system opzet dat teams helpt consistente producten te bouwen."
featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
---

# Design systems die echt werken

Een design system is meer dan een component library - het's een levend ecosysteem van patterns, principes en tools.

## Waarom design systems?

### Problemen die ze oplossen:

1. **Inconsistentie**: Dezelfde button ziet er overal anders uit
2. **Duplication**: Teams bouwen dezelfde componenten opnieuw
3. **Slow iterations**: Elk feature vergt custom design work
4. **Poor collaboration**: Designers en developers spreken verschillende talen

### Voordelen:

- **Snelheid**: Ship features 3-5x sneller
- **Consistentie**: Unified brand experience
- **Schaalbaarheid**: Groei zonder chaos
- **Quality**: Getest en accessible uit de box

## De fundamenten

### 1. Design tokens

De kleinste bouwstenen - atomaire design values:

```json
{
  "color": {
    "brand": {
      "primary": "#0066FF",
      "secondary": "#6B7280"
    },
    "neutral": {
      "50": "#F9FAFB",
      "900": "#111827"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem"
  },
  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem"
    }
  }
}
```

**Tools:**
- [Style Dictionary](https://amzn.github.io/style-dictionary/) - Generate tokens for platforms
- [Theo](https://github.com/salesforce-ux/theo) - Salesforce's token transformer

### 2. Component Library

Build op je tokens:

```jsx
// Button.tsx
import { tokens } from './tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      style={{
        backgroundColor: tokens.color.brand[variant],
        padding: `${tokens.spacing[size]} ${tokens.spacing[size === 'sm' ? 'md' : 'lg']}`,
        fontFamily: tokens.typography.fontFamily.sans,
        fontSize: tokens.typography.fontSize[size],
      }}
      {...props}
    />
  );
}
```

### 3. Documentation

Niemand gebruikt wat ze niet begrijpen:

**Essentials:**
- **When to use**: Duidelijke use cases
- **Variants**: Alle states (default, hover, disabled, etc.)
- **Props**: API documentation
- **Examples**: Code snippets + live preview
- **Accessibility**: WCAG compliance notes

**Tools:**
- [Storybook](https://storybook.js.org/) - Component explorer
- [Docusaurus](https://docusaurus.io/) - Documentation sites
- [zeroheight](https://zeroheight.com/) - Design system hub

## Architectuur patterns

### Atomic Design

Organize van klein naar groot:

```
Atoms (kleinste bouwstenen)
  └─ Button, Input, Label, Icon

Molecules (groepen atoms)
  └─ SearchField (Input + Button)
  └─ FormField (Label + Input + Error)

Organisms (complex UI)
  └─ Navigation Bar
  └─ Product Card

Templates (page layouts)
  └─ Dashboard Layout
  └─ Article Layout

Pages (instances)
  └─ Homepage
  └─ Product Detail Page
```

### Component variants

```tsx
// Gebruik discriminated unions voor type safety
type Button =
  | { variant: 'primary'; theme: 'light' | 'dark' }
  | { variant: 'secondary' }
  | { variant: 'ghost'; icon?: React.ReactNode };

function Button(props: Button) {
  if (props.variant === 'primary') {
    // TypeScript weet: theme bestaat!
    return <button className={`btn-${props.theme}`} />;
  }
  // ...
}
```

## Governance: Wie beslist wat?

### Design System Team

**Core team** (2-4 mensen):
- Product Designer (lead)
- Frontend Engineer (lead)
- Accessibility specialist
- (Part-time) Content designer

**Responsibilities:**
- Maintain component library
- Review contribution requests
- Evangelize adoption
- Measure impact

### Contribution model

```
1. Request (via GitHub issue)
   ↓
2. Review (design + engineering)
   ↓
3. Prototype (in Figma + code)
   ↓
4. Test (accessibility, browser compat)
   ↓
5. Document (usage guide + examples)
   ↓
6. Release (semantic versioning)
```

## Versioning & Distribution

### Semantic versioning

```bash
# Patch: Bug fixes
v1.0.1 → v1.0.2

# Minor: New features (backward compatible)
v1.0.2 → v1.1.0

# Major: Breaking changes
v1.1.0 → v2.0.0
```

### Changelogst

```markdown
## [2.0.0] - 2025-01-15

### Breaking Changes
- Button: Removed `type` prop in favor of `variant`

### Added
- Button: New `loading` state
- Input: Built-in validation

### Fixed
- Select: Keyboard navigation on Safari
```

### Distribution

```bash
# NPM package
npm install @company/design-system

# Import
import { Button, Input } from '@company/design-system';
```

## Measuring success

### Adoption metrics

```javascript
// Track component usage
const components = scanCodebase();

const adoptionRate = {
  Button: components.filter(c => c.library === 'design-system').length / components.length,
  // Expected: > 80%
};
```

### Efficiency metrics

- **Time to ship**: Before vs after design system
- **Code reuse**: % components from library vs custom
- **Design debt**: Outstanding inconsistencies

### Quality metrics

- **Accessibility**: WCAG violations (should be 0)
- **Performance**: Bundle size impact
- **Browser support**: Compatibility matrix

## Tools & Stack

### Design (Figma)

```
├── 🎨 Foundations
│   ├── Colors (with tokens)
│   ├── Typography
│   └── Spacing
│
├── 🧩 Components
│   ├── Atoms
│   ├── Molecules
│   └── Organisms
│
└── 📚 Templates
```

**Plugins:**
- [Figma Tokens](https://www.figma.com/community/plugin/843461159747178978) - Sync design tokens
- [Contrast](https://www.figma.com/community/plugin/748533339900865323) - Check accessibility

### Code (React/TypeScript)

```typescript
// Component structure
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── ...
├── tokens/
│   └── index.ts
└── index.ts
```

### Testing

```typescript
// Component tests
describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('is keyboard accessible', () => {
    render(<Button>Click</Button>);
    userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});
```

**Visual regression:**
- [Chromatic](https://www.chromatic.com/) - Automated visual testing
- [Percy](https://percy.io/) - Visual review platform

## Real-world examples

### Material Design (Google)

- **Comprehensive**: Components for alle use cases
- **Cross-platform**: Web, Android, iOS
- **Themeable**: Customizable tokens

### Polaris (Shopify)

- **Opinionated**: Strong guidelines
- **Commerce-focused**: Built for e-commerce
- **Accessible**: WCAG AAA waar mogelijk

### Ant Design

- **Enterprise-grade**: Complex data tables, forms
- **International**: 40+ languages
- **Large ecosystem**: 200+ components

## Anti-patterns (vermijd dit!)

### ❌ Perfectionism paralysis

Wachten tot alles perfect is voordat je shipped.

**Fix:** Start klein, iterate vaak.

### ❌ "Build it and they will come"

Geen adoptie strategie.

**Fix:** Educate teams, showcase wins, provide migration guides.

### ❌ Design system dictatorship

Top-down zonder input van teams.

**Fix:** Collaborative contribution model.

### ❌ Over-engineering

100 props voor elke edge case.

**Fix:** 80/20 rule - support most common use cases, allow escape hatches.

## Checklist voor succesvol design system

- [ ] Design tokens gedefinieerd (colors, spacing, typography)
- [ ] Component library met minimum 10 core components
- [ ] Documentation site met live examples
- [ ] Contribution guidelines gepubliceerd
- [ ] Automated testing (unit + visual regression)
- [ ] Accessibility checklist per component
- [ ] Versioning & changelog process
- [ ] Adoption metrics dashboard
- [ ] Dedicated team/owner

## Conclusie

Een design system is een investment die zich terugbetaalt in:

- **Snelheid**: 3-5x faster feature development
- **Kwaliteit**: Fewer bugs, better UX
- **Schaal**: Teams blijven aligned tijdens groei

**Start klein:**
1. Document bestaande patterns
2. Build 5 core components (Button, Input, Card, Modal, Layout)
3. Ship & iterate based on feedback
4. Expand gradually

> "A design system is never finished, only versioned."

**Resources:**
- [Design Systems Repo](https://designsystemsrepo.com/)
- [Adele](https://adele.uxpin.com/) - Repository of public design systems
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
