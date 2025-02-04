import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import bodyParser from "body-parser";
import cors from "cors";
import { expressRouter } from "./api/express/router.js";
import { trpcRouter } from "./api/trpc/router.js";
import { createTrpcContext } from "./api/trpc/trpc.js";
import { env } from "./env.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api", expressRouter);
app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
        router: trpcRouter,
        createContext: createTrpcContext,
        batching: {
            enabled: false,
        },
    })
);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
