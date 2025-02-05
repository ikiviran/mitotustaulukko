import express from "express";

export const foobarRouter = express.Router();

foobarRouter.get("/", (_req, res) => {
    res.json({
        message: "Hello World",
    });
});
