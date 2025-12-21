---
title: "React 19: De belangrijkste nieuwe features"
date: "2025-03-05"
category: "Development"
excerpt: "Een diepgaande analyse van de nieuwste React versie en wat dit betekent voor developers."
---

# React 19: Wat is er nieuw?

React 19 brengt een golf van innovaties die de manier waarop we webapplicaties bouwen fundamenteel verandert. Laten we de belangrijkste features verkennen.

## Server Components: De toekomst is nu

React Server Components zijn eindelijk stabiel in React 19:

```jsx
// Server Component (standaard in Next.js 15+)
async function BlogPost({ id }) {
  const post = await db.posts.findById(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

**Voordelen:**
- Directe database toegang zonder API layer
- Zero client-side JavaScript voor static content
- Betere performance en SEO

## Actions: Formulieren zonder gedoe

De nieuwe `useActionState` hook maakt form handling een stuk eenvoudiger:

```jsx
'use client';

import { useActionState } from 'react';

function CommentForm() {
  const [state, submitAction] = useActionState(
    async (prevState, formData) => {
      const comment = formData.get('comment');
      await saveComment(comment);
      return { success: true };
    },
    { success: false }
  );

  return (
    <form action={submitAction}>
      <textarea name="comment" />
      <button type="submit">Submit</button>
      {state.success && <p>✓ Saved!</p>}
    </form>
  );
}
```

## use() Hook: Promises en Context vereenvoudigd

De `use()` hook kan zowel promises als context consumeren:

```jsx
function UserProfile({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved

  return <div>{user.name}</div>;
}
```

## Optimistic Updates: Instant feedback

```jsx
import { useOptimistic } from 'react';

function LikeButton({ postId, initialLikes }) {
  const [likes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (currentLikes) => currentLikes + 1
  );

  return (
    <button
      onClick={async () => {
        addOptimisticLike();
        await likePost(postId);
      }}
    >
      ❤️ {likes}
    </button>
  );
}
```

## ref als prop: Geen forwardRef meer nodig

```jsx
// React 18
const Button = forwardRef((props, ref) => {
  return <button ref={ref}>{props.children}</button>;
});

// React 19
function Button({ ref, children }) {
  return <button ref={ref}>{children}</button>;
}
```

## Document Metadata: SEO ingebouwd

```jsx
function BlogPost({ post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <article>{post.content}</article>
    </>
  );
}
```

React 19 rendert automatisch `<title>` en `<meta>` tags in de `<head>`.

## Breaking Changes

### Let op:

- **Strict Mode**: Dubbele rendering in development is verwijderd
- **PropTypes**: Niet meer ingebouwd (gebruik TypeScript!)
- **Context**: `defaultProps` deprecated voor function components

## Migratie tips

1. **Update dependencies:**
   ```bash
   npm install react@19 react-dom@19
   ```

2. **Test je app uitgebreid** (vooral Strict Mode gedrag)

3. **Verwijder forwardRef** waar mogelijk

4. **Overweeg Server Components** voor nieuwe features

## Conclusie

React 19 is een enorme stap voorwaarts. Server Components, Actions en de verbeterde DX maken React krachtiger en ontwikkelaar-vriendelijker dan ooit.

**Volgende stappen:**
- Probeer de nieuwe features in een side project
- Lees de [officiële release notes](https://react.dev)
- Migreer gradual, niet alles tegelijk
