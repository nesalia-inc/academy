import { log } from "@clack/prompts";
import { loadCredentials, clearCredentials, authClient } from "../../lib/auth/index.js";

export const logout = async (): Promise<void> => {
  const credentials = loadCredentials();

  if (!credentials) {
    log.info("Not logged in.");
    return;
  }

  // Invalidate token on the server (best effort)
  try {
    await authClient.signOut({
      fetchOptions: {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      },
    });
  } catch {
    // Non-fatal: the token might already be expired or revoked
  }

  clearCredentials();
  log.success("Successfully logged out.");
};