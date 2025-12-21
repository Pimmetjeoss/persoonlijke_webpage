---
title: "10 TypeScript tips voor betere code"
date: "2025-02-20"
category: "Development"
excerpt: "Praktische tips om je TypeScript code robuuster en onderhoudbaarder te maken."
featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
---

# 10 TypeScript tips voor betere code

TypeScript kan overweldigend zijn, maar deze praktische tips helpen je om het maximale uit de taal te halen.

## 1. Use `unknown` instead of `any`

`any` schakelt type checking uit. `unknown` dwingt je om te valideren:

```typescript
// ❌ Slecht
function processData(data: any) {
  return data.value.toUpperCase(); // Runtime error mogelijk
}

// ✅ Goed
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    const value = (data as { value: unknown }).value;
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
  }
  throw new Error('Invalid data');
}
```

## 2. Discriminated Unions voor state management

Perfect voor Redux of React state:

```typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function renderUser(state: RequestState<User>) {
  switch (state.status) {
    case 'idle':
      return <div>Start loading...</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{state.data.name}</div>; // TypeScript weet: data bestaat!
    case 'error':
      return <div>Error: {state.error}</div>;
  }
}
```

## 3. Utility types zijn je vriend

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Haal password weg voor API response
type PublicUser = Omit<User, 'password'>;

// Maak alles optional voor updates
type UserUpdate = Partial<User>;

// Alleen id en name nodig
type UserPreview = Pick<User, 'id' | 'name'>;

// Maak alles required
type RequiredUser = Required<User>;
```

## 4. Template Literal Types

Genereer type-safe strings:

```typescript
type Color = 'red' | 'blue' | 'green';
type Shade = 'light' | 'dark';

// Genereer: 'light-red' | 'light-blue' | 'light-green' | 'dark-red' ...
type ColorVariant = `${Shade}-${Color}`;

const myColor: ColorVariant = 'light-red'; // ✅
const invalid: ColorVariant = 'medium-red'; // ❌ Type error
```

## 5. `satisfies` operator (TypeScript 4.9+)

Valideer types zonder type widening:

```typescript
type Route = { path: string; component: string };

// ❌ Probleem: routes is type Route[], je verliest specifieke info
const routes: Route[] = [
  { path: '/', component: 'Home' },
  { path: '/about', component: 'About' },
];

// ✅ Oplossing: satisfies behoudt specifieke types
const routes = [
  { path: '/', component: 'Home' },
  { path: '/about', component: 'About' },
] satisfies Route[];

routes[0].path; // Type: "/" (specifiek!)
```

## 6. Branded Types voor veiligheid

Voorkom dat ID's worden verwisseld:

```typescript
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

function getUser(id: UserId) { /* ... */ }

const userId = createUserId('user-123');
const productId = createProductId('prod-456');

getUser(userId); // ✅
getUser(productId); // ❌ Type error! Voorkomt bugs
```

## 7. Const Assertions voor immutability

```typescript
// Type: string[]
const colors1 = ['red', 'green', 'blue'];

// Type: readonly ["red", "green", "blue"]
const colors2 = ['red', 'green', 'blue'] as const;

// Object immutability
const config = {
  api: 'https://api.example.com',
  timeout: 3000,
} as const;

config.api = 'new-url'; // ❌ Cannot assign to 'api' because it is read-only
```

## 8. Index Signatures met keyof

Type-safe object access:

```typescript
interface Translations {
  en: { welcome: string; goodbye: string };
  nl: { welcome: string; goodbye: string };
}

function getTranslation<
  L extends keyof Translations,
  K extends keyof Translations[L]
>(lang: L, key: K): Translations[L][K] {
  const translations: Translations = {
    en: { welcome: 'Welcome', goodbye: 'Goodbye' },
    nl: { welcome: 'Welkom', goodbye: 'Tot ziens' },
  };

  return translations[lang][key];
}

getTranslation('nl', 'welcome'); // ✅ "Welkom"
getTranslation('fr', 'hello'); // ❌ Type errors
```

## 9. Conditional Types

Types die afhangen van andere types:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Praktisch voorbeeld:
type Flatten<T> = T extends Array<infer U> ? U : T;

type Nums = Flatten<number[]>; // number
type Str = Flatten<string>;    // string
```

## 10. Strict mode configuratie

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,                        // Enable all strict checks
    "noUncheckedIndexedAccess": true,     // array[0] kan undefined zijn
    "noImplicitOverride": true,            // Expliciet override keyword
    "exactOptionalPropertyTypes": true,    // undefined !== missing property
    "noUnusedLocals": true,                // Geen unused variables
    "noUnusedParameters": true,            // Geen unused parameters
    "noFallthroughCasesInSwitch": true    // Geen missing breaks
  }
}
```

## Bonus: Type Guards

Custom type checking functies:

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript weet: value is string
    return value.toUpperCase();
  }
}
```

## Conclusie

TypeScript is krachtig, maar alleen als je het goed gebruikt. Deze tips helpen je om:

- **Type safety** te maximaliseren
- **Runtime errors** te voorkomen
- **Developer experience** te verbeteren
- **Codebase maintainability** te verhogen

**Start vandaag:**
1. Enable strict mode
2. Vervang `any` door `unknown`
3. Gebruik utility types
4. Experimenteer met deze patterns!
