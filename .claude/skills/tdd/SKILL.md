---
name: tdd
description: >
  Test-Driven Development methodology for TypeScript/Next.js projects.
  Auto-triggered when writing tests, implementing features with TDD, or
  when test coverage is discussed. Covers vitest patterns, Playwright E2E,
  and the RED-GREEN-REFACTOR cycle. Use `/tdd <feature>` to run a TDD cycle.
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
  - AskUserQuestion
context: fork
agent: tdd-guide
---

# TDD Workflow

## The Cycle

```
EXPLORE -> RED -> GREEN -> REFACTOR -> (repeat)
```

### 0. EXPLORE
- Read the requirement/bug report
- Read existing code and tests in the area
- Identify what to test and what to mock
- Plan the first test

### 1. RED (Write Failing Test)
```bash
# Write ONE test describing expected behavior
# Run it:
pnpm vitest run src/lib/feature.test.ts
# It MUST fail for the right reason
# STOP here. No implementation yet.
```

### 2. GREEN (Minimal Implementation)
```bash
# Write MINIMUM code to pass the test
# Run:
pnpm vitest run src/lib/feature.test.ts
# Must pass. Then run full suite:
pnpm vitest run
# No regressions allowed.
```

### 3. REFACTOR (Improve)
```bash
# Improve code quality (extract, rename, simplify)
# After EACH change:
pnpm vitest run
# Must stay green. If red, revert immediately.
```

## Test Patterns

### AAA (Arrange-Act-Assert) — Unit tests
```typescript
import { describe, it, expect } from "vitest";
import { calculateTotal } from "./cart";

describe("calculateTotal", () => {
  it("should return 0 for empty cart", () => {
    // Arrange
    const items: CartItem[] = [];
    // Act
    const result = calculateTotal(items);
    // Assert
    expect(result).toBe(0);
  });
});
```

### GWT (Given-When-Then) — Behavioral tests
```typescript
import { describe, it, expect } from "vitest";
import { applyDiscount } from "./cart";

describe("CartCheckout", () => {
  describe("applying discount code", () => {
    it("given a valid 20% code, when applied to 1000 yen cart, then total is 800", () => {
      // Given
      const cart = createCart({ total: 1000 });
      const code = "SAVE20";
      // When
      const result = applyDiscount(cart, code);
      // Then
      expect(result.total).toBe(800);
    });

    it("given an expired code, when applied, then returns error", () => {
      // Given
      const cart = createCart({ total: 1000 });
      const code = "EXPIRED";
      // When
      const result = applyDiscount(cart, code);
      // Then
      expect(result.ok).toBe(false);
      expect(result.error).toBe("DISCOUNT_EXPIRED");
    });
  });
});
```

### AAA vs GWT
| Pattern | Best for |
|---------|----------|
| AAA | Pure functions, utilities, data transforms |
| GWT | User actions, business rules, state transitions |

Mixing in a project is fine. Stay consistent within a file.

### Component Test (vitest + testing-library)
```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("should show error on invalid email", async () => {
    render(<LoginForm />);
    const input = screen.getByLabelText("Email");
    await userEvent.type(input, "invalid");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

### E2E Test (Playwright)
```typescript
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/dashboard");
});
```

## When to Use What

| Scenario | Test Type | Tool |
|----------|-----------|------|
| Pure function logic | Unit | vitest |
| Component behavior | Unit | vitest + testing-library |
| Multiple modules | Integration | vitest |
| Full user flow | E2E | Playwright |
| Visual regression | E2E | Playwright screenshots |

## Coverage

- Target: 80%+ lines and branches
- Check: `pnpm vitest run --coverage`
- Critical paths (auth, payments): 100%
- Run coverage before committing

## References
- See `rules/common/tdd.md` for detailed TDD rules
