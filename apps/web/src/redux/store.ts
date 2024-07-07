import terminalReducer from "@/redux/features/apps/app/terminalSlice";
import filesReducer from "@/redux/features/files/filesSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    files: filesReducer,
    terminal: terminalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
