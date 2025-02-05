import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { expressRouter } from "./api/express/router.js";
import { trpcRouter } from "./api/trpc/router.js";
import { createTrpcContext } from "./api/trpc/trpc.js";
import { env } from "./env.js";
import { subscribeToChannel } from "./services/dummy-pubsub.js";
import { sendServerSentEvent } from "./api/express/sse.js";
import { Message } from "../common/types/message.js";

const _dirname = path.dirname(fileURLToPath(import.meta.url));

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

app.use("/public", express.static(path.join(_dirname, "../../output/frontend")));

app.get("*", (_req, res) => {
    res.sendFile(path.join(_dirname, "../../output/frontend/index.html"));
});

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

subscribeToChannel("sse", (message: Message) => {
    sendServerSentEvent(message);
});

process.once("SIGINT", () => {
    console.log("Received SIGINT. Exiting ...");
    process.exit(2);
});
process.once("SIGTERM", () => {
    console.log("Received SIGTERM. Exiting ...");
    process.exit(3);
});
