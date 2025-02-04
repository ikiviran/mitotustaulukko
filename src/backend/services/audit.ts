import zap from "zapatos/db";
import type * as schema from "zapatos/schema";

import { getPool } from "../db.js";

export async function addAuditRow(options: {
    action: schema.audit_action;
    table_name: string;
    user_id: string;
    data: zap.JSONValue;
}) {
    await zap
        .insert("audit", {
            action: options.action,
            table_name: options.table_name,
            user_id: options.user_id,
            data: zap.param(options.data, true),
        })
        .run(getPool());
}
