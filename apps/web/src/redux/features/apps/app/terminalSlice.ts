import { createSlice } from "@reduxjs/toolkit";

export interface TerminalStateT {
  action: "minimized" | "maximized" | "default";
  process: "off" | "on";
}

const initialState = {
  action: "default",
  process: "off",
} as TerminalStateT;

export const appsSlice = createSlice({
  name: "terminal",
  initialState: initialState,
  reducers: {
    action: (state, action) => {
      state.action = action.payload;
    },
    process: (state, action) => {
      state.process = action.payload;
    },
  },
});

export const { action, process } = appsSlice.actions;
export default appsSlice.reducer;
