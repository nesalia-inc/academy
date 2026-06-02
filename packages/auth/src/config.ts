import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { apiKey } from "@better-auth/api-key";
import { bearer } from "better-auth/plugins/bearer";
import { deviceAuthorization } from "better-auth/plugins/device-authorization";
import { db, user, session, account, verification, apikey, deviceCode } from "@complete-web-template/db";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const auth = betterAuth({
  baseURL: BASE_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      apikey,
      deviceCode,
    },
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  plugins: [
    apiKey({
      enableSessionForAPIKeys: true,
      apiKeyHeaders: ["x-api-key"],
    }),
    deviceAuthorization({
      schema: {},
      expiresIn: "30m",
      interval: "5s",
      userCodeLength: 8,
      deviceCodeLength: 40,
      verificationUri: (BASE_URL || "http://localhost:3000") + "/device",
    }),
    bearer(),
  ],
});