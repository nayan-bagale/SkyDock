import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface MusicPlayerStateT {
  actions: ActionsT;
  musicInfo: FileT | null;
  state: {
    isLoading: boolean;
  };
}
