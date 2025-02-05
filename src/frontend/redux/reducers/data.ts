import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { DisplayGroup } from "../../../common/types/db.js";

export interface TableState {
    dg: { [id: number]: DisplayGroup };
}

const initialState: TableState = {
    dg: {},
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
    },
});

export const dataActions = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
