---
paths:
  - "**/components/**/*"
  - "**/app/**/*.tsx"
---
# Component Patterns

## Server vs Client Decision Tree

```
Need hooks (useState, useEffect)? -> Client Component
Need event handlers (onClick)?    -> Client Component
Need browser APIs (localStorage)? -> Client Component
Otherwise                         -> Server Component (default)
```

## Component Structure

```typescript
// Named export (no default export)
export function UserProfile({ userId }: UserProfileProps) {
  // hooks first
  // derived state
  // early returns (loading, error, empty)
  // main render
}
```

## Props

- Destructure at function signature
- Type with `interface`
- Use `??` for defaults (not default parameters on objects)

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", children }: ButtonProps) {
  // ...
}
```

## Composition Over Configuration

Prefer:
```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

Over:
```tsx
<Card title="Title" body="Content" />
```

## Component Organization

- `components/ui/` - Primitive components (Button, Input, Card)
- `components/` - Shared composite components (UserAvatar, NavBar)
- Colocated with page - Page-specific components

## Suspense & Error Boundaries

```tsx
// Wrap async components in Suspense
<Suspense fallback={<UserListSkeleton />}>
  <UserList />
</Suspense>

// Error boundary (must be 'use client')
<ErrorBoundary fallback={<ErrorMessage />}>
  <RiskyComponent />
</ErrorBoundary>
```

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)
- Add `aria-label` for icon-only buttons
- Ensure keyboard navigation (Tab, Enter, Escape)
- Provide alt text for images
- Use `role` attributes when semantic HTML isn't sufficient
- Test with screen reader and keyboard-only navigation
