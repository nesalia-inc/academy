import { log } from "@clack/prompts";
import open from "open";
import type { AuthClient } from "../client.js";
import { CLIENT_ID, SCOPE } from "./config.js";
import { AuthFlowError } from "./errors.js";

export interface DeviceCodeResult {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  interval: number;
}

export const requestDeviceCode = async (client: AuthClient): Promise<DeviceCodeResult> => {
  log.info("Requesting device authorization...");

  const { data, error } = await client.device.code({
    client_id: CLIENT_ID,
    scope: SCOPE,
  });

  if (error || !data) {
    const msg = error?.error_description ?? "Failed to get device code";
    throw new AuthFlowError(msg);
  }

  return {
    deviceCode: data.device_code,
    userCode: data.user_code,
    verificationUri: data.verification_uri_complete,
    interval: data.interval ?? 5,
  };
};

export const openBrowser = async (uri: string): Promise<void> => {
  await open(uri).catch(() => {
    // Non-fatal: browser may fail to open, user can still use the URL
  });
};