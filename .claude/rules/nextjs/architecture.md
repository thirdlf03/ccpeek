---
paths:
  - "**/app/**/*"
  - "**/middleware.ts"
---
# Next.js Architecture (App Router)

## Directory Structure

```
src/app/
  layout.tsx          # Root layout (wraps all pages)
  page.tsx            # Home page (/)
  loading.tsx         # Loading UI (Suspense boundary)
  error.tsx           # Error UI (Error boundary)
  not-found.tsx       # 404 page
  (auth)/             # Route group (no URL segment)
    login/page.tsx    # /login
    register/page.tsx # /register
  dashboard/
    layout.tsx        # Dashboard layout
    page.tsx          # /dashboard
    settings/
      page.tsx        # /dashboard/settings
  api/
    health/route.ts   # GET /api/health
```

## Server Components (Default)

All components in `app/` are Server Components by default.

Use Server Components when:
- Fetching data
- Accessing backend resources directly
- Keeping sensitive data on server (tokens, API keys)
- Reducing client bundle size

## Client Components

Add `'use client'` directive only when needed:
- useState, useEffect, useRef, or other hooks
- Browser-only APIs (window, document, localStorage)
- Event handlers (onClick, onChange)
- Third-party client-only libraries

Push `'use client'` as far down the tree as possible.

## Layouts vs Templates

- **Layout**: Persists across navigations, preserves state. Use for navbars, sidebars.
- **Template**: Re-mounts on each navigation. Use for enter/exit animations, per-page analytics.

## Loading & Error Boundaries

- `loading.tsx`: Automatic Suspense boundary. Shows while page/layout loads.
- `error.tsx`: Automatic Error boundary. Must be a Client Component.
- `not-found.tsx`: Shown when `notFound()` is called.

## Server Actions

```typescript
"use server";

export async function createUser(formData: FormData) {
  // Validate input with Zod
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  // Perform mutation
  const user = await db.user.create(parsed.data);
  revalidatePath("/users");
  return { data: user };
}
```

- Always validate input (Zod)
- Always revalidate affected paths
- Return typed results, not throwing

## Middleware

- File: `middleware.ts` (project root, or `src/middleware.ts` if using `src/` directory)
- Use for: auth checks, redirects, headers, i18n
- Keep lightweight (Edge runtime limitations)

## Metadata

```typescript
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};

// Or dynamic:
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: `User ${params.id}` };
}
```
