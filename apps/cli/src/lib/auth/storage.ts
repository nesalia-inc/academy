import Conf from "conf";
import { log } from "@clack/prompts";

export type StoredCredentials = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
  expiresAt: number;
};

// Support test configuration via environment variable
const configPath = process.env.CLI_AUTH_CONFIG_PATH;

export const storage = new Conf<{ credentials: StoredCredentials | null }>({
  projectName: "complete-web-template",
  configName: "auth",
  cwd: configPath, // Use custom path if set (for tests)
  defaults: {
    credentials: null,
  },
});

export function saveCredentials(credentials: StoredCredentials): void {
  storage.set("credentials", credentials);
}

export function loadCredentials(): StoredCredentials | null {
  const raw = storage.get("credentials");

  // Guard against corrupted storage (e.g., old version, partial write)
  if (
    !raw ||
    typeof raw !== "object" ||
    !("accessToken" in raw) ||
    !("user" in raw) ||
    !("expiresAt" in raw)
  ) {
    clearCredentials();
    return null;
  }

  return raw as StoredCredentials;
}

export function clearCredentials(): void {
  storage.delete("credentials");
}

export function isExpired(credentials: StoredCredentials): boolean {
  return Date.now() > credentials.expiresAt;
}

export function requireAuth(): StoredCredentials {
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
  return credentials;
}