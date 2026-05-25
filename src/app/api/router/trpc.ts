import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import type { Context } from "./context";

// const t = initTRPC.create();
const t = initTRPC.context<Context>().create();
/**
 * Auth middleware — SERVER ONLY
 */
const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId,
    },
  });
});

/**
 * Exports
 */
export const router = t.router;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const createCallerFactory = t.createCallerFactory;
