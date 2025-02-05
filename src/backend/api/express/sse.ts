import express, { Request, Response } from "express";
import * as uuid from "uuid";

import { Message } from "../../../common/types/index.js";

export const sseRouter = express.Router();

let clients: { id: string; response: Response }[] = [];

export function sendServerSentEvent(message: Message) {
    clients.forEach((client) => {
        client.response.write(`data: ${JSON.stringify(message)}\n\n`);
    });
}

const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
};
sseRouter.get("/events", (request: Request, response: Response) => {
    response.writeHead(200, headers);

    const clientId = uuid.v4();

    const newClient = {
        id: clientId,
        response,
    };

    clients.push(newClient);
    console.log(`${clientId} Connection opened`);

    request.on("close", () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter((client) => client.id !== clientId);
    });
});
