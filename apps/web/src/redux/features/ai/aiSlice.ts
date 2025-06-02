import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AiT } from "@skydock/types";

const initialState: AiT = {
  chatBoxOpen: false,
};

export const aiSlice = createSlice({
  name: "ai",
  initialState: initialState,
  reducers: {
    setAiChatBoxOpen: (state, action: PayloadAction<boolean>) => {
      state.chatBoxOpen = action.payload;
    },
  },
});

export const { setAiChatBoxOpen } = aiSlice.actions;

export default aiSlice.reducer;
