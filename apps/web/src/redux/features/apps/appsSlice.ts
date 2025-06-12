import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppsT } from "@skydock/types/enums";

type ExcludeAppsT = Exclude<keyof typeof AppsT, "AppsMenu"> | "";

export interface AppsStateT {
  focusedApp: ExcludeAppsT;
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
    setFocusedApp: (state, action: PayloadAction<ExcludeAppsT>) => {
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
