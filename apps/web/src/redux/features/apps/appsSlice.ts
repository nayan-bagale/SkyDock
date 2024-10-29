import { createSlice, nanoid } from "@reduxjs/toolkit";

enum AppsT {
  Terminal = "Terminal",
  Explorer = "Explorer",
}

export interface AppsStateT {
  zIndex: keyof typeof AppsT | "";
  apps: {
    id: string;
    name: string;
    process: "off" | "on";
  }[];
}

const initialState: AppsStateT = {
  zIndex: "",
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
    setZIndex: (state, action) => {
      state.zIndex = action.payload;
    },
  },
});

export const { process, setZIndex } = appsSlice.actions;

export default appsSlice.reducer;
