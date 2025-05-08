import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideoPlayerStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
  videoPlayer: {
    currentVideoId: null,
  },
} as VideoPlayerStateT;

export const videoPlayerSlice = createSlice({
  name: "videoPlayer",
  initialState: intialState,
  reducers: {
    openVideoPlayer: (state, action: PayloadAction<string | null>) => {
      state.actions.isProcessOn = true;
      state.videoPlayer.currentVideoId = action.payload;
    },
    closeVideoPlayer: (state) => {
      state.actions.isProcessOn = false;
      state.videoPlayer.currentVideoId = null;
    },
  },
});

export const { openVideoPlayer, closeVideoPlayer } = videoPlayerSlice.actions;

export default videoPlayerSlice.reducer;
