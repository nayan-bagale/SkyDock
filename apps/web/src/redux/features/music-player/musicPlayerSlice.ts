import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileT, MusicPlayerStateT } from "@skydock/types";

const intialState = {
  actions: {
    isMaximized: false,
    isMinimized: false,
    isProcessOn: false,
    lastPosition: { x: 0, y: 0 },
    lastSize: { width: 0, height: 0 },
  },
  musicInfo: null,
} as MusicPlayerStateT;

export const musicPLayerSlice = createSlice({
  name: "musicPLayer",
  initialState: intialState,
  reducers: {
    openMusicPlayer: (state, action: PayloadAction<FileT | null>) => {
      state.actions.isProcessOn = true;
      state.musicInfo = action.payload;
    },
    closeMusicPlayer: (state) => {
      state.actions.isProcessOn = false;
      state.musicInfo = null;
    },
  },
});

export const { openMusicPlayer, closeMusicPlayer } = musicPLayerSlice.actions;

export default musicPLayerSlice.reducer;
