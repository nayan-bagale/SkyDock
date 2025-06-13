import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileT, NotePadStateT } from "@skydock/types";

const intialState = {
  actions: {
    isProcessOn: false,
  },
  textFileInfo: null,
  state: {
    isLoading: false,
  },
} as NotePadStateT;

export const notePadSlice = createSlice({
  name: "notePad",
  initialState: intialState,
  reducers: {
    openNotePad: (state, action: PayloadAction<FileT | null>) => {
      state.actions.isProcessOn = true;
      state.textFileInfo = action.payload;
    },
    closeNotePad: (state) => {
      state.actions.isProcessOn = false;
      state.textFileInfo = null;
    },
    setNotePadLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
  },
});

export const { closeNotePad, openNotePad, setNotePadLoading } =
  notePadSlice.actions;

export default notePadSlice.reducer;
