---
paths:
  - "package.json"
  - "pnpm-lock.yaml"
  - "biome.json"
  - "vitest.config.*"
  - "playwright.config.*"
  - "justfile"
  - "tsconfig*.json"
---
# Tooling

## Package Manager: pnpm

- Always use pnpm (never npm or yarn)
- Version: pnpm v24+ (Node.js 24+ runs TypeScript natively)
- Install: `pnpm install`
- Add package: `pnpm add <pkg>` / `pnpm add -D <pkg>`
- Run script: `pnpm <script>` (e.g., `pnpm vitest run`)
- Lock file: `pnpm-lock.yaml` (always commit)

## Task Runner: justfile

- Define project tasks in `justfile` at project root
- Run: `just <recipe>` (e.g., `just test`, `just build`)
- Prefer justfile recipes over raw pnpm scripts for multi-step tasks

Example recipes:
```just
test:
    pnpm vitest run

test-coverage:
    pnpm vitest run --coverage

lint:
    pnpm biome check .

format:
    pnpm biome check --write .

typecheck:
    pnpm tsc --noEmit

check: lint typecheck test
```

## Formatter/Linter: Biome

- Single tool for formatting AND linting (replaces ESLint + Prettier)
- Config: `biome.json` at project root
- Format + lint: `pnpm biome check --write .`
- Lint only: `pnpm biome lint .`
- Format only: `pnpm biome format --write .`
- Check only (no write): `pnpm biome check .`
- CI: `pnpm biome ci .` (fails on any issue)

## Testing: vitest

- Config: `vitest.config.ts`
- Run all: `pnpm vitest run`
- Watch mode: `pnpm vitest`
- Coverage: `pnpm vitest run --coverage`
- Single file: `pnpm vitest run src/lib/auth.test.ts`

## E2E Testing: Playwright

- Config: `playwright.config.ts`
- Run all: `pnpm playwright test`
- UI mode: `pnpm playwright test --ui`
- Single file: `pnpm playwright test e2e/auth.spec.ts`
- Generate: `pnpm playwright codegen`

## TypeScript

- Strict mode: `"strict": true` in tsconfig.json
- Type check: `pnpm tsc --noEmit`
- Path aliases: `@/*` -> `src/*`
