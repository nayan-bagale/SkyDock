import { createSlice } from "@reduxjs/toolkit";
import { TerminalT } from "@skydock/types";

const intialState = {
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
} as TerminalT;

export const terminalSlice = createSlice({
  name: "terminal",
  initialState: intialState,
  reducers: {
    terminalProcess: (state, action) => {
      state.actions.isProcessOn = action.payload;
    },
    setTerminalLoading: (state, action) => {
      state.state.isLoading = action.payload;
    },
  },
});

export const { terminalProcess, setTerminalLoading } = terminalSlice.actions;

export default terminalSlice.reducer;
