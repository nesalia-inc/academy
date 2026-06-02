// Re-export everything from submodules
export { authClient } from "./client.js";
export type { AuthClient } from "./client.js";

export { startDeviceFlow } from "./device-flow/index.js";
export type { AuthFlowResult } from "./device-flow/types.js";

export {
  saveCredentials,
  loadCredentials,
  clearCredentials,
  isExpired,
  requireAuth,
  type StoredCredentials,
} from "./storage.js";

import { log } from "@clack/prompts";
import { loadCredentials, clearCredentials, isExpired, type StoredCredentials } from "./storage.js";

/**
 * HOF - wraps an async operation requiring authentication.
 * Checks credentials before execution, exits with error message if not authed.
 */
export async function withAuth<T>(
  fn: (credentials: StoredCredentials) => Promise<T>,
): Promise<T> {
  const credentials = loadCredentials();

  if (!credentials) {
    log.error("Not logged in. Run 'auth login' first.");
    process.exit(1);
  }

  if (isExpired(credentials)) {
    log.error("Session expired. Run 'auth login' again.");
    clearCredentials();
    process.exit(1);
  }

  return fn(credentials);
}