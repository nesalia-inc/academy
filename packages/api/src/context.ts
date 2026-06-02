import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db as defaultDb } from '@complete-web-template/db';
import { auth } from '@complete-web-template/auth';

export interface Context {
  db: typeof defaultDb;
  user: { id: string; email: string; name: string | null; emailVerified: boolean; image: string | null } | null;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
  } | null;
}

export interface CreateContextOptions {
  injectedDb?: typeof defaultDb;
}

export async function createContext(
  opts: FetchCreateContextFnOptions,
  options?: CreateContextOptions,
): Promise<Context> {
  const session = await auth.api.getSession({ headers: opts.req.headers });
  const db = options?.injectedDb ?? defaultDb;

  return {
    db,
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name ?? null,
          emailVerified: session.user.emailVerified,
          image: session.user.image ?? null,
        }
      : null,
    session: session?.session
      ? {
          id: session.session.id,
          userId: session.session.userId,
          expiresAt: session.session.expiresAt,
          token: session.session.token,
          ipAddress: session.session.ipAddress ?? null,
          userAgent: session.session.userAgent ?? null,
        }
      : null,
  };
}