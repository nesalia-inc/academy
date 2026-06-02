import { log } from "@clack/prompts";
import { authClient } from "../client.js";
import { requestDeviceCode, openBrowser } from "./device-code.js";
import { pollForToken } from "./polling.js";
import type { AuthFlowResult } from "./types.js";

export const startDeviceFlow = async (): Promise<AuthFlowResult> => {
  const { deviceCode, userCode, verificationUri, interval } = await requestDeviceCode(authClient);

  log.message(
    `Open this URL in your browser:\n  ${verificationUri}\n` +
    `Or enter the code: ${userCode}`
  );

  await openBrowser(verificationUri);
  log.info(`Waiting for authorization... (polling every ${interval}s)`);

  return pollForToken(authClient, deviceCode, interval);
}