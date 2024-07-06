import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "@/redux/features/files/filesSlice";

export const store = configureStore({
  reducer: filesReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
