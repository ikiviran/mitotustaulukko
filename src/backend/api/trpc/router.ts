import { displayGroupRouter } from "./display-group.js";
import { createTrpcRouter } from "./trpc.js";

export const trpcRouter = createTrpcRouter({
    dg: displayGroupRouter,
});

// Export router type signature to be used in the frontend.
export type TrpcRouter = typeof trpcRouter;
