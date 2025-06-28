import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileT, PdfReaderStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
  pdfReaderInfo: {
    pdfFileInfo: null,
    pdfUrl: null,
  },
  state: {
    isLoading: false,
  },
} as PdfReaderStateT;

export const pdfReaderSlice = createSlice({
  name: "pdfReader",
  initialState: intialState,
  reducers: {
    openPdfReader: (state, action: PayloadAction<FileT | null>) => {
      state.actions.isProcessOn = true;
      state.pdfReaderInfo.pdfFileInfo = action.payload;
      if (state.actions.isFileActionModalOn) {
        state.actions.isFileActionModalOn = false;
      }
    },
    closePdfReader: (state) => {
      state.actions.isProcessOn = false;
      state.pdfReaderInfo.pdfFileInfo = null;
      state.pdfReaderInfo.pdfUrl = null;
    },
    setPdfReaderLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },

    setPdfReaderLastPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.actions.lastPosition = action.payload;
    },
    setPdfUrl: (state, action: PayloadAction<string | null>) => {
      state.pdfReaderInfo.pdfUrl = action.payload;
    },
    setPdfFileActionModalOn: (state, action: PayloadAction<boolean>) => {
      state.actions.isFileActionModalOn = action.payload;
    },
  },
});

export const {
  closePdfReader,
  openPdfReader,
  setPdfReaderLoading,
  setPdfFileActionModalOn,
  setPdfReaderLastPosition,
  setPdfUrl,
} = pdfReaderSlice.actions;

export default pdfReaderSlice.reducer;
