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
  musicPlayerInfo: {
    musicFileInfo: null,
    musicUrl: null,
  },
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
      state.musicPlayerInfo.musicFileInfo = action.payload;
      if (state.actions.isFileActionModalOn) {
        state.actions.isFileActionModalOn = false;
      }
    },
    closeMusicPlayer: (state) => {
      state.actions.isProcessOn = false;
      state.musicPlayerInfo.musicFileInfo = null;
      state.musicPlayerInfo.musicUrl = null;
    },
    setMusicPlayerLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },
    setMusicPlayerLastPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.actions.lastPosition = action.payload;
    },
    setMusicUrl: (state, action: PayloadAction<string | null>) => {
      state.musicPlayerInfo.musicUrl = action.payload;
    },
    setMusicFileActionModalOn: (state, action: PayloadAction<boolean>) => {
      state.actions.isFileActionModalOn = action.payload;
    },
  },
});

export const {
  openMusicPlayer,
  closeMusicPlayer,
  setMusicPlayerLoading,
  setMusicFileActionModalOn,
  setMusicPlayerLastPosition,
  setMusicUrl,
} = musicPLayerSlice.actions;

export default musicPLayerSlice.reducer;
