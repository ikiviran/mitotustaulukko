import { Router } from "express";

import { foobarRouter } from "./foobar.js";
import { seeRouter } from "./sse.js";

export const expressRouter = Router();

expressRouter.use("/foobar", foobarRouter);
expressRouter.use("/sse", seeRouter);
