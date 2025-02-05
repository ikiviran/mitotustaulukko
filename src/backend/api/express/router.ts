import { Router } from "express";

import { foobarRouter } from "./foobar.js";
import { sseRouter } from "./sse.js";

export const expressRouter = Router();

expressRouter.use("/foobar", foobarRouter);
expressRouter.use("/sse", sseRouter);
