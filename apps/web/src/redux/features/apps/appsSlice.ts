import { createSlice, nanoid } from "@reduxjs/toolkit";

export interface AppsStateT {
  apps: {
    id: string;
    name: string;
    process: "off" | "on";
  }[];
}

const initialState: AppsStateT = {
  apps: [
    {
      id: nanoid(),
      name: "Terminal",
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
  },
});

export const { process } = appsSlice.actions;

export default appsSlice.reducer;
