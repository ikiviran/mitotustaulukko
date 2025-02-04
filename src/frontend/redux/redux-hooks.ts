// From: https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
// Since these are actual variables, not types, it's important to define them in a separate file such as app/hooks.ts,
// not the store setup file. This allows you to import them into any component file that needs to use the hooks,
// and avoids potential circular import dependency issues.

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from './store.js'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
