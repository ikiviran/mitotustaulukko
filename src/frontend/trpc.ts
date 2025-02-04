import { createTRPCProxyClient, httpLink } from "@trpc/client";

import type { TrpcRouter } from "../backend/api/trpc/router.js";

export const trpc = createTRPCProxyClient<TrpcRouter>({
    links: [httpLink({ url: "http://localhost:3000/api/trpc" })],
});
