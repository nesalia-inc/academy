---
name: cli-commander-clack
description: CLI uses Commander for parsing and @clack/prompts for output (replaced @clack/core + manual argv parsing)
type: project
---

## CLI stack: Commander + @clack/prompts

**What changed:**
- Replaced manual `process.argv` switch in `index.ts` with Commander `program.command().action()`
- Replaced `@clack/core` with `@clack/prompts` (higher-level API with `log.info/success/warn/error`)
- Replaced all `console.log` / `console.error` with `log.info()`, `log.success()`, `log.warn()`, `log.error()`
- Tests mock `@clack/prompts` via `vi.mock()` at the top of the test file

**Why:**
- Commander gives free `--help`, `--version`, subcommand nesting, and unknown command validation
- @clack/prompts gives styled output (spinners, color, symbols) with a simpler API than @clack/core
- No functional changes — same commands (`auth login/status/logout`), same behavior

**Files changed:**
- `apps/cli/package.json` — replaced `@clack/core` with `commander` + `@clack/prompts`
- `apps/cli/src/index.ts` — Commander-based router
- `apps/cli/src/commands/auth.ts` — clack `log.*` instead of `console.*`
- `apps/cli/src/lib/auth/device-flow.ts` — clack `log.*` instead of `console.*`
- `apps/cli/tests/auth.test.ts` — mocks `@clack/prompts` module

**Tests updated:** All 5 passing.