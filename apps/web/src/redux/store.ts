import authReducer from "@/redux/features/auth";
import explorerReducer from "@/redux/features/explorer/explorerSlice";
import { configureStore } from "@reduxjs/toolkit";
import filesAndFolderApi from "./apis/filesAndFolderApi";
import planApi from "./apis/planApis";
import userAuthApi from "./apis/userAuthApi";
import aiReducer from "./features/ai/aiSlice";
import { appsSlice } from "./features/apps/appsSlice";
import contextMenuReducer from "./features/contextMenu/contextMenuSlice";
import { controlCenterSlice } from "./features/control-center/controlCenterSlice";
import imageViewerReducer from "./features/imageViewer/imageViewerSlice";
import lockScreenReducer from "./features/lockScreen/lockScreenSlice";
import musicPlayerReducer from "./features/music-player/musicPlayerSlice";
import pdfReaderReducer from "./features/pdf-reader/pdfReaderSlice";
import { settingsSlice } from "./features/settings/settingsSlice";
import skydockReducer from "./features/skydock/skydockSlice";
import { terminalSlice } from "./features/terminal/terminalSlice";
import videoPlayerReducer from "./features/video-player/videoPlayerSlice";

export const store = configureStore({
  reducer: {
    explorer: explorerReducer,
    auth: authReducer,
    apps: appsSlice.reducer,
    controlCenter: controlCenterSlice.reducer,
    terminal: terminalSlice.reducer,
    settings: settingsSlice.reducer,
    contextMenu: contextMenuReducer,
    imageViewer: imageViewerReducer,
    lockScreen: lockScreenReducer,
    musicPlayer: musicPlayerReducer,
    videoPlayer: videoPlayerReducer,
    pdfReader: pdfReaderReducer,
    skydock: skydockReducer,
    ai: aiReducer,

    [userAuthApi.reducerPath]: userAuthApi.reducer,
    [filesAndFolderApi.reducerPath]: filesAndFolderApi.reducer,
    [planApi.reducerPath]: planApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAuthApi.middleware)
      .concat(filesAndFolderApi.middleware)
      .concat(planApi.middleware),
  devTools: process.env.NODE_ENV !== "prod",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
