import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@complete-web-template/api";
import { createAuthClient } from "better-auth/client";

const trpcUrl = "/api/trpc";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcUrl,
      headers() {
        // @ts-expect-error - getCookie exists at runtime but types are incomplete
        const cookies = authClient.getCookie();
        return cookies ? { Cookie: cookies } : {};
      },
    }),
  ],
});