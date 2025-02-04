import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import { dataReducer } from "./reducers/data.js";

// Documentation: https://redux-toolkit.js.org/tutorials/typescript

export const store = configureStore({
    reducer: {
        data: dataReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppThunk = ThunkAction<void, RootState, any, Action<string>>;
