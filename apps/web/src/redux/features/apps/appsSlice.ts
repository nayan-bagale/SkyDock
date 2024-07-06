import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  apps: {
    terminal: {
      id: nanoid(),
      name: "Terminal",
      icon: "terminal",
      description: "Terminal",
      status: "active",
      zIndex: 0,
    },
  },
};

export const appsSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {},
});

export default appsSlice.reducer;
