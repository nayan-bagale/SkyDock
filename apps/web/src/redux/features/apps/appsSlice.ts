import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FocusedAppsT } from "@skydock/types";

export interface AppsStateT {
  focusedApp: FocusedAppsT;
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
    setFocusedApp: (state, action: PayloadAction<FocusedAppsT>) => {
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
