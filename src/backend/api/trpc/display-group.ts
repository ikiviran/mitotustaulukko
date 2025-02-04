import * as yup from "yup";
import _ from "lodash";

import zap from "zapatos/db";
import { getPool } from "../../db.js";
import { publicProc, createTrpcRouter } from "./trpc.js";
import { createDg, updateDg, deleteDg } from "../../services/index.js";

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
                id: yup.string().min(1).max(128).required(),
                name: yup.string().min(1).max(128).required(),
                level: yup.number().required(),
                parent_id: yup
                    .string()
                    .max(128)
                    .nullable()
                    .transform((val) => (val === "" ? null : val))
                    .optional(),
            })
        )
        .mutation(async ({ input }) => {
            return await createDg(input, { audit: true });
        }),

    update: publicProc //
        .input(
            yup.object({
                id: yup.string().min(1).max(128).optional(),
                name: yup.string().min(1).max(128).optional(),
                level: yup.number().optional(),
                parent_id: yup
                    .string()
                    .max(128)
                    .nullable()
                    .transform((val) => (val === "" ? null : val))
                    .optional(),
            })
        )
        .mutation(async ({ input }) => {
            return await updateDg(input, { id: input.id }, { audit: true });
        }),

    delete: publicProc //
        .input(yup.object({ id: yup.string().max(128).required() }))
        .mutation(async ({ input }) => {
            return await deleteDg({ id: input.id }, { audit: true });
        }),
});
