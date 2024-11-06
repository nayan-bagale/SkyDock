import { createSlice } from "@reduxjs/toolkit";
import { LoginResponse } from "@repo/types/Auth";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: "",
    user: null as LoginResponse | null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logOut: (state) => {
      state.accessToken = "";
      state.user = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
