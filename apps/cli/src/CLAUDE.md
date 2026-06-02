# CLAUDE.md — @complete-web-template/cli

## Overview

The CLI is a standalone Node.js binary for managing account authentication. It uses OAuth 2.0 Device Authorization Grant (RFC 8628) via Better Auth's `deviceAuthorizationClient` plugin.

## Commands

```
cli auth login   — Start device authorization flow
cli auth status  — Check authentication status
cli auth logout  — Clear stored credentials
```

Commands are defined with [Commander](https://www.npmjs.com/package/commander). Each command is a separate file under `src/commands/auth/`.

## Architecture

```
src/
├── index.ts               # Commander entry point — routes to commands
└── commands/
    ├── index.ts           # Barrel: re-exports login, status, logout
    └── auth/
        ├── index.ts       # Barrel: re-exports from login/status/logout
        ├── login.ts       # login command
        ├── status.ts     # status command
        └── logout.ts     # logout command

src/lib/auth/
├── client.ts      # authClient singleton (createAuthClient + deviceAuthorizationClient)
├── device-flow.ts # startDeviceFlow() — handles the OAuth2 device flow
└── storage.ts    # saveCredentials / loadCredentials / clearCredentials (conf package)
```

## Auth client

The client is a singleton exported from `lib/auth/client.ts`. It is created once at module load time with the base URL from environment variables.

```typescript
import { authClient } from "./lib/auth/client.js";
```

No factory function — export directly. The client is used by:
- `device-flow.ts` → for `device.code()` and `device.token()` polling
- `status.ts` → for `getSession()` to verify the stored token

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `CLI_AUTH_API_URL` | `http://localhost:3000` | Auth server base URL |
| `CLI_AUTH_CLIENT_ID` | `"cli"` | OAuth client identifier |
| `CLI_AUTH_CONFIG_PATH` | OS default | Path for `conf` storage (tests only) |

## Output

All output uses `@clack/prompts` (`log.info`, `log.success`, `log.warn`, `log.error`). Never use `console.log` / `console.error`.

## Development

```bash
pnpm --filter @complete-web-template/cli build   # Compile TypeScript
pnpm --filter @complete-web-template/cli test   # Run tests (Vitest)
```

Tests mock `@clack/prompts` at the top level. Each test re-imports `log` dynamically to access the mock:

```typescript
vi.mock("@clack/prompts", () => ({
  log: { info: vi.fn(), success: vi.fn(), ... },
}));

const { log } = await import("@clack/prompts");
expect(log.info).toHaveBeenCalledWith("...");
```

## Key Conventions

- **Commands are `const` arrow functions** — not `async function`.
- **`startDeviceFlow()` takes no arguments** — it reads `baseURL` from the `authClient` singleton.
- **Polling has a 30-minute timeout** — throws if the user never approves.
- **Never hardcode credentials** — all auth state flows through `storage.ts`.