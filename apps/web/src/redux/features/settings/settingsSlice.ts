import { createSlice } from "@reduxjs/toolkit";
import { SettingsT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
} as SettingsT;

export const settingsSlice = createSlice({
  name: "settings",
  initialState: intialState,
  reducers: {
    settingsProcess: (state, action) => {
      state.actions.isProcessOn = action.payload;
    },
  },
});

export const { settingsProcess } = settingsSlice.actions;

export default settingsSlice.reducer;
