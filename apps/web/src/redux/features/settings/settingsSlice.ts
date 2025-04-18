import { background, theme } from "@/constants/settings";
import { createSlice } from "@reduxjs/toolkit";
import { SettingsT } from "@skydock/types";

const intialState = {
  apperance: {
    theme: theme[2],
    background: background[0],
  },
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
    changeTheme: (state, action) => {
      state.apperance.theme = action.payload;
    },
    changeBackground: (state, action) => {
      state.apperance.background = action.payload;
    },
  },
});

export const { settingsProcess, changeTheme, changeBackground } =
  settingsSlice.actions;

export default settingsSlice.reducer;
