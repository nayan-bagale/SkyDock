import { createSlice } from "@reduxjs/toolkit";
import { SkydockT } from "@skydock/types";

const intialState = {
  isLoading: true,
  isError: false,
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
  },
});

export const { setSkydockError, setSkydockLoading } = skydockSlice.actions;

export default skydockSlice.reducer;
