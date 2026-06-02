# CLAUDE.md

Always speak in English.

## Project Overview

This is a monorepo with these core packages:

| Package | Purpose |
|---------|---------|
| `packages/auth` | Authentication logic, Better Auth configuration, auth middleware |
| `packages/db` | Drizzle ORM schema (auth tables + app tables) + database client |
| `packages/api` | tRPC server — exposes DB operations through typed procedures |
| `packages/sdk` | Isomorphic TypeScript SDK consumed by CLI and Web |
| `apps/cli` | Command-line tool (uses SDK) |
| `apps/web` | Next.js web application (uses SDK) |

## Data Flow

```
packages/auth          ← Auth logic (Better Auth, device flow, sessions)
       ↓
packages/db            ← ALL tables (auth tables + app tables), never elsewhere
       ↓
packages/api           ← tRPC procedures using db + auth
       ↓
packages/sdk           ← Isomorphic SDK wrapping tRPC
       ↓
apps/cli + apps/web    ← Consume SDK
```

## Architecture

```
packages/
├── auth/              # AUTH LAYER — only place for auth logic
│   └── src/
│       ├── config.ts      # Better Auth server configuration
│       ├── index.ts       # Auth exports (session helpers, middleware)
│       └── ...
├── db/                # SCHEMA LAYER — ALL tables here, nowhere else
│   └── src/db/
│       ├── index.ts       # Drizzle instance + re-exports
│       └── schema/
│           └── index.ts   # Auth tables + app tables + relations
└── api/               # API LAYER — tRPC routers using db + auth
    └── src/
        ├── context.ts     # Creates tRPC context (session + user lookup)
        ├── init.ts        # Procedure definitions (public, protected, admin)
        ├── routers/       # Route handlers
        └── auth/          # Auth-related tRPC middleware (uses packages/auth)
```

## Database Schema Rules

### Location
- **ALL tables** (auth tables AND app tables) are defined in `packages/db/src/db/schema/index.ts`
- **No tables** are defined elsewhere — not in `api`, not in `auth`, not in `apps`

### Auth tables vs App tables
- Auth tables (managed by Better Auth): `user`, `session`, `account`, `verification`
- App tables: `users`, `posts`, etc. (your application data)

The context (`packages/api/src/context.ts`) bridges them by looking up the `users.role` from the app `users` table using the better-auth user's email.

### Adding a New App Table

1. Define the table in `packages/db/src/db/schema/index.ts`

```typescript
export const myTable = pgTable("my_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 256 }).notNull(),
  // ... columns
}, (table) => [
  // Indexes on nullable/filtered columns — critical for performance
  index("my_table_name_idx").on(table.name),
]);
```

**Rules:**
- Always add an index on columns used in `where` clauses (especially nullable filtered ones like `deletedAt`)
- Add a `unique()` constraint on columns that must be unique
- If the table has a foreign key, add an index on it (e.g., `ownerId`)
- Always include `deletedAt: timestamp("deleted_at")` for soft-delete support
- Always include `createdAt` and `updatedAt` timestamps

2. Define relations (if the table has relationships)

```typescript
export const myTableRelations = relations(myTable, ({ one, many }) => ({
  owner: one(users, { fields: [myTable.ownerId], references: [users.id] }),
  // ... other relations
}));
```

3. Rebuild the db package

```bash
pnpm --filter @complete-web-template/db build
```

4. Use the table in the API

```typescript
// In any router
import { db, myTable, eq } from '@complete-web-template/db';
```

## Authentication

### Location
All authentication logic lives in `packages/auth`:
- Better Auth server configuration (`config.ts`)
- Auth middleware and helpers
- Device flow, OAuth callbacks, session management

### API Integration
The `packages/api` uses `packages/auth` to:
- Validate sessions in tRPC context
- Create protected procedures (require authentication)
- Create admin procedures (require admin role)
- Handle auth middleware for routes

### SDK Patterns
The `packages/sdk` exposes auth operations in patterns consumed by:
- `apps/cli` — device flow auth, token storage
- `apps/web` — session management, React hooks

## API Layer

### tRPC Procedures
All API routes are defined in `packages/api/src/routers/`. Each router:
1. Uses `packages/db` for database access
2. Uses `packages/auth` for session validation
3. Exposes procedures via tRPC

### Context Creation
`packages/api/src/context.ts` creates the tRPC context by:
1. Getting session from Better Auth (via `packages/auth`)
2. Looking up user role from the `users` app table
3. Passing `{ session, user }` to all procedures

## Database Migrations

Migrations are managed with Drizzle Kit CLI at the repo root:

```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate

# Push schema to database (dev only)
pnpm drizzle-kit push

# Open studio to inspect
pnpm drizzle-kit studio

# Drop everything (dev only)
pnpm drizzle-kit drop
```

## Key Conventions

### Soft-delete Pattern
Every application table must have a `deletedAt` timestamp column. Queries **must** filter out deleted rows:

```typescript
// GOOD — uses B-tree index on deletedAt
.where(isNull(myTable.deletedAt))

// BAD — full table scan at scale
.where(eq(myTable.deletedAt, null))
```

### Schema exports
All schema symbols (`tables`, `relations`, `enums`) are re-exported from `@complete-web-template/db` via `packages/db/src/db/index.ts`. Only import schema symbols from this package — never directly from `drizzle-orm` in the api package.

### Connection management
The `db` export in `@complete-web-template/db` is a lazy singleton. The Pool is created on first use, not at module import. This is safe for serverless environments.

### Type safety
- Never cast context user to add fields — extend `createContext` to look up additional data from the `users` table
- Never import `drizzle-orm` directly in the api package — use re-exports from `@complete-web-template/db`
- Never put auth logic anywhere except `packages/auth`
- Never put table definitions anywhere except `packages/db`

## Running

```bash
# Install deps
pnpm install

# Build all
pnpm build

# Type-check
pnpm --filter @complete-web-template/api exec tsc --noEmit
pnpm --filter @complete-web-template/db build
```

## Web Search

When performing web searches, you MUST use the `fresh` CLI tool. Never use other search methods.

### Fresh CLI Usage

```bash
# Search the web
fresh search "your search query"

# Fetch content from a specific URL
fresh fetch <url>
```

### Examples

```bash
# Search for React documentation
fresh search "React documentation 2026"

# Get content from a specific page
fresh fetch https://react.dev/docs
```

Available commands:
- `fresh auth` - Authentication commands
- `fresh search [options]` - Search the web using Exa.ai
- `fresh fetch [options] <url>` - Fetch and extract content from a URL
