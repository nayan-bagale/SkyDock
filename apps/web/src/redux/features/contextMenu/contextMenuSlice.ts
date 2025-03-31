import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ContextMenuLocation =
  | "explorer"
  | "desktop"
  | "terminal"
  | "settings"
  | "imageViewer"
  | null;

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  location: ContextMenuLocation;
  targetId: string | null; // ID of the item being right-clicked (if applicable)
  additionalData?: any; // Any additional data needed for context menu actions
}

const initialState: ContextMenuState = {
  isOpen: false,
  position: { x: 0, y: 0 },
  location: null,
  targetId: null,
  additionalData: null,
};

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
