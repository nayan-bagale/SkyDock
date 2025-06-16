import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileT, ImageViewerStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
    isFileActionModalOn: false,
  },
  imageViewerInfo: {
    imageUrl: null,
    imageFileInfo: null,
  },
  state: {
    isLoading: false,
  },
} as ImageViewerStateT;

export const imageViewSlice = createSlice({
  name: "imageViewer",
  initialState: intialState,
  reducers: {
    openImageViewer: (state, action: PayloadAction<FileT | null>) => {
      state.actions.isProcessOn = true;
      state.imageViewerInfo.imageFileInfo = action.payload;
      if (state.actions.isFileActionModalOn) {
        state.actions.isFileActionModalOn = false;
      }
    },
    closeImageViewer: (state) => {
      state.actions.isProcessOn = false;
      state.imageViewerInfo.imageFileInfo = null;
      state.imageViewerInfo.imageUrl = null;
    },
    setImageViewerLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },

    setImageViewerLastPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.actions.lastPosition = action.payload;
    },
    setImageUrl: (state, action: PayloadAction<string | null>) => {
      state.imageViewerInfo.imageUrl = action.payload;
    },
    setImageFileActionModalOn: (state, action: PayloadAction<boolean>) => {
      state.actions.isFileActionModalOn = action.payload;
    },
  },
});

export const {
  openImageViewer,
  closeImageViewer,
  setImageViewerLoading,
  setImageViewerLastPosition,
  setImageUrl,
  setImageFileActionModalOn,
} = imageViewSlice.actions;

export default imageViewSlice.reducer;
