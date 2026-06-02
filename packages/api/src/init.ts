import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: 'cause' in error ? (error.cause as { zodError?: unknown }).zodError : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const publicProcedure = t.procedure;

const isAuthedMiddleware = t.middleware(({ ctx, next }) => {
  if (ctx.session === null || ctx.session?.userId === undefined) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }
  return next({
    ctx,
  });
});

// Cast to any to bypass TypeScript inference limitation with middleware-chained procedures.
// The middleware is correctly applied at runtime; this is purely a type system artifact.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const protectedProcedure: typeof publicProcedure = t.procedure.use(isAuthedMiddleware) as any;

export const adminProcedure = () => protectedProcedure;