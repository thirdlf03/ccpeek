---
name: refactor
description: "Safely refactor code while preserving test behavior"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - TaskCreate
  - TaskUpdate
  - TaskList
  - TaskGet
context: fork
---

You are now in safe refactoring mode. Every change must keep tests green.

## Instructions

1. **Preparation**
   - Read the affected code and ALL related tests
   - Run existing tests first:
     ```bash
     pnpm vitest run
     ```
   - They MUST pass before refactoring begins
   - If tests fail, fix them first (that's a different task)

2. **Plan**
   - Identify specific refactoring steps
   - Create a TaskList with sequenced changes
   - Each step should be ONE atomic change

3. **Execute** (for each step)
   - Make ONE change (rename, extract, simplify, move)
   - Run tests immediately:
     ```bash
     pnpm vitest run
     ```
   - If tests FAIL: revert the change and rethink
   - If tests PASS: continue to next step

4. **Finalize**
   - Run full test suite:
     ```bash
     pnpm vitest run
     ```
   - Run type check:
     ```bash
     pnpm tsc --noEmit
     ```
   - Format:
     ```bash
     pnpm biome check --write .
     ```

5. **Report**
   - What changed and why
   - Test results (before and after)
   - Any risks or follow-up needed

## Rules

- NEVER refactor without tests passing first
- ONE change at a time, tests after each
- If tests break, revert IMMEDIATELY
- No behavior changes during refactoring

## Arguments

The user will provide the file or area to refactor and the goal.
