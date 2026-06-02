import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";

const BASE_URL = process.env.CLI_AUTH_API_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [deviceAuthorizationClient()],
});

export type AuthClient = typeof authClient;