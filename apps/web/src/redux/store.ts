import authReducer from "@/redux/features/auth";
import explorerReducer from "@/redux/features/explorer/explorerSlice";
import { configureStore } from "@reduxjs/toolkit";
import filesAndFolderApi from "./apis/filesAndFolderApi";
import userAuthApi from "./apis/userAuthApi";
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

    [userAuthApi.reducerPath]: userAuthApi.reducer,
    [filesAndFolderApi.reducerPath]: filesAndFolderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAuthApi.middleware)
      .concat(filesAndFolderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
