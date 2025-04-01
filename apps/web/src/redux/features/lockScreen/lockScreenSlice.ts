import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LockScreenState {
  isLocked: boolean;
  pin: string | null;
  attempts: number;
  maxAttempts: number;
  lockTime: number | null; // Timestamp when the screen was locked
}

const initialState: LockScreenState = {
  isLocked: true,
  pin: "123",
  attempts: 0,
  maxAttempts: 3,
  lockTime: null,
};

export const lockScreenSlice = createSlice({
  name: "lockScreen",
  initialState,
  reducers: {
    lockScreen: (state) => {
      state.isLocked = true;
      state.lockTime = Date.now();
    },
    unlockScreen: (state) => {
      state.isLocked = false;
      state.attempts = 0;
      state.lockTime = null;
    },
    setPin: (state, action: PayloadAction<string>) => {
      state.pin = action.payload;
    },
    attemptUnlock: (state, action: PayloadAction<string>) => {
      if (state.pin === action.payload) {
        state.isLocked = false;
        state.attempts = 0;
        state.lockTime = null;
      } else {
        state.attempts += 1;
      }
    },
    resetAttempts: (state) => {
      state.attempts = 0;
    },
  },
});

export const {
  lockScreen,
  unlockScreen,
  setPin,
  attemptUnlock,
  resetAttempts,
} = lockScreenSlice.actions;

export default lockScreenSlice.reducer;
