import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageViewerStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
  imageViewer: {
    currentImageId: null,
  },
} as ImageViewerStateT;

export const imageViewSlice = createSlice({
  name: "imageViewer",
  initialState: intialState,
  reducers: {
    openImageViewer: (state, action: PayloadAction<string | null>) => {
      state.actions.isProcessOn = true;
      state.imageViewer.currentImageId = action.payload;
    },
    closeImageViewer: (state) => {
      state.actions.isProcessOn = false;
      state.imageViewer.currentImageId = null;
    },
  },
});

export const { openImageViewer, closeImageViewer } = imageViewSlice.actions;

export default imageViewSlice.reducer;
