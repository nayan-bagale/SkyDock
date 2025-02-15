import filesexplorerReducer from "@/redux/features/apps/app/fileexplorer";
// import terminalReducer from "@/redux/features/apps/app/terminalSlice";
import authReducer from "@/redux/features/auth";
import explorerReducer from "@/redux/features/explorer/explorerSlice";
import { configureStore } from "@reduxjs/toolkit";
import backendApi from "./APISlice";
import { appsSlice } from "./features/apps/appsSlice";
import { controlCenterSlice } from "./features/control-center/controlCenterSlice";
import { terminalSlice } from "./features/terminal/terminalSlice";

export const store = configureStore({
  reducer: {
    explorer: explorerReducer,
    // terminal: terminalReducer,
    filesexplorer: filesexplorerReducer,
    auth: authReducer,
    apps: appsSlice.reducer,
    controlCenter: controlCenterSlice.reducer,
    terminal: terminalSlice.reducer,

    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
