---
title: "Toegankelijkheid is geen optie"
date: "2025-01-30"
category: "Webdesign"
excerpt: "Waarom elke website toegankelijk moet zijn en hoe je dit bereikt zonder concessies te doen aan design."
---

# Toegankelijkheid is geen optie

15% van de wereldbevolking heeft een beperking. Dat zijn **1 miljard** mensen die jouw website mogelijk niet kunnen gebruiken. Tijd om dat te veranderen.

## Waarom accessibility belangrijk is

### 1. Het is de wet

- **EU**: Web Accessibility Directive (verplicht voor overheidssites)
- **VS**: ADA (Americans with Disabilities Act)
- **NL**: Tijdelijk besluit digitale toegankelijkheid overheid

### 2. Het is goed voor business

- Grotere doelgroep (15% meer potentiële klanten)
- Betere SEO (screenreader-friendly = search-engine-friendly)
- Hogere conversies (gebruiksvriendelijker voor iedereen)

### 3. Het is het juiste om te doen

Toegang tot informatie is een mensenrecht.

## WCAG Guidelines

Web Content Accessibility Guidelines heeft 4 principes (**POUR**):

### Perceivable (Waarneembaar)

Informatie moet beschikbaar zijn voor alle zintuigen:

```html
<!-- ❌ Slecht: Image zonder alt text -->
<img src="/chart.png">

<!-- ✅ Goed: Beschrijvende alt text -->
<img src="/chart.png" alt="Bar chart showing 40% increase in sales Q4 2024">
```

### Operable (Bedienbaar)

Alle functionaliteit via keyboard:

```html
<!-- ❌ Slecht: Div als button -->
<div onclick="submit()">Send</div>

<!-- ✅ Goed: Semantische button -->
<button type="submit">Send</button>
```

### Understandable (Begrijpelijk)

Duidelijke labels en foutmeldingen:

```html
<!-- ❌ Slecht: Onduidelijke error -->
<span>Invalid input</span>

<!-- ✅ Goed: Specifieke error met aria-live -->
<span role="alert" aria-live="polite">
  Email moet een @ bevatten
</span>
```

### Robust (Robuust)

Compatibel met assistive technology:

```html
<!-- ✅ Semantische HTML -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

## Praktische implementatie

### Keyboard navigatie

**Alle interactieve elementen** moeten keyboard accessible zijn:

```jsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    // Trap focus in modal
    const modal = document.getElementById('modal');
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }

    modal.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  return isOpen ? (
    <div
      id="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
}
```

### Focus indicators

```css
/* ❌ NOOIT doen */
*:focus {
  outline: none;
}

/* ✅ Custom maar duidelijke focus */
:focus-visible {
  outline: 3px solid hsl(220, 90%, 56%);
  outline-offset: 2px;
}
```

### Screen reader only content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```html
<button>
  <svg>...</svg>
  <span class="sr-only">Delete item</span>
</button>
```

## ARIA: When and How

**Regel #1**: Gebruik semantic HTML eerst!

```html
<!-- ❌ Slecht -->
<div role="button" tabindex="0" onclick="...">Click me</div>

<!-- ✅ Goed -->
<button>Click me</button>
```

### Common ARIA patterns

**Loading states:**
```html
<div aria-live="polite" aria-busy="true">
  Loading data...
</div>
```

**Required fields:**
```html
<label for="email">
  Email <span aria-label="required">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-error"
>
<span id="email-error" role="alert">
  <!-- Error message here -->
</span>
```

**Tabs:**
```html
<div role="tablist">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="panel-1"
    id="tab-1"
  >
    Tab 1
  </button>
  <button
    role="tab"
    aria-selected="false"
    aria-controls="panel-2"
    id="tab-2"
  >
    Tab 2
  </button>
</div>

<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  Content 1
</div>
```

## Form Accessibility

```html
<form>
  <!-- Labels zijn VERPLICHT -->
  <label for="name">
    Full Name
    <span aria-label="required">*</span>
  </label>
  <input
    id="name"
    type="text"
    required
    aria-required="true"
    aria-describedby="name-hint name-error"
  >
  <span id="name-hint" class="hint">
    Enter your first and last name
  </span>
  <span id="name-error" role="alert" class="error">
    <!-- Dynamically populated -->
  </span>

  <!-- Group related inputs -->
  <fieldset>
    <legend>Contact Preferences</legend>
    <label>
      <input type="checkbox" name="email" value="yes">
      Email updates
    </label>
    <label>
      <input type="checkbox" name="sms" value="yes">
      SMS updates
    </label>
  </fieldset>

  <button type="submit">Submit Form</button>
</form>
```

## Color & Contrast

Gebruik niet **alleen** kleur voor betekenis:

```html
<!-- ❌ Slecht: Alleen kleur voor status -->
<span style="color: red;">Error</span>
<span style="color: green;">Success</span>

<!-- ✅ Goed: Icon + kleur + text -->
<span class="status-error">
  <svg aria-hidden="true">❌</svg>
  <span>Error: Invalid input</span>
</span>
```

## Testing Tools

### Automated tools:

1. **[axe DevTools](https://www.deque.com/axe/devtools/)** - Browser extension
2. **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** - Built into Chrome
3. **[WAVE](https://wave.webaim.org/)** - Visual feedback tool

### Manual testing:

```bash
# Test keyboard navigation
Tab, Shift+Tab, Enter, Space, Arrow keys

# Test with screen reader
- MacOS: VoiceOver (Cmd+F5)
- Windows: NVDA (free)
- Linux: Orca
```

## Common Patterns

### Skip to content link

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<main id="main-content">
  <!-- Content -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Accessible dropdown

```html
<button
  aria-expanded="false"
  aria-controls="dropdown-menu"
  aria-haspopup="true"
>
  Menu
</button>

<ul id="dropdown-menu" hidden>
  <li><a href="/profile">Profile</a></li>
  <li><a href="/settings">Settings</a></li>
  <li><a href="/logout">Logout</a></li>
</ul>
```

## Accessibility Checklist

- [ ] Alle images hebben alt text (of alt="" voor decoratief)
- [ ] Heading hiërarchie is logisch (h1 → h2 → h3)
- [ ] Alle forms hebben labels
- [ ] Kleurcontrast voldoet aan WCAG AA (4.5:1)
- [ ] Website is volledig keyboard navigable
- [ ] Focus indicators zijn zichtbaar
- [ ] ARIA wordt correct gebruikt (of vermeden)
- [ ] Errors zijn duidelijk en specifiek
- [ ] Live regions voor dynamische updates
- [ ] Getest met screen reader

## Resources

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)

## Conclusie

Accessibility is geen afterthought - het is fundamenteel goed design. Een toegankelijke website is:

- **Beter** voor iedereen
- **Makkelijker** te onderhouden
- **Bereikt** meer mensen
- **Voldoet** aan de wet

> "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect." - Tim Berners-Lee

**Begin vandaag:**
1. Run axe DevTools op je site
2. Fix de makkelijke wins (alt text, labels)
3. Test met keyboard
4. Leer één ARIA pattern per week
