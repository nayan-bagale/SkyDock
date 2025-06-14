import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface NotePadStateT {
  actions: ActionsT;
  notePadInfo: {
    textFileInfo: FileT | null;
    lastSaved: string | null;
    syncStatus: "saved" | "saving" | "synced" | "error";
    content: string;
  };
  state: {
    isLoading: boolean;
  };
}
