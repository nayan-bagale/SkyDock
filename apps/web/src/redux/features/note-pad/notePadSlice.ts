import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileT, NotePadStateT } from "@skydock/types";

const intialState = {
  actions: {
    isProcessOn: false,
    isFileActionModalOn: false,
    lastPosition: { x: 0, y: 0 },
  },
  notePadInfo: {
    textFileInfo: null,
    lastSaved: null,
    syncStatus: "saved",
    content: "",
  },
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
      state.notePadInfo.textFileInfo = action.payload;
      if (state.actions.isFileActionModalOn) {
        state.actions.isFileActionModalOn = false;
      }
    },
    closeNotePad: (state) => {
      state.actions.isProcessOn = false;
      state.notePadInfo.textFileInfo = null;
      state.notePadInfo.content = "";
      state.notePadInfo.lastSaved = null;
    },
    setNotePadLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
    openNotePadFileActionModal(state, action: PayloadAction<boolean>) {
      state.actions.isFileActionModalOn = action.payload;
    },
    setNotePadContent: (state, action: PayloadAction<string>) => {
      state.notePadInfo.content = action.payload;
    },
    setNotePadLastSaved: (state, action: PayloadAction<string | null>) => {
      state.notePadInfo.lastSaved = action.payload;
    },
    setNotePadSyncStatus: (
      state,
      action: PayloadAction<"saved" | "saving" | "synced" | "error">
    ) => {
      state.notePadInfo.syncStatus = action.payload;
    },
    resetNotePad: () => {
      return intialState;
    },

    setLastPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.actions.lastPosition = action.payload;
    },
  },
});

export const {
  closeNotePad,
  openNotePad,
  setNotePadLoading,
  openNotePadFileActionModal,
  resetNotePad,
  setNotePadContent,
  setNotePadLastSaved,
  setNotePadSyncStatus,
  setLastPosition,
} = notePadSlice.actions;

export default notePadSlice.reducer;
