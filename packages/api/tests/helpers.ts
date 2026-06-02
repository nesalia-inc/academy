import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "path";
import { fileURLToPath } from "url";
import { appRouter, createCallerFactory } from "../src";

const MIGRATIONS_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../db/src/migrations"
);

export interface TestContext {
  pg: PGlite;
  db: ReturnType<typeof drizzle>;
  caller: ReturnType<ReturnType<typeof createCallerFactory>>;
}

/**
 * Creates a fresh test context with PGlite + tRPC caller.
 * Creates an AUTHENTICATED session for testing protected procedures.
 *
 * @example
 * ```typescript
 * const { caller, db, pg } = await createAuthTestContext();
 * // caller.post.list() works because session.userId is defined
 * await pg.close();
 * ```
 */
export async function createAuthTestContext(): Promise<TestContext> {
  const pg = new PGlite();
  await pg.waitReady;

  const db = drizzle(pg);
  await migrate(db, { migrationsFolder: MIGRATIONS_PATH });

  // Authenticated session - userId is defined so protected procedures pass
  const mockSession = {
    id: "test-session-id",
    userId: "test-user-id",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    token: "test-token",
    ipAddress: "127.0.0.1" as string | null,
    userAgent: "test" as string | null,
  };

  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({ db, session: mockSession });

  return { pg, db, caller };
}