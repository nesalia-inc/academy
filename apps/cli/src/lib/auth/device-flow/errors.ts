// Transient network error codes from Node.js
export const TRANSIENT_ERROR_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "ENOTFOUND",
  "ENETUNREACH",
]);

export const isTransientError = (error: unknown): boolean => {
  if (error && typeof error === "object") {
    const code = (error as { code?: string }).code;
    if (code && TRANSIENT_ERROR_CODES.has(code)) return true;
  }
  return false;
};

// Generic auth flow error (network or oauth)
export class AuthFlowError extends Error {
  constructor(
    message: string,
    public readonly isNetwork = false,
  ) {
    super(message);
    this.name = "AuthFlowError";
  }

  static network = (msg: string): AuthFlowError => new AuthFlowError(msg, true);
}