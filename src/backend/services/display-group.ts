import zap from "zapatos/db";
import type * as schema from "zapatos/schema";

import { getPool } from "../db.js";
import { addAuditRow } from "./audit.js";
import type { DisplayGroup } from "../../common/types/db.js";

export async function createDg(
    input: schema.display_group.Insertable,
    options?: { audit?: boolean }
): Promise<DisplayGroup> {
    const query = zap.insert("display_group", input);
    const dg = await query.run(getPool());
    if (options?.audit) {
        const { text, values } = query.compile();
        await addAuditRow({
            action: "create",
            table_name: "display_group",
            user_id: "foobar_user",
            data: {
                id: dg.id,
                text,
                values,
            },
        });
    }
    return dg;
}

export async function updateDg(
    input: schema.display_group.Updatable,
    where: schema.display_group.Whereable,
    options?: { audit?: boolean }
): Promise<DisplayGroup[]> {
    const query = zap.update(
        "display_group",
        {
            ...input,
            modified: new Date(),
            version: zap.conditions.add(1),
        },
        where
    );
    const dgs = await query.run(getPool());
    if (options?.audit) {
        const { text, values } = query.compile();
        await addAuditRow({
            action: "update",
            table_name: "display_group",
            user_id: "foobar_user",
            data: {
                ids: dgs.map((dg) => dg.id),
                text,
                values,
            },
        });
    }
    return dgs;
}

export async function deleteDg(
    where: schema.display_group.Whereable,
    options?: { audit?: boolean }
): Promise<DisplayGroup[]> {
    const query = zap.deletes("display_group", where);
    const dgs = await query.run(getPool());
    if (options?.audit) {
        const { text, values } = query.compile();
        await addAuditRow({
            action: "delete",
            table_name: "display_group",
            user_id: "foobar_user",
            data: {
                ids: dgs.map((dg) => dg.id),
                text,
                values,
            },
        });
    }
    return dgs;
}
