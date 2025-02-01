import { createSlice, nanoid } from "@reduxjs/toolkit";
import { AppsT } from "@skydock/types/enums";

export interface AppsStateT {
  focusedApp: keyof typeof AppsT | "";
  apps: {
    id: string;
    name: string;
    process: "off" | "on";
  }[];
}

const initialState: AppsStateT = {
  focusedApp: "",
  apps: [
    {
      id: nanoid(),
      name: AppsT.Terminal,
      process: "off",
    },
  ],
};

export const appsSlice = createSlice({
  name: "apps",
  initialState: initialState,
  reducers: {
    process: (state, action) => {
      state.apps = state.apps.map((app) => {
        if (app.name === action.payload.name) {
          app.process = action.payload.process;
        }
        return app;
      });
    },

    setFocusedApp: (state, action) => {
      state.focusedApp = action.payload;
    },
  },
});

export const { process, setFocusedApp } = appsSlice.actions;

export default appsSlice.reducer;
