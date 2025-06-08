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
  pdfInfo: null,
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
      state.pdfInfo = action.payload;
    },
    closePdfReader: (state) => {
      state.actions.isProcessOn = false;
      state.pdfInfo = null;
    },
    setPdfReaderLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
  },
});

export const { closePdfReader, openPdfReader, setPdfReaderLoading } =
  pdfReaderSlice.actions;

export default pdfReaderSlice.reducer;
