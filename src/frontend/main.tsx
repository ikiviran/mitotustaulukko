import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./redux/store.js";
import { Application } from "./components/Application.js";
const container = document.getElementById("app") as HTMLElement;
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <Application />
    </Provider>
);
