import zap from "zapatos/db";
import type * as schema from "zapatos/schema";

import { getPool } from "../db.js";
import { Message } from "../../common/types/index.js";
import { publishMessage } from "./index.js";

export async function addAuditRow(options: {
    action: schema.audit_action;
    table_name: string;
    user_id: string;
    data: zap.JSONValue;
}) {
    const auditLog = await zap
        .insert("audit", {
            action: options.action,
            table_name: options.table_name,
            user_id: options.user_id,
            data: zap.param(options.data, true),
        })
        .run(getPool());

    // In real app we wouldn't want to publish these...
    publishMessage<Message>("sse", {
        type: "db-change",
        table: "audit",
        data: { op: "c", row: auditLog },
    });

    return auditLog;
}
