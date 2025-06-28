import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface VideoPlayerStateT {
  actions: ActionsT;
  videoPlayerInfo: {
    videoFileInfo: FileT | null;
    videoUrl: string | null;
  };
  state: {
    isLoading: boolean;
  };
}
