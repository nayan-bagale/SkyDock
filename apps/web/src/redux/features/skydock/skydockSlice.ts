import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SkydockT } from "@skydock/types";

const intialState: SkydockT = {
  isLoading: true,
  isError: false,
  appsMenu: {
    isOpen: false,
    isLoading: false,
    isProcessOn: false,
  },
  browserApis: {
    camera: {
      permission: "Prompt",
      error: undefined,
    },
  },
};

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

    setCameraPermission: (
      state,
      action: PayloadAction<"Allowed" | "Denied" | "Prompt" | undefined>
    ) => {
      state.browserApis.camera.permission = action.payload;
    },
  },
});

export const {
  setSkydockError,
  setSkydockLoading,
  setAppsMenuOpen,
  setAppsMenuLoading,
  setCameraPermission,
} = skydockSlice.actions;

export default skydockSlice.reducer;
