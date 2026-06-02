import { log } from "@clack/prompts";
import { loadCredentials, clearCredentials, isExpired, authClient } from "../../lib/auth/index.js";

export const status = async (): Promise<void> => {
  const credentials = loadCredentials();

  if (!credentials) {
    log.info("Not logged in. Run 'auth login' to authenticate.");
    return;
  }

  if (isExpired(credentials)) {
    log.warn("Session expired. Run 'auth login' to authenticate again.");
    clearCredentials();
    return;
  }

  // Verify the session with the server
  try {
    const response = await authClient.getSession({
      fetchOptions: {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      },
    });

    if (response?.data?.user) {
      const { name, email } = response.data.user;
      log.success(`Logged in as ${name} (${email})`);
      return;
    }
  } catch (error) {
    log.warn(`Could not verify session with server — using cached credentials.`);
  }

  // Fall back to local credentials
  log.success(`Logged in as ${credentials.user.name} (${credentials.user.email})`);
};