import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@complete-web-template/api";

// Types inferred from AppRouter procedures (posts table columns only)
interface PostListOutput {
  items: Array<{
    id: number;
    slug: string;
    title: string | null;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
  }>;
  nextCursor: number | undefined;
}

interface PostByIdOutput {
  id: number;
  slug: string;
  title: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

interface PostCreateOutput {
  id: number;
  slug: string;
  title: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface SDKOptions {
  /** Base URL of the API (default: http://localhost:3000) */
  baseUrl?: string;
  /** Custom headers (e.g., Authorization: Bearer token) */
  headers?: Record<string, string>;
}

export interface PostsClient {
  list(input?: { cursor?: number; limit?: number }): Promise<PostListOutput>;
  byId(input: { id: number }): Promise<PostByIdOutput | null>;
  create(input: { title: string; slug?: string }): Promise<PostCreateOutput>;
}

export interface SDKClient {
  posts: PostsClient;
}

export function createClient(options: SDKOptions = {}): SDKClient {
  const baseUrl = options.baseUrl ?? "http://localhost:3000";
  const headers = options.headers ?? {};

  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${baseUrl}/api/trpc`,
        headers: () => headers,
      }),
    ],
  });

  return {
    posts: {
      list: (input) => trpc.post.list.query(input) as Promise<PostListOutput>,
      byId: (input) => trpc.post.byId.query(input) as Promise<PostByIdOutput | null>,
      create: (input) => trpc.post.create.mutate(input) as Promise<PostCreateOutput>,
    },
  };
}