---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---
# Code Style

Based on Google TypeScript Style Guide: https://google.github.io/styleguide/tsguide.html

## TypeScript

- Enable `strict: true` in tsconfig.json (always)
- Prefer `interface` for object types; use `type` only for unions, intersections, and mapped types
- Use `satisfies` for type narrowing with inferred types
- Use `as const` objects instead of enums (`const enum` is also prohibited)
- Avoid `any`; use `unknown` + type guards for unknown shapes
- Explicit return types for exported functions; inferred for internal
- Omit type annotations for trivially inferred types (string, number, boolean, RegExp, `new` expressions)
- Use discriminated unions for complex state (`type: "loading" | "error" | "success"`)
- Branded types for IDs: `type UserId = string & { __brand: "UserId" }`
- Simple arrays: `T[]`; complex element types: `Array<{...}>`; immutable: `readonly T[]`
- Do not include `| null` or `| undefined` in type aliases — add at usage site
- Type assertions: `as` syntax only (no angle brackets); comment why it is safe
- `null`/`undefined` checks: `== null` may cover both

## Exports / Imports

- **No default exports** — always use named exports (exception: App Router convention files like `page.tsx`, `layout.tsx`)
- No `export let` — expose mutable values via getter functions
- No container classes — export individual functions and constants
- No `namespace` — use `import`/`export` only

Import order (enforced by Biome):
1. Built-in modules (`node:fs`, `node:path`)
2. External packages (`react`, `next`)
3. Internal aliases (`@/lib`, `@/components`)
4. Relative imports (`./utils`, `../types`)

Blank line between each group.

## Variables & Functions

- `const` by default; `let` only when reassignment needed; never `var`
- Prefer function declarations for named functions; use arrow functions for callbacks
- No function expressions — use arrow functions instead
- Prefer early returns over nested `if/else`
- Max function length: ~50 lines (guideline)
- Destructure props and objects at function boundary
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Use rest parameters instead of `arguments`
- Use spread syntax instead of `Function.prototype.apply`

## Classes

- No `#private` fields — use `private` / `protected` / `public` modifiers
- Mark non-reassigned properties as `readonly`
- Use parameter properties (`constructor(private readonly x: T)`)
- Never add or remove properties after constructor completes
- Getters must be pure functions (no side effects)
- Always use parentheses: `new Foo()`; no prototype manipulation

## Control Flow

- Always use braces `{}` for control statements (`if`, `for`, `while`, etc.)
- Avoid variable assignments inside control statements
- Use `for...of` for array iteration — never `for...in` on arrays
- Always use `===` / `!==` (exception: `== null`)
- Never implicitly coerce enum values to boolean; use explicit comparison

## Error Handling

- Result pattern for expected failures: `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }`
- try/catch only at system boundaries (API routes, event handlers)
- Keep try blocks as small as possible
- Only throw `Error` instances (`throw new Error(...)`)
- Never swallow errors silently; empty `catch` blocks require a comment explaining why
- Typed error classes extending `Error` for domain errors

## switch

- Always include a `default` case
- No fall-through for non-empty cases

## Naming

- Files: kebab-case (`auth-service.ts`)
- Components: PascalCase (`UserProfile`)
- Functions/variables: camelCase (`getUserById`)
- Types/Interfaces: PascalCase, no `I-` prefix (`User`, not `IUser`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_RETRIES`)
- Boolean variables: `is-`/`has-`/`should-` prefix (`isLoading`, `hasAccess`)
- Event handlers: `handle-` prefix (`handleSubmit`)
- Treat abbreviations as whole words: `loadHttpUrl` (not `loadHTTPURL`)

## Literals & Type Coercion

- Use single quotes for strings; template literals for complex concatenation
- Use `String()`, `Boolean()`, `Number()` for type coercion
- No unary `+` for string-to-number conversion
- Use `parseInt` only when a non-decimal radix is needed

## Comments

- Use `/** JSDoc */` for public API documentation
- Use `//` line comments for implementation details (no `/* */` block comments)
- Write JSDoc content in Markdown

## Prohibited

- `var` / `eval()` / `Function(...string)` / `with` / `debugger` (production)
- Wrapper types (`String`, `Boolean`, `Number` objects)
- Modifying built-in prototypes
- Custom decorators (only framework-provided decorators allowed)
- Do not rely on Automatic Semicolon Insertion (ASI)

## Formatting

- Biome handles all formatting; do not add manual formatting rules
- Run `pnpm biome check --write .` before committing
- Biome config in `biome.json` at project root
