import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAuthTestContext } from "./helpers";

describe("Middleware", () => {
  it("should work with authenticated context", async () => {
    const { caller, pg } = await createAuthTestContext();

    const result = await caller.post.list();
    expect(result).toBeDefined();

    await pg.close();
  });

  it("should work with another authenticated session", async () => {
    const { caller, pg } = await createAuthTestContext();

    const result = await caller.post.list();
    expect(result).toBeDefined();

    await pg.close();
  });
});

describe("Auth Session Context", () => {
  let ctx: Awaited<ReturnType<typeof createAuthTestContext>>;

  beforeAll(async () => {
    ctx = await createAuthTestContext();
  });

  afterAll(async () => {
    await ctx.pg.close();
  });

  it("should handle authenticated session", async () => {
    const result = await ctx.caller.post.list();
    expect(result).toBeDefined();
  });
});