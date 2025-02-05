import React from "react";
import { Stack } from "@mui/material";

import { AuditTable } from "./AuditTable.js";
import { DisplayGroupTable } from "./DisplayGroupTable.js";

export function Application() {
    return (
        <Stack spacing={2} direction="column" alignItems="flex-start">
            <h2>Display Groups</h2>
            <DisplayGroupTable />

            <h2>Audit Logs</h2>
            <AuditTable />
        </Stack>
    );
}
