import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SkydockT } from "@skydock/types";

const intialState = {
  isLoading: true,
  isError: false,
  appsMenu: {
    isOpen: false,
    isLoading: false,
    isProcessOn: false,
  },
} as SkydockT;

export const skydockSlice = createSlice({
  name: "skydock",
  initialState: intialState,
  reducers: {
    setSkydockLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSkydockError: (state, action) => {
      state.isError = action.payload;
    },
    setAppsMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.appsMenu.isOpen = action.payload;
    },
    setAppsMenuLoading: (state, action: PayloadAction<boolean>) => {
      state.appsMenu.isLoading = action.payload;
    },
  },
});

export const {
  setSkydockError,
  setSkydockLoading,
  setAppsMenuOpen,
  setAppsMenuLoading,
} = skydockSlice.actions;

export default skydockSlice.reducer;
