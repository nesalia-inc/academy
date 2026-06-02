import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@complete-web-template/api";
import { loadCredentials } from "../auth/index.js";

const BASE_URL = process.env.CLI_AUTH_API_URL ?? "http://localhost:3000";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
      headers() {
        const creds = loadCredentials();
        if (creds?.accessToken) {
          return { Authorization: `Bearer ${creds.accessToken}` };
        }
        return {};
      },
    }),
  ],
});