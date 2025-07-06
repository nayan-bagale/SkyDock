import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
  cameraInfo: null,
  state: {
    isLoading: false,
  },
} as CameraStateT;

export const cameraSlice = createSlice({
  name: "camera",
  initialState: intialState,
  reducers: {
    openCamera: (state) => {
      state.actions.isProcessOn = true;
    },
    closeCamera: (state) => {
      state.actions.isProcessOn = false;
    },
    setCameraLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
  },
});

export const { openCamera, closeCamera, setCameraLoading } =
  cameraSlice.actions;

export default cameraSlice.reducer;
