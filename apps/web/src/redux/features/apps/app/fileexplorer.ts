import { createSlice } from "@reduxjs/toolkit";

export interface FileExplorer {
  action: "minimized" | "maximized" | "default";
  process: "off" | "on";
  view: "grid" | "row";
}

const initialState = {
  action: "default",
  process: "off",
  view: "grid",
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
    changeView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const { action, process, changeView } = filesexplorerSlice.actions;
export default filesexplorerSlice.reducer;
