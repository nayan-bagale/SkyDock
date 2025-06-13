import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface NotePadStateT {
  actions: ActionsT;
  textFileInfo: FileT | null;
  state: {
    isLoading: boolean;
  };
}
