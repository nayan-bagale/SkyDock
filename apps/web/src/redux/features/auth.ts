import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "@skydock/types/Auth";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: "",
    user: null as UserInfo | null,
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
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    setGuestMode: (state, action) => {
      state.guestMode = action.payload;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setUserInfo,
  logOut,
  setGuestMode,
} = authSlice.actions;

export default authSlice.reducer;
