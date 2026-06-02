import { log } from "@clack/prompts";
import { trpcClient } from "../../lib/api/client.js";
import { requireAuth } from "../../lib/auth/storage.js";

export const list = async (): Promise<void> => {
  try {
    requireAuth(); // Ensure user is logged in
    log.info("Fetching posts...");

    const result = await trpcClient.post.list.query({ limit: 20 });

    if (result.items.length === 0) {
      log.warn("No posts found.");
      return;
    }

    log.success(`Found ${result.items.length} post(s):`);
    for (const post of result.items) {
      console.log(`  [${post.id}] ${post.title} (slug: ${post.slug})`);
    }

    if (result.nextCursor !== undefined) {
      log.info(`More posts available. Use --cursor ${result.nextCursor} to load more.`);
    }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "data" in error) {
      const trpcError = error as { data?: { message?: string; code?: string } };
      log.error(trpcError.data?.message ?? "Unknown error");
      if (trpcError.data?.code) {
        log.error(`Error code: ${trpcError.data.code}`);
      }
    } else {
      log.error(error instanceof Error ? error.message : "Unknown error");
    }
    process.exit(1);
  }
};