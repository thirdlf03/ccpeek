---
name: frontend-patterns
description: >
  React and Next.js frontend design patterns. Auto-triggered when creating
  React components, implementing data fetching, managing state, or optimizing
  performance. Covers Server Components, Suspense, streaming, and rendering.
model: sonnet
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Frontend Patterns

## Server vs Client Components

```
Server Component (default)          Client Component ('use client')
- Fetch data directly               - useState, useEffect, useRef
- Access backend resources           - onClick, onChange handlers
- Keep secrets on server             - Browser APIs (localStorage)
- Zero JS sent to client             - Third-party client libraries
```

**Rule**: Push `'use client'` as far down the component tree as possible.

```tsx
// GOOD: Only the interactive part is a Client Component
function ProductPage({ id }: { id: string }) {   // Server Component
  const product = await getProduct(id);
  return (
    <div>
      <ProductInfo product={product} />           {/* Server */}
      <AddToCartButton productId={id} />          {/* Client */}
    </div>
  );
}
```

## Data Fetching Matrix

| Need | Pattern | Where |
|------|---------|-------|
| Initial page data | Direct fetch in Server Component | `page.tsx` |
| Shared data across components | `React.cache()` + Server Component | `lib/queries.ts` |
| Form submission | Server Action (`'use server'`) | `actions.ts` |
| Real-time updates | SWR/TanStack Query | Client Component |
| Optimistic UI | `useOptimistic` + Server Action | Client Component |

## State Management Hierarchy

Use the simplest solution that works:

1. **URL state** (`useSearchParams`) - Filters, pagination, tabs
2. **React state** (`useState`) - Local UI state
3. **Form state** (`useFormStatus`) - Form submission state
4. **React Context** - Theme, auth, locale (rarely changing)
5. **External store** (Zustand) - Complex shared state across many components

**Avoid**: Redux for new projects, prop drilling beyond 2 levels.

## Performance Patterns

### Dynamic Imports
```tsx
const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Client-only heavy library
});
```

### Streaming with Suspense
```tsx
export default function Page() {
  return (
    <>
      <Header />                                    {/* Immediate */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />                                   {/* Streams in */}
      </Suspense>
      <Suspense fallback={<FeedSkeleton />}>
        <Feed />                                    {/* Streams in */}
      </Suspense>
    </>
  );
}
```

### Image Optimization
```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority          // Above-the-fold images
  placeholder="blur" // Blur placeholder while loading
/>
```

### Memoization (use sparingly)
- `React.memo()` - Only for expensive components that re-render with same props
- `useMemo()` - Only for expensive computations
- `useCallback()` - Only when passing callbacks to memoized children
- **Default**: Don't memoize. Optimize only when you measure a problem.

## References
- See `rules/nextjs/architecture.md` for App Router conventions
- See `rules/nextjs/components.md` for component design patterns
- See `rules/nextjs/data-layer.md` for data fetching details
