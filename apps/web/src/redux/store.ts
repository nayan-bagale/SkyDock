import filesexplorerReducer from "@/redux/features/apps/app/fileexplorer";
import terminalReducer from "@/redux/features/apps/app/terminalSlice";
import authReducer from "@/redux/features/auth";
import filesReducer from "@/redux/features/files/filesSlice";
import { configureStore } from "@reduxjs/toolkit";
import backendApi from "./APISlice";

export const store = configureStore({
  reducer: {
    files: filesReducer,
    terminal: terminalReducer,
    filesexplorer: filesexplorerReducer,
    auth: authReducer,
    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
