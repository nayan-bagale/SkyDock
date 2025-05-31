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
  state: {
    isLoading: false,
  },
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
    setMusicPlayerLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
  },
});

export const { openMusicPlayer, closeMusicPlayer, setMusicPlayerLoading } =
  musicPLayerSlice.actions;

export default musicPLayerSlice.reducer;
