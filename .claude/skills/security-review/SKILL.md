---
name: security-review
description: >
  Security review checklist for Next.js applications. Auto-triggered during
  security reviews, auth implementation, API route creation, or when handling
  user input. Covers OWASP Top 10, Next.js-specific security, and auth patterns.
model: opus
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
context: fork
agent: security-reviewer
---

# Security Review Checklist

## OWASP Top 10 for Next.js

### 1. Injection (SQL, NoSQL, Command)
- [ ] All user input validated with Zod before use
- [ ] Parameterized queries (no string concatenation in SQL)
- [ ] No `eval()`, `Function()`, or `child_process.exec()` with user input

### 2. Broken Authentication
- [ ] Passwords hashed with bcrypt/argon2 (never plain text)
- [ ] Session tokens are httpOnly, secure, sameSite
- [ ] Rate limiting on auth endpoints
- [ ] No credentials in URL parameters

### 3. Sensitive Data Exposure
- [ ] No secrets in `NEXT_PUBLIC_*` env vars
- [ ] API keys/tokens only in server-side code
- [ ] Sensitive data not logged or included in error messages
- [ ] HTTPS enforced in production

### 4. XSS (Cross-Site Scripting)
- [ ] No `dangerouslySetInnerHTML` with user input
- [ ] User input escaped in all rendering contexts
- [ ] Content-Security-Policy headers configured
- [ ] No `eval()` or inline scripts

### 5. CSRF (Cross-Site Request Forgery)
- [ ] Server Actions have built-in CSRF protection
- [ ] API routes validate Origin/Referer headers
- [ ] SameSite cookie attribute set

### 6. Security Misconfiguration
- [ ] No debug mode in production
- [ ] Error pages don't expose stack traces
- [ ] Security headers set (X-Frame-Options, X-Content-Type-Options)
- [ ] Next.js security headers in `next.config.ts`

### 7. Broken Access Control
- [ ] Auth checks in middleware for protected routes
- [ ] Server Actions verify user permissions before mutations
- [ ] API routes check authorization (not just authentication)
- [ ] No direct object references without ownership verification

## Next.js-Specific Checks

### Server Actions
```typescript
"use server";

export async function deleteUser(id: string) {
  // REQUIRED: Validate input
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) throw new Error("Invalid ID");

  // REQUIRED: Check authorization
  const session = await getSession();
  if (!session?.user?.isAdmin) throw new Error("Unauthorized");

  // REQUIRED: Verify ownership/permission
  await db.user.delete({ where: { id: parsed.data } });
}
```

### Environment Variables
```
# Server-only (safe)
DATABASE_URL=...
API_SECRET=...

# Client-exposed (NEVER put secrets here)
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_SITE_NAME=...
```

### Middleware Auth Pattern
```typescript
export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

## Dependency Audit

```bash
# Check for known vulnerabilities
pnpm audit

# Update vulnerable packages
pnpm audit --fix
```

## Security Headers (next.config.ts)

```typescript
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
```

## Output Format

When performing a security review, output findings as:

| Severity | Category | File:Line | Finding | Remediation |
|----------|----------|-----------|---------|-------------|
| Critical | Injection | `src/app/api/users/route.ts:15` | Unvalidated user input in SQL | Add Zod validation |
| High | Auth | `src/middleware.ts:3` | Missing auth check for /admin | Add session verification |
| Medium | XSS | `src/components/comment.tsx:8` | dangerouslySetInnerHTML | Use DOMPurify or text rendering |
