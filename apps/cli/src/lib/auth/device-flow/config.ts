export const CLIENT_ID = process.env.CLI_AUTH_CLIENT_ID ?? "cli";
export const POLL_TIMEOUT_MS = 30 * 60 * 1000; // 30 min max (matches server default expiresIn)
export const SCOPE = "openid profile email";
export const MAX_NETWORK_RETRIES = 3;