import { log } from "@clack/prompts";
import type { AuthClient } from "../client.js";
import { CLIENT_ID, POLL_TIMEOUT_MS, MAX_NETWORK_RETRIES } from "./config.js";
import { isTransientError } from "./errors.js";
import type { AuthFlowResult } from "./types.js";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const resolveUser = async (client: AuthClient, accessToken: string): Promise<AuthFlowResult["user"]> => {
  const response = await client.getSession({
    fetchOptions: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });

  const user = response?.data?.user;
  if (!user) {
    throw new Error("Could not retrieve user session.");
  }
  return { id: user.id, name: user.name, email: user.email, image: user.image ?? undefined };
};

export const pollForToken = async (
  client: AuthClient,
  deviceCode: string,
  intervalSeconds: number,
  startedAt = Date.now(),
  networkRetries = 0,
): Promise<AuthFlowResult> => {
  if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
    throw new Error("Authorization timed out. Please try again.");
  }

  let data: Awaited<ReturnType<AuthClient["device"]["token"]>>["data"];
  let error: Awaited<ReturnType<AuthClient["device"]["token"]>>["error"];

  try {
    const result = await client.device.token({
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      device_code: deviceCode,
      client_id: CLIENT_ID,
    });
    data = result.data;
    error = result.error;
  } catch (err) {
    if (isTransientError(err)) {
      const retries = networkRetries + 1;
      if (retries > MAX_NETWORK_RETRIES) {
        throw new Error(`Network error after ${MAX_NETWORK_RETRIES} retries. Check your connection.`);
      }
      log.warn(`Network error during polling — retry ${retries}/${MAX_NETWORK_RETRIES}.`);
      await sleep(intervalSeconds * 1000);
      return pollForToken(client, deviceCode, intervalSeconds, startedAt, retries);
    }
    throw err;
  }

  if (data?.access_token) {
    log.success("Authorization successful!");
    const user = await resolveUser(client, data.access_token);
    if (!user.id) {
      throw new Error("Could not retrieve user information. Please try again.");
    }
    log.success(`Connected as ${user.name || user.email || "user"}`);
    return { accessToken: data.access_token, user };
  }

  if (error) {
    switch (error.error) {
      case "authorization_pending":
        await sleep(intervalSeconds * 1000);
        return pollForToken(client, deviceCode, intervalSeconds, startedAt);
      case "slow_down":
        const newInterval = intervalSeconds + 5;
        log.warn(`Slowing down polling to ${newInterval}s`);
        await sleep(newInterval * 1000);
        return pollForToken(client, deviceCode, newInterval, startedAt);
      case "access_denied":
        throw new Error("Authorization was denied.");
      case "expired_token":
        throw new Error("The code expired. Please try again.");
      default:
        throw new Error(error.error_description ?? `Unexpected error: ${error.error}`);
    }
  }

  // No data and no error — should not happen, but guard anyway
  await sleep(intervalSeconds * 1000);
  return pollForToken(client, deviceCode, intervalSeconds, startedAt);
};