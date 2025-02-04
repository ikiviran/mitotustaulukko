import * as yup from "yup";
import _ from "lodash";

import zap from "zapatos/db";
import { getPool } from "../../db.js";
import { publicProc, createTrpcRouter } from "./trpc.js";

export const displayGroupRouter = createTrpcRouter({
    getAll: publicProc //
        .query(async () => {
            return zap.select("display_group", zap.all).run(getPool());
        }),

    getById: publicProc //
        .input(yup.object({ id: yup.string().max(128).required() }))
        .query(async ({ input }) => {
            return zap.select("display_group", { id: input.id }).run(getPool());
        }),

    create: publicProc //
        .input(
            yup.object({
                id: yup.string().max(128).required(),
                name: yup.string().max(128).required(),
                level: yup.number().required(),
                parent_id: yup.string().max(128).optional(),
            })
        )
        .mutation(async ({ input }) => {
            return zap.insert("display_group", input).run(getPool());
        }),

    update: publicProc //
        .input(
            yup.object({
                id: yup.string().max(128).required(),
                name: yup.string().max(128).required(),
                level: yup.number().required(),
                parent_id: yup.string().max(128).nullable().optional(),
            })
        )
        .mutation(async ({ input }) => {
            return zap
                .update("display_group", _.omit(input, "id"), { id: input.id })
                .run(getPool());
        }),
});
