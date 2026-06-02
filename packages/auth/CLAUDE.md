# CLAUDE.md — @complete-web-template/auth

This package is the **server-side authentication core** for the template. It wraps Better Auth with a Drizzle ORM adapter and exposes a ready-to-use `auth` instance consumed by the API and web app.

## What This Package Does

- Creates and exports the Better Auth server instance
- Connects Better Auth to PostgreSQL via the `@better-auth/drizzle-adapter`
- Registers the API key, bearer token, and device authorization plugins

## Architecture

```
packages/
├── auth/           ← This package
│   └── src/
│       ├── config.ts   # Better Auth instance + drizzleAdapter
│       └── index.ts    # Public exports
│
└── db/             ← Schema source of truth
    └── src/db/schema/index.ts
        ├── user, session, account, verification     ← Better Auth tables
        ├── apikey, deviceCode                     ← Plugin tables
        └── users, posts                           ← Application tables
```

### The Two-User Pattern

There are **two distinct user-related concepts** in this monorepo:

| Table | PK | Purpose | Managed by |
|-------|-----|---------|------------|
| `user` | text (UUID) | Auth identity — email, sessions, OAuth accounts | Better Auth |
| `users` | integer | Application data — roles, profile, app-level concerns | tRPC API |

Better Auth owns the `user` table (text PK). The application layer uses `users` (integer PK) for roles and business logic. The API context bridges them by looking up `users.role` from the `user.email` field.

### Drizzle Adapter Integration

```typescript
database: drizzleAdapter(db, {
  provider: "pg",                    // PostgreSQL
  schema: {
    user,                            // Better Auth user table
    session,                         // Session table
    account,                         // OAuth/account linking
    verification,                    // Email verification tokens
    apikey,                          // API key plugin
    deviceCode,                      // Device authorization plugin
  },
}),
```

Better Auth handles all auth-related tables automatically. The Drizzle schema in `packages/db` contains these definitions so that:
1. Migrations can be generated via `pnpm drizzle-kit generate`
2. Relations can be defined for the joins experimental feature

### Plugins Enabled

| Plugin | Purpose |
|--------|---------|
| `apiKey` | API key authentication with rate limiting |
| `bearer` | Bearer token support (for mobile/CLI) |
| `deviceAuthorization` | OAuth 2.0 device flow (smart TV, CLI, IoT) |

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `BETTER_AUTH_URL` | No | `http://localhost:3000` | Base URL for auth callbacks |
| `BETTER_AUTH_SECRET` | **Yes** | — | Session encryption secret (min 32 chars) |
| `GITHUB_CLIENT_ID` | No | — | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | — | GitHub OAuth client secret |
| `NEXT_PUBLIC_BASE_URL` | No | `http://localhost:3000` | Used as `baseURL` |

## Usage

This package exports the **server-side** auth instance. Better Auth splits into two parts:

### Server Side (this package)

The server instance is mounted in Next.js and used by tRPC context:

```
apps/web/app/api/auth/[...all]/route.ts  ← Better Auth handler
```

```typescript
// apps/web/app/api/auth/[...all]/route.ts
import { auth } from '@complete-web-template/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

```typescript
// packages/api/src/context.ts
import { auth } from '@complete-web-template/auth';
const session = await auth.api.getSession({ headers: req.headers });
```

### Client Side (createAuthClient)

The client is created via `createAuthClient` from `better-auth` and can be used **anywhere with an HTTP context**: web apps, CLI tools, SDKs. It communicates with the server handler mounted above.

| Consumer | Client Import | File Location |
|----------|--------------|---------------|
| Web App (React) | `better-auth/react` | `apps/web/lib/auth-client.ts` |
| CLI | `better-auth/client` | `apps/cli/src/lib/auth/device-flow.ts` |
| SDK | `better-auth/client` | `packages/sdk/src/client.ts` |

```typescript
// React web app — hooks available
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
});

// Usage: signIn.email(), useSession(), etc.
const { data: session } = authClient.useSession();
await authClient.signOut();
```

```typescript
// CLI or SDK — Node.js environment
import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient({ baseURL: baseUrl });

// Device flow (CLI) or bearer token auth
const { data, error } = await authClient.signIn.email({ email, password });
```

### Key Difference

| Side | What it does | Imported from |
|------|-------------|---------------|
| **Server** | Handles auth logic, DB adapter, session management | `@complete-web-template/auth` |
| **Client** | Makes HTTP calls to the server handler | `better-auth` (any variant) |

The client is **not** a direct DB connection — it calls the `/api/auth/*` endpoints exposed by the server handler.

### Cookie Forwarding (Web App)

On the web app, the tRPC client must forward session cookies to authenticate requests. The `authClient` from `better-auth/client` exposes `getCookie()` to read cookies from the browser, which are then sent to tRPC via `httpBatchLink` headers:

```typescript
// apps/web/trpc/client.ts
import { authClient } from "@/lib/auth-client"; // createAuthClient instance

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      headers() {
        const cookies = authClient.getCookie();
        return cookies ? { Cookie: cookies } : {};
      },
    }),
  ],
});
```

See `packages/api/CLAUDE.md` for the full context on how tRPC validates these forwarded cookies via `auth.api.getSession()`.

## Schema Relations (for Joins)

The `packages/db` schema defines relations for the Better Auth tables to support the experimental joins feature (2x–3x performance improvement on endpoints like `/get-session`):

```typescript
userRelations    → sessions, accounts
sessionRelations → user
accountRelations → user
```

To enable joins, set `experimental: { joins: true }` in the Better Auth config and ensure relations are defined in the Drizzle schema.

## Dependencies

```json
{
  "better-auth": "1.6.6",
  "@better-auth/drizzle-adapter": "1.6.6",
  "@better-auth/api-key": "1.6.6",
  "@complete-web-template/db": "workspace:*"  // Schema + db client
}
```

## Build

```bash
pnpm --filter @complete-web-template/auth build
```

## Key Conventions

- **Never import `user` from `better-auth` directly** — use the re-export from `@complete-web-template/db`
- **Never use the raw Better Auth user table** for application logic — use the `users` table (integer PK) via tRPC procedures
- All Better Auth tables use text primary keys (UUIDs); application tables use integer auto-increment PKs