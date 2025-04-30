import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MusicPlayerStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
} as MusicPlayerStateT;

export const musicPLayerSlice = createSlice({
  name: "musicPLayer",
  initialState: intialState,
  reducers: {
    openMusicPlayer: (state, action: PayloadAction<string>) => {
      state.actions.isProcessOn = true;
    },
    closeMusicPlayer: (state) => {
      state.actions.isProcessOn = false;
    },
  },
});

export const { openMusicPlayer, closeMusicPlayer } = musicPLayerSlice.actions;

export default musicPLayerSlice.reducer;
