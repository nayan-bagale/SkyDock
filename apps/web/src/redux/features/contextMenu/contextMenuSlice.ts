import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppsT } from "@skydock/types/enums";

type AppNames = `${AppsT}`;

export type ContextMenuLocation = "Desktop" | "Dock" | AppNames | null;

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  location: ContextMenuLocation;
  targetId: string | null; // ID of the item being right-clicked (if applicable)
  additionalData?: any; // Any additional data needed for context menu actions
}

const initialState = {
  isOpen: false,
  position: { x: 0, y: 0 },
  location: null,
  targetId: null,
  additionalData: null,
} as ContextMenuState;

export const contextMenuSlice = createSlice({
  name: "contextMenu",
  initialState,
  reducers: {
    openContextMenu: (
      state,
      action: PayloadAction<{
        position: { x: number; y: number };
        location: ContextMenuLocation;
        targetId?: string;
        additionalData?: any;
      }>
    ) => {
      state.isOpen = true;
      state.position = action.payload.position;
      state.location = action.payload.location;
      state.targetId = action.payload.targetId || null;
      state.additionalData = action.payload.additionalData || null;
    },
    closeContextMenu: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openContextMenu, closeContextMenu } = contextMenuSlice.actions;

export default contextMenuSlice.reducer;
