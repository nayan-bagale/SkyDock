import { createSlice } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  fileName: string;
  type: "upload" | "download";
  status: "pending" | "success" | "error";

  progress: number;
}

export const controlCenterSlice = createSlice({
  name: "controlCenter",
  initialState: {
    notifications: [] as Notification[],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    updateNotification: (state, action) => {
      const index = state.notifications.findIndex(
        (notification) => notification.id === action.payload.id
      );
      state.notifications[index] = {
        ...state.notifications[index],
        ...action.payload,
      };
    },
  },
});

export const { addNotification, removeNotification, updateNotification } =
  controlCenterSlice.actions;

export default controlCenterSlice.reducer;
