import { createSlice } from "@reduxjs/toolkit";
import { AppsT } from "@skydock/types/enums";

export interface AppsStateT {
  focusedApp: keyof typeof AppsT | "";
  subscriptionPlanCard: boolean;
}

const initialState: AppsStateT = {
  focusedApp: "",
  subscriptionPlanCard: false,
};

export const appsSlice = createSlice({
  name: "apps",
  initialState: initialState,
  reducers: {
    setFocusedApp: (state, action) => {
      state.focusedApp = action.payload;
    },
    openSubscriptionPlanCard: (state) => {
      state.subscriptionPlanCard = true;
    },
    closeSubscriptionPlanCard: (state) => {
      state.subscriptionPlanCard = false;
    },
  },
});

export const {
  setFocusedApp,
  openSubscriptionPlanCard,
  closeSubscriptionPlanCard,
} = appsSlice.actions;

export default appsSlice.reducer;
