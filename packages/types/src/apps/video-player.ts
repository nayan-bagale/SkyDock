import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface VideoPlayerStateT {
  actions: ActionsT;
  videoInfo: FileT | null;
  state: {
    isLoading: boolean;
  };
}
