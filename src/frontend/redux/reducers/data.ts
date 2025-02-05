import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { DisplayGroup, AuditLog } from "../../../common/types/db.js";

export interface TableState {
    dg: { [id: number]: DisplayGroup };
    auditLogs: AuditLog[];
}

const initialState: TableState = {
    dg: {},
    auditLogs: [],
};

export const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        upsertDgs(state, action: PayloadAction<{ dgs: DisplayGroup[] }>) {
            for (const dg of action.payload.dgs) {
                const existingDg = state.dg[dg.id];
                if (dg.version > (existingDg?.version ?? 0)) {
                    state.dg[dg.id] = dg;
                }
            }
        },
        deleteDgs(state, action: PayloadAction<{ ids: number[] }>) {
            for (const id of action.payload.ids) {
                delete state.dg[id];
            }
        },
        addAuditLog(state, action: PayloadAction<{ auditLog: AuditLog }>) {
            const { auditLog } = action.payload;
            if (!state.auditLogs.find((v) => v.id === auditLog.id)) {
                state.auditLogs.unshift(auditLog as any); // Weird ts error without casting to any...
                state.auditLogs.sort(
                    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
                );
                state.auditLogs = state.auditLogs.slice(0, 100); // Keep only 100 latest
            }
        },
    },
});

export const dataActions = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
