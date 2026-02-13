---
name: coding-standards
description: >
  TypeScript and Next.js coding standards. Auto-triggered when writing,
  reviewing, or refactoring TypeScript/React code. Covers type patterns,
  component patterns, Biome rules, and import conventions.
model: sonnet
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Coding Standards Quick Reference

## TypeScript Patterns

### Discriminated Unions (preferred for state)
```typescript
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

### Result Pattern (preferred for error handling)
```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

### Branded Types (for type-safe IDs)
```typescript
type UserId = string & { readonly __brand: unique symbol };
const createUserId = (id: string): UserId => id as UserId;
```

### Type Narrowing with `satisfies`
```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} satisfies Config; // Validates type but preserves literal types
```

### `as const` over Enums
```typescript
const Status = {
  Active: "active",
  Inactive: "inactive",
  Pending: "pending",
} as const;
type Status = (typeof Status)[keyof typeof Status];
```

## Import Order
1. Built-in (`node:*`)
2. External (`react`, `next`)
3. Internal (`@/lib/*`, `@/components/*`)
4. Relative (`./`, `../`)

## Key Rules
- No `any` (use `unknown` + type guards)
- No default exports (except Next.js pages/layouts)
- No enums (use `as const`)
- Explicit return types on exported functions
- `const` by default, `let` only when needed
- Early returns over nested conditionals
- Zod for runtime validation at boundaries

## References
- See `rules/common/code-style.md` for full style guide
- See `rules/nextjs/components.md` for component patterns
