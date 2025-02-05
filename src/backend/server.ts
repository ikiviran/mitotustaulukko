import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import bodyParser from "body-parser";
import cors from "cors";

import { expressRouter } from "./api/express/router.js";
import { trpcRouter } from "./api/trpc/router.js";
import { createTrpcContext } from "./api/trpc/trpc.js";
import { env } from "./env.js";
import { subscribeToChannel } from "./services/dummy-pubsub.js";
import { sendServerSentEvent } from "./api/express/sse.js";
import { Message } from "../common/types/message.js";

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

const unsubscribe = subscribeToChannel("sse", (message: Message) => {
    sendServerSentEvent(message);
});

process.on("SIGINT", () => {
    unsubscribe();
});
