import express from "express";

import { getMeaningOfLife } from "../../../common/util.js";

export const foobarRouter = express.Router();

foobarRouter.get("/", (_req, res) => {
    res.json({ message: "Hello World", meaningOfLife: getMeaningOfLife() });
});
