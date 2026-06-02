import { log } from "@clack/prompts";
import { trpcClient } from "../../lib/api/client.js";
import { requireAuth } from "../../lib/auth/storage.js";

interface ByIdOptions {
  id: number;
}

export const byId = async ({ id }: ByIdOptions): Promise<void> => {
  try {
    requireAuth(); // Ensure user is logged in
    log.info(`Fetching post #${id}...`);

    const post = await trpcClient.post.byId.query({ id });

    if (!post) {
      log.warn(`Post #${id} not found.`);
      return;
    }

    log.success(`Post #${id}:`);
    console.log(`  Title: ${post.title}`);
    console.log(`  Slug:  ${post.slug}`);
    console.log(`  ID:    ${post.id}`);
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