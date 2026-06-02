import { log } from "@clack/prompts";
import { trpcClient } from "../../lib/api/client.js";
import { requireAuth } from "../../lib/auth/storage.js";

interface CreateOptions {
  title: string;
  slug?: string;
}

export const create = async ({ title, slug }: CreateOptions): Promise<void> => {
  try {
    requireAuth(); // Ensure user is logged in
    log.info(`Creating post "${title}"...`);

    const post = await trpcClient.post.create.mutate({
      title,
      slug,
    });

    if (!post) {
      log.error("Failed to create post.");
      return;
    }

    log.success(`Post created!`);
    console.log(`  ID:    ${post.id}`);
    console.log(`  Title: ${post.title}`);
    console.log(`  Slug:  ${post.slug}`);
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