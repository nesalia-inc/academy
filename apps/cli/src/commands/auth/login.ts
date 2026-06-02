import { log } from "@clack/prompts";
import { saveCredentials, type StoredCredentials, startDeviceFlow } from "../../lib/auth/index.js";

export const login = async (): Promise<void> => {
  try {
    const result = await startDeviceFlow();

    const credentials: StoredCredentials = {
      accessToken: result.accessToken,
      user: result.user,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    saveCredentials(credentials);
    log.success("Successfully logged in!");
  } catch (error) {
    log.error(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
};