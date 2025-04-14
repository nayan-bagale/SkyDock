import { createSlice } from "@reduxjs/toolkit";
import { LoginResponse } from "@skydock/types/Auth";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: "",
    user: null as LoginResponse | null,
    guestMode: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logOut: (state) => {
      state.accessToken = "";
      state.user = null;
      state.guestMode = false;
    },
    setGuestMode: (state, action) => {
      state.guestMode = action.payload;
    },
  },
});

export const { setCredentials, logOut, setGuestMode } = authSlice.actions;

export default authSlice.reducer;
