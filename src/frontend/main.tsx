import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./redux/store.js";
import { Application } from "./components/Application.js";
import { Message } from "../common/types/index.js";
import { dataActions } from "./redux/reducers/index.js";
import { AuditLog, DisplayGroup } from "../common/types/db.js";

const container = document.getElementById("app") as HTMLElement;
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <Application />
    </Provider>
);

// Setup SSE (server-sent events)
const events = new EventSource("http://localhost:3000/api/sse/events");
events.onopen = () => {
    console.log("sse connection opened");
};
events.onerror = (event) => {
    console.error("sse connection error", event);
};
events.onmessage = (event) => {
    const message = JSON.parse(event.data) as Message;
    console.log("new sse message", message);
    if (message.type === "db-change") {
        if (message.table === "display_group") {
            if (message.data.op === "c") {
                const dg = message.data.row as unknown as DisplayGroup;
                store.dispatch(dataActions.upsertDgs({ dgs: [dg] }));
            } else if (message.data.op === "u") {
                const dgs = message.data.rows as unknown as DisplayGroup[];
                store.dispatch(dataActions.upsertDgs({ dgs }));
            } else if (message.data.op === "d") {
                const ids = message.data.ids as number[];
                store.dispatch(dataActions.deleteDgs({ ids }));
            }
        } else if (message.table === "audit") {
            if (message.data.op === "c") {
                const auditLog = message.data.row as unknown as AuditLog;
                store.dispatch(dataActions.addAuditLog({ auditLog }));
            }
        } else {
            console.error("unknown table", message);
        }
    }
};
