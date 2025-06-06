import { background, theme } from "@/constants/settings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackgroundT, SettingsT, ThemeT } from "@skydock/types";

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
  state: {
    isLoading: false,
  },
} as SettingsT;

export const settingsSlice = createSlice({
  name: "settings",
  initialState: intialState,
  reducers: {
    settingsProcess: (state, action) => {
      state.actions.isProcessOn = action.payload;
    },
    changeTheme: (state, action: PayloadAction<ThemeT>) => {
      state.apperance.theme = action.payload;
    },
    changeBackground: (state, action: PayloadAction<BackgroundT>) => {
      state.apperance.background = action.payload;
    },
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
  },
});

export const {
  settingsProcess,
  changeTheme,
  changeBackground,
  setSettingsLoading,
} = settingsSlice.actions;

export default settingsSlice.reducer;
