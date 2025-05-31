import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileT, VideoPlayerStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
  videoInfo: null,
  state: {
    isLoading: false,
  },
} as VideoPlayerStateT;

export const videoPlayerSlice = createSlice({
  name: "videoPlayer",
  initialState: intialState,
  reducers: {
    openVideoPlayer: (state, action: PayloadAction<FileT | null>) => {
      state.actions.isProcessOn = true;
      state.videoInfo = action.payload;
    },
    closeVideoPlayer: (state) => {
      state.actions.isProcessOn = false;
      state.videoInfo = null;
    },
    setVideoPlayerLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
  },
});

export const { openVideoPlayer, closeVideoPlayer, setVideoPlayerLoading } =
  videoPlayerSlice.actions;

export default videoPlayerSlice.reducer;
