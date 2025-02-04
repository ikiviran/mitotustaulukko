import { Router } from "express";

import { foobarRouter } from "./foobar.js";

export const expressRouter = Router();

expressRouter.use("/foobar", foobarRouter);
