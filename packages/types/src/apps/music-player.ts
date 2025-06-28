import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface MusicPlayerStateT {
  actions: ActionsT;
  musicPlayerInfo: {
    musicFileInfo: FileT | null;
    musicUrl: string | null;
  };
  state: {
    isLoading: boolean;
  };
}
