import authReducer from "@/redux/features/auth";
import explorerReducer from "@/redux/features/explorer/explorerSlice";
import { configureStore } from "@reduxjs/toolkit";
import backendApi from "./APISlice";
import { appsSlice } from "./features/apps/appsSlice";
import contextMenuReducer from "./features/contextMenu/contextMenuSlice";
import { controlCenterSlice } from "./features/control-center/controlCenterSlice";
import contextImageViewer from "./features/imageViewer/imageViewerSlice";
import lockScreenReducer from "./features/lockScreen/lockScreenSlice";
import { settingsSlice } from "./features/settings/settingsSlice";
import { terminalSlice } from "./features/terminal/terminalSlice";

export const store = configureStore({
  reducer: {
    explorer: explorerReducer,
    auth: authReducer,
    apps: appsSlice.reducer,
    controlCenter: controlCenterSlice.reducer,
    terminal: terminalSlice.reducer,
    settings: settingsSlice.reducer,
    contextMenu: contextMenuReducer,
    imageViewer: contextImageViewer,
    lockScreen: lockScreenReducer,

    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
