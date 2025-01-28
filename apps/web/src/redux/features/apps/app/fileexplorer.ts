import { createSlice } from "@reduxjs/toolkit";

export interface FileExplorer {
  action: "minimized" | "maximized" | "default";
  process: "off" | "on";
}

const initialState = {
  action: "default",
  process: "off",
} as FileExplorer;

export const filesexplorerSlice = createSlice({
  name: "filesexplorer",
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

export const { action, process } = filesexplorerSlice.actions;
export default filesexplorerSlice.reducer;
