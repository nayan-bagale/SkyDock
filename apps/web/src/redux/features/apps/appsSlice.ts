import { createSlice } from "@reduxjs/toolkit";
import { AppsT } from "@skydock/types/enums";

export interface AppsStateT {
  focusedApp: keyof typeof AppsT | "";
}

const initialState: AppsStateT = {
  focusedApp: "",
};

export const appsSlice = createSlice({
  name: "apps",
  initialState: initialState,
  reducers: {
    setFocusedApp: (state, action) => {
      state.focusedApp = action.payload;
    },
  },
});

export const { setFocusedApp } = appsSlice.actions;

export default appsSlice.reducer;
