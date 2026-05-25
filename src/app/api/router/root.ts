// src/server/api/root.ts
import { createTRPCRouter, createCallerFactory } from "./trpc";
import { projectRouter } from "./project";

export const appRouter = createTRPCRouter({
  project: projectRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
