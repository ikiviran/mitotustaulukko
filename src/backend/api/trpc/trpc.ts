import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

export const createTrpcContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
    req,
    res,
});

export type TrpcContext = Awaited<ReturnType<typeof createTrpcContext>>;

export const trpc = initTRPC.context<TrpcContext>().create({
    isDev: true, // Todo: use env
    isServer: true,
});

export const createTrpcRouter = trpc.router;

export const publicProc = trpc.procedure;
