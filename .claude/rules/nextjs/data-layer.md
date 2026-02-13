---
paths:
  - "**/app/**/*"
  - "**/lib/**/*"
  - "**/actions/**/*"
---
# Data Layer

## Server-Side Data Fetching

Server Components can fetch data directly:

```typescript
// In a Server Component
// App Router page files require default export
export default async function UsersPage() {
  const users = await getUsers(); // Direct database/API call
  return <UserList users={users} />;
}
```

No `useEffect`, no loading states needed in the component itself.

## Fetch with Caching

```typescript
// Cache for 60 seconds
const data = await fetch(url, { next: { revalidate: 60 } });

// No cache (always fresh)
const data = await fetch(url, { cache: "no-store" });

// Cache until manually revalidated
const data = await fetch(url, { cache: "force-cache" });
```

## Request Deduplication

Use `React.cache()` to deduplicate identical requests within a single render:

```typescript
import { cache } from "react";

export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});
```

Multiple components calling `getUser("123")` in the same render only execute one query.

## Server Actions (Mutations)

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const parsed = CreateUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const user = await db.user.create({ data: parsed.data });
  revalidatePath("/users");
  return { data: user };
}
```

Rules:
- Always validate input with Zod
- Return typed results (never throw from Server Actions)
- Revalidate affected paths after mutations
- Keep Server Actions in separate files (`actions.ts`)

## Client-Side Data

For interactive/real-time data on the client:
- Use SWR or TanStack Query
- Always set `staleTime` to avoid unnecessary refetches
- Deduplicate requests with query keys

## Validation at Boundaries

```typescript
// Zod schema as the single source of truth
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>; // Derive type from schema
```

## Streaming

Use Suspense for progressive rendering:

```tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />       {/* Streams in when ready */}
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />       {/* Streams in independently */}
      </Suspense>
    </div>
  );
}
```
