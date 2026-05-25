import prisma from "@/lib/prisma";

export async function createContext() {
  return {
    db: prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
