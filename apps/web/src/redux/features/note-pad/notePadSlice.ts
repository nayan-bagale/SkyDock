import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileT, NotePadStateT } from "@skydock/types";

const intialState = {
  actions: {
    isProcessOn: false,
    isFileActionModalOn: false,
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
      if (state.actions.isFileActionModalOn) {
        state.actions.isFileActionModalOn = false;
      }
    },
    closeNotePad: (state) => {
      state.actions.isProcessOn = false;
      state.textFileInfo = null;
    },
    setNotePadLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
    openNotePadFileActionModal(state, action: PayloadAction<boolean>) {
      state.actions.isFileActionModalOn = action.payload;
    },
  },
});

export const {
  closeNotePad,
  openNotePad,
  setNotePadLoading,
  openNotePadFileActionModal,
} = notePadSlice.actions;

export default notePadSlice.reducer;
